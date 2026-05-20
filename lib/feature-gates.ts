import { prisma } from '@/lib/prisma/client';
import { PrismaClient } from '@prisma/client';

// Feature definitions with their required subscription tiers
export const FEATURES = {
  // Roadmap features
  CREATE_CUSTOM_ROADMAPS: 'create_custom_roadmaps',
  UNLIMITED_ROADMAPS: 'unlimited_roadmaps',
  ADVANCED_ROMAP_ANALYTICS: 'advanced_roadmap_analytics',
  
  // Learning features
  UNLIMITED_LEARNING_PATHS: 'unlimited_learning_paths',
  PREMIUM_CONTENT: 'premium_content',
  AI_RECOMMENDATIONS: 'ai_recommendations',
  CERTIFICATE_GENERATION: 'certificate_generation',
  
  // Collaboration features
  TEAM_COLLABORATION: 'team_collaboration',
  SHARED_PROGRESS: 'shared_progress',
  MENTORSHIP_ACCESS: 'mentorship_access',
  
  // Profile features
  CUSTOM_PROFILE_THEMES: 'custom_profile_themes',
  PROFILE_ANALYTICS: 'profile_analytics',
  VERIFIED_BADGE: 'verified_badge',
  
  // API features
  API_ACCESS: 'api_access',
  INCREASED_RATE_LIMIT: 'increased_rate_limit',
  WEBHOOK_ACCESS: 'webhook_access',
} as const;

// Subscription tier definitions
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'FREE',
    price: 0,
    features: [
      // Basic features available to all users
      'create_custom_roadmaps', // Limited to 3 roadmaps
      'basic_analytics',
    ],
    limits: {
      maxRoadmaps: 3,
      maxApiRequestsPerHour: 100,
      maxTeamMembers: 1,
    },
  },
  PRO: {
    name: 'PRO',
    price: 29, // $29/month
    features: [
      'create_custom_roadmaps', // Unlimited
      'unlimited_learning_paths',
      'premium_content',
      'ai_recommendations',
      'certificate_generation',
      'custom_profile_themes',
      'profile_analytics',
      'api_access',
      'increased_rate_limit',
    ],
    limits: {
      maxRoadmaps: Infinity,
      maxApiRequestsPerHour: 1000,
      maxTeamMembers: 5,
    },
  },
  TEAM: {
    name: 'TEAM',
    price: 99, // $99/month
    features: [
      // All PRO features plus
      'team_collaboration',
      'shared_progress',
      'mentorship_access',
      'verified_badge',
      'webhook_access',
    ],
    limits: {
      maxRoadmaps: Infinity,
      maxApiRequestsPerHour: 5000,
      maxTeamMembers: 20,
    },
  },
} as const;

// Feature gate check function
export async function checkFeatureAccess(
  userId: string, 
  featureName: keyof typeof FEATURES
): Promise<{ hasAccess: boolean; tier?: string; reason?: string }> {
  try {
    // Get user's subscription
    const subscription: any = await prisma.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!subscription) {
      // User should always have a subscription, but handle edge case
      return {
        hasAccess: false,
        reason: 'No subscription found',
      };
    }

    // Admin users have access to everything
    if (subscription.user.role === 'ADMIN' || subscription.user.role === 'SUPER_ADMIN') {
      return {
        hasAccess: true,
        tier: 'ADMIN',
      };
    }

    // Check if subscription is active
    if (subscription.status !== 'ACTIVE') {
      return {
        hasAccess: false,
        tier: subscription.tier,
        reason: `Subscription is ${subscription.status.toLowerCase()}`,
      };
    }

    // Check if subscription has expired
    if (subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
      return {
        hasAccess: false,
        tier: subscription.tier,
        reason: 'Subscription has expired',
      };
    }

    // Get feature configuration for the user's tier
    const tierConfig = SUBSCRIPTION_TIERS[subscription.tier as keyof typeof SUBSCRIPTION_TIERS];
    if (!tierConfig) {
      return {
        hasAccess: false,
        reason: 'Invalid subscription tier',
      };
    }

    // Check if feature is available in the user's tier
    const featureKey = FEATURES[featureName];
    const tierFeatures = tierConfig.features as readonly string[];
    const hasFeatureAccess = tierFeatures.includes(featureKey);

    return {
      hasAccess: hasFeatureAccess,
      tier: subscription.tier,
      reason: hasFeatureAccess ? undefined : `Feature '${featureName}' not available in ${subscription.tier} tier`,
    };

  } catch (error) {
    console.error('Error checking feature access:', error);
    return {
      hasAccess: false,
      reason: 'Error checking feature access',
    };
  }
}

// Middleware function to check feature access
export function requireFeature(featureName: keyof typeof FEATURES) {
  return async (userId: string): Promise<void> => {
    const access = await checkFeatureAccess(userId, featureName);
    
    if (!access.hasAccess) {
      throw new Error(`Access denied: ${access.reason}`);
    }
  };
}

// Helper function to get user's current tier limits
export async function getUserTierLimits(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { tier: true, status: true },
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return SUBSCRIPTION_TIERS.FREE.limits;
    }

    return SUBSCRIPTION_TIERS[subscription.tier as keyof typeof SUBSCRIPTION_TIERS]?.limits || SUBSCRIPTION_TIERS.FREE.limits;
  } catch (error) {
    console.error('Error getting user tier limits:', error);
    return SUBSCRIPTION_TIERS.FREE.limits;
  }
}

// Check if user can perform an action based on their limits
export async function checkUserLimits(
  userId: string,
  action: 'create_roadmap' | 'api_request' | 'add_team_member',
  currentCount?: number
): Promise<{ canPerform: boolean; reason?: string; remaining?: number }> {
  try {
    const limits = await getUserTierLimits(userId);
    
    switch (action) {
      case 'create_roadmap':
        const roadmapCount = currentCount || 0;
        const canCreateRoadmap = roadmapCount < limits.maxRoadmaps;
        return {
          canPerform: canCreateRoadmap,
          reason: canCreateRoadmap ? undefined : `Roadmap limit reached (${limits.maxRoadmaps})`,
          remaining: Math.max(0, limits.maxRoadmaps - roadmapCount),
        };
        
      case 'api_request':
        // This would typically be handled by rate limiting middleware
        return {
          canPerform: true,
          remaining: limits.maxApiRequestsPerHour,
        };
        
      case 'add_team_member':
        // This would require checking current team size
        return {
          canPerform: true,
          remaining: limits.maxTeamMembers,
        };
        
      default:
        return {
          canPerform: false,
          reason: 'Unknown action',
        };
    }
  } catch (error) {
    console.error('Error checking user limits:', error);
    return {
      canPerform: false,
      reason: 'Error checking limits',
    };
  }
}

// Export feature constants for easy access
export const FEATURE_LIST = Object.values(FEATURES);
export const TIER_LIST = Object.keys(SUBSCRIPTION_TIERS);
