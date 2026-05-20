// Cache interface
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

// Logger for cache operations
const cacheLogger = {
  info: (message: string) => console.info(`[Cache] ${message}`),
  warn: (message: string) => console.warn(`[Cache] ${message}`),
  error: (message: string, error?: any) => console.error(`[Cache] ${message}`, error),
};

// In-memory cache implementation
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    // Convert to array to avoid iteration issues
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      cacheLogger.info(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      cacheLogger.info(`Cache expired for key: ${key}`);
      return null;
    }
    
    cacheLogger.info(`Cache hit for key: ${key}`);
    return entry.data;
  }

  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || 300; // Default 5 minutes
    const expiresAt = Date.now() + (ttl * 1000);
    
    this.cache.set(key, { data, expiresAt });
    cacheLogger.info(`Cache set for key: ${key} (TTL: ${ttl}s)`);
  }

  async invalidate(key: string): Promise<void> {
    const existed = this.cache.has(key);
    this.cache.delete(key);
    
    if (existed) {
      cacheLogger.info(`Cache invalidated for key: ${key}`);
    }
  }

  async clear(): Promise<void> {
    const size = this.cache.size;
    this.cache.clear();
    cacheLogger.info(`Cache cleared (${size} entries removed)`);
  }

  async size(): Promise<number> {
    return this.cache.size;
  }

  // Cleanup method for graceful shutdown
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Redis cache implementation (fallback if Redis is available)
class RedisCache {
  private redis: any;
  private isConnected = false;

