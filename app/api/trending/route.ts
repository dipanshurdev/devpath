import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { getTrendingRoadmaps } from '@/lib/prisma/queries';
import { cache, cacheKeys } from '@/lib/cache';
import { withErrorHandler, createApiResponse } from '@/lib/api-handler';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Cache shape for trending results (stored without per-user flags)
type TrendingCache = Array<Record<string, unknown>>;

/**
 * GET /api/trending
 *
 * Query parameters:
 *   limit  — number of roadmaps to return, max 50 (default: 10)
 *
 * Auth: optional session — authenticated users receive isLiked / isBookmarked flags.
 * Cache: 120 s TTL per unique limit value.
 *        Trending data is more stable than search results but should still refresh
 *        frequently enough to reflect genuine engagement shifts.
 *        Cache is keyed without user identity; per-user flags bypass and post-process.
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const rawLimit = parseInt(searchParams.get('limit') || '10', 10);
  const limit = Math.min(Math.max(1, isNaN(rawLimit) ? 10 : rawLimit), 50);

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const cacheKey = cacheKeys.trending(limit);

  // Serve cached base result for anonymous requests
  const cached = await cache.get<TrendingCache>(cacheKey);
  if (cached && !userId) {
    return createApiResponse({
      roadmaps: cached,
      fromCache: true,
    });
  }

  const roadmaps = await getTrendingRoadmaps(limit);

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

  // Cache the base result (without per-user flags) for anonymous reuse — 120 s
  if (!userId) {
    await cache.set<TrendingCache>(
      cacheKey,
      roadmaps as Array<Record<string, unknown>>,
      { ttl: 120 },
    );
  }

  return createApiResponse({
    roadmaps: roadmapsWithStatus,
    fromCache: false,
  });
});
