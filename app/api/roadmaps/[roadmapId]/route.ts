import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { Difficulty, RoadmapType, RoadmapStatus } from '@prisma/client';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

// GET /api/roadmaps/[roadmapId] - Get single roadmap
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const cacheKey = cacheKeys.roadmap(params.roadmapId);

  // Try to get from cache first (without user-specific data)
  const cached = await cache.get<any>(cacheKey);
  let roadmap = cached;

  if (!cached) {
    roadmap = await prisma.roadmap.findUnique({
      where: { roadmapId: params.roadmapId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        nodes: {
          include: {
            resources: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            likes: true,
            bookmarks: true,
            comments: true,
          },
        },
      },
    });

    if (!roadmap) {
      throw ApiError.notFound('Roadmap not found');
    }

    // Cache the roadmap data for 5 minutes (without user-specific data)
    await cache.set(cacheKey, roadmap, { ttl: cacheTTL.LONG });
  }

  // Get user's like and bookmark status if authenticated (not cached)
  let userStatus = { isLiked: false, isBookmarked: false };
  if (userId) {
    const [like, bookmark] = await Promise.all([
      prisma.roadmapLike.findUnique({
        where: {
          userId_roadmapId: {
            userId,
            roadmapId: roadmap.id,
          },
        },
      }),
      prisma.bookmark.findUnique({
        where: {
          userId_roadmapId: {
            userId,
            roadmapId: roadmap.id,
          },
        },
      }),
    ]);

    userStatus = {
      isLiked: !!like,
      isBookmarked: !!bookmark,
    };
  }

  // Increment view count (don't cache this part)
  await prisma.roadmap.update({
    where: { id: roadmap.id },
    data: { viewCount: { increment: 1 } },
  });

  return createApiResponse({
    ...roadmap,
    userStatus,
    fromCache: !!cached,
  });
});

// PUT /api/roadmaps/[roadmapId] - Update roadmap (Admin only)
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();

  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  // Set publishedAt when isPublished transitions to true
  const dataToUpdate: Record<string, unknown> = {
    ...body,
    updatedAt: new Date(),
  };

  if (body.isPublished === true && !roadmap.publishedAt) {
    dataToUpdate.publishedAt = new Date();
  }

  const updated = await prisma.roadmap.update({
    where: { roadmapId: params.roadmapId },
    data: dataToUpdate,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  return createApiResponse(updated, 'Roadmap updated successfully');
});

// DELETE /api/roadmaps/[roadmapId] - Delete roadmap (Admin only)
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const { response } = await requireAdmin();
  if (response) return response;

  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  // Delete roadmap (cascade will delete nodes and resources)
  await prisma.roadmap.delete({
    where: { roadmapId: params.roadmapId },
  });

  return createApiResponse(null, 'Roadmap deleted successfully');
});