  constructor() {
    // Dynamic import to avoid bundling Redis client if not needed
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      if (!process.env.REDIS_URL) {
        cacheLogger.warn('REDIS_URL not set, falling back to memory cache');
        return;
      }

      // Try to import Redis - handle optional dependency
      let Redis: any;
      try {
        // Use require for optional dependency to avoid TypeScript issues
        const redisModule = eval('require')('redis');
        Redis = redisModule.createClient;
      } catch (importError) {
        cacheLogger.warn('Redis module not found, falling back to memory cache');
        return;
      }

      this.redis = Redis({
        url: process.env.REDIS_URL,
        socket: {
          connectTimeout: 5000,
        },
      });

      this.redis.on('error', (err: any) => {
        cacheLogger.error('Redis connection error', err);
        this.isConnected = false;
      });

      this.redis.on('connect', () => {
        cacheLogger.info('Redis connected');
        this.isConnected = true;
      });

      await this.redis.connect();
    } catch (error) {
      cacheLogger.error('Failed to initialize Redis', error);
      this.isConnected = false;
    }
  }

  private async ensureConnected(): Promise<boolean> {
    if (!this.isConnected) {
      await this.initializeRedis();
    }
    return this.isConnected;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!(await this.ensureConnected())) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      if (value === null) {
        cacheLogger.info(`Cache miss for key: ${key}`);
        return null;
      }

      const parsed = JSON.parse(value) as CacheEntry<T>;
      
      if (parsed.expiresAt <= Date.now()) {
        await this.redis.del(key);
        cacheLogger.info(`Cache expired for key: ${key}`);
        return null;
      }

      cacheLogger.info(`Cache hit for key: ${key}`);
      return parsed.data;
    } catch (error) {
      cacheLogger.error(`Redis get error for key: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    if (!(await this.ensureConnected())) {
      return;
    }

    try {
      const ttl = options.ttl || 300; // Default 5 minutes
      const expiresAt = Date.now() + (ttl * 1000);
      const entry: CacheEntry<T> = { data, expiresAt };
      
      await this.redis.setEx(key, ttl, JSON.stringify(entry));
      cacheLogger.info(`Cache set for key: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      cacheLogger.error(`Redis set error for key: ${key}`, error);
    }
  }

  async invalidate(key: string): Promise<void> {
    if (!(await this.ensureConnected())) {
      return;
    }

    try {
      const result = await this.redis.del(key);
      if (result > 0) {
        cacheLogger.info(`Cache invalidated for key: ${key}`);
      }
    } catch (error) {
      cacheLogger.error(`Redis invalidate error for key: ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    if (!(await this.ensureConnected())) {
      return;
    }

    try {
      await this.redis.flushDb();
      cacheLogger.info('Redis cache cleared');
    } catch (error) {
      cacheLogger.error('Redis clear error', error);
    }
  }

  async size(): Promise<number> {
    if (!(await this.ensureConnected())) {
      return 0;
    }

    try {
      return await this.redis.dbSize();
    } catch (error) {
      cacheLogger.error('Redis size error', error);
      return 0;
    }
  }

  async destroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

// Unified cache interface
class Cache {
  private impl: MemoryCache | RedisCache;

  constructor() {
    // Use Redis if REDIS_URL is set, otherwise use memory cache
    this.impl = process.env.REDIS_URL 
      ? new RedisCache() 
      : new MemoryCache();
      
    cacheLogger.info(`Cache initialized: ${process.env.REDIS_URL ? 'Redis' : 'Memory'}`);
  }

  async get<T>(key: string): Promise<T | null> {
    return this.impl.get<T>(key);
  }

  async set<T>(key: string, data: T, options?: CacheOptions): Promise<void> {
    return this.impl.set(key, data, options);
  }

  async invalidate(key: string): Promise<void> {
    return this.impl.invalidate(key);
  }

  async clear(): Promise<void> {
    return this.impl.clear();
  }

  async size(): Promise<number> {
    return this.impl.size();
  }

  // Helper method for cache with TTL
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    await this.set(key, data, options);
    
    return data;
  }

  // Method to invalidate multiple keys with a pattern
  async invalidatePattern(pattern: string): Promise<void> {
    if (this.impl instanceof MemoryCache) {
      // Simple pattern matching for memory cache
      const regex = new RegExp(pattern.replace('*', '.*'));
      const keysToDelete: string[] = [];
      
      // Note: MemoryCache doesn't expose keys, so this is a limitation
      // In a real implementation, you might want to track keys separately
      cacheLogger.warn('Pattern invalidation not supported with memory cache');
      return;
    }
    
    // Redis pattern invalidation would be implemented here
    cacheLogger.warn('Pattern invalidation not implemented for Redis cache');
  }

  async destroy(): Promise<void> {
    if ('destroy' in this.impl) {
      await this.impl.destroy();
    }
  }
}

// Create and export singleton instance
export const cache = new Cache();

// Export cache helper functions for convenience
export const cacheGet = <T>(key: string) => cache.get<T>(key);
export const cacheSet = <T>(key: string, data: T, options?: CacheOptions) => cache.set(key, data, options);
export const cacheInvalidate = (key: string) => cache.invalidate(key);
export const cacheClear = () => cache.clear();
export const cacheGetOrSet = <T>(
  key: string, 
  fetcher: () => Promise<T>, 
  options?: CacheOptions
) => cache.getOrSet(key, fetcher, options);

// Cache key generators for common use cases
export const cacheKeys = {
  roadmap: (id: string) => `roadmap:${id}`,
  roadmapList: (params: string = '') => `roadmaps:list:${params}`,
  userProfile: (username: string) => `user:profile:${username}`,
  userProgress: (userId: string, roadmapId: string) => `progress:${userId}:${roadmapId}`,
  dashboard: (userId: string) => `dashboard:${userId}`,
  weeklyActivity: (userId: string) => `activity:weekly:${userId}`,
} as const;

// Default TTL values (in seconds)
export const cacheTTL = {
  SHORT: 60,      // 1 minute
  MEDIUM: 300,    // 5 minutes
  LONG: 900,      // 15 minutes
  HOUR: 3600,     // 1 hour
  DAY: 86400,     // 24 hours
} as const;
