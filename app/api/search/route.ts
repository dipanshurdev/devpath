import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { searchRoadmaps } from '@/lib/prisma/queries';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Cache shape for search results (stored without per-user flags)
type SearchCache = {
  roadmaps: Array<Record<string, unknown>>;
  total: number;
  hasMore: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
    totalPages: number;
  };
};

/**
 * GET /api/search
 *
 * Query parameters:
 *   q         — search string (required, min 1 char)
 *   page      — 1-based page number (default: 1)
 *   pageSize  — results per page, max 100 (default: 20)
 *
 * Auth: optional session — authenticated users receive isLiked / isBookmarked flags.
 * Cache: 60 s TTL (SHORT) per unique {q, page, pageSize} combination.
 *        Cache is keyed without user identity so anonymous responses can be shared.
 *        Per-user social flags are attached after the cache is read/written.
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const q = (searchParams.get('q') ?? '').trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const pageSize = Math.min(
    Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10) || 20),
    100,
  );

  if (!q) {
    throw ApiError.badRequest('Query parameter "q" is required');
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const cacheKey = cacheKeys.search(
    new URLSearchParams({ q, page: page.toString(), pageSize: pageSize.toString() }).toString(),
  );

  // Serve cached base result for anonymous requests (user-specific flags bypass cache)
  const cached = await cache.get<SearchCache>(cacheKey);
  if (cached && !userId) {
    return createApiResponse({
      roadmaps: cached.roadmaps,
      pagination: cached.pagination,
      fromCache: true,
    });
  }

  const skip = (page - 1) * pageSize;
  const { roadmaps, total, hasMore } = await searchRoadmaps(q, { skip, take: pageSize });

  const pagination = {
    page,
    pageSize,
    total,
    hasMore,
    totalPages: Math.ceil(total / pageSize),
  };

  // Attach isLiked / isBookmarked for authenticated users
  let roadmapsWithStatus: Array<Record<string, unknown>> = roadmaps as Array<
    Record<string, unknown>
  >;

  if (userId && roadmaps.length > 0) {
    const roadmapIds = roadmaps.map((r) => r.id);
    const [likes, bookmarks] = await Promise.all([
      prisma.roadmapLike.findMany({
        where: { userId, roadmapId: { in: roadmapIds } },
        select: { roadmapId: true },
      }),
      prisma.bookmark.findMany({
        where: { userId, roadmapId: { in: roadmapIds } },
        select: { roadmapId: true },
      }),
    ]);

    const likedIds = new Set(likes.map((l) => l.roadmapId));
    const bookmarkedIds = new Set(bookmarks.map((b) => b.roadmapId));

    roadmapsWithStatus = roadmaps.map((r) => ({
      ...(r as Record<string, unknown>),
      isLiked: likedIds.has(r.id),
      isBookmarked: bookmarkedIds.has(r.id),
    }));
  }

  // Cache the base result (without per-user flags) for anonymous reuse
  if (!userId) {
    await cache.set<SearchCache>(
      cacheKey,
      { roadmaps: roadmaps as Array<Record<string, unknown>>, total, hasMore, pagination },
      { ttl: cacheTTL.SHORT }, // 60 seconds
    );
  }

  return createApiResponse({
    roadmaps: roadmapsWithStatus,
    pagination,
    fromCache: false,
  });
});
