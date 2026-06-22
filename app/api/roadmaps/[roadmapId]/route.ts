import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { cache, cacheKeys, cacheTTL } from '@/lib/cache';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

type CachedRoadmap = {
  id: string;
  [key: string]: unknown;
};

/**
 * General-purpose roadmap update schema.
 * Publish / unpublish transitions are intentionally excluded here;
 * use PATCH /api/roadmaps/[roadmapId]/publish for those.
 */
const roadmapUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  summary: z.string().optional().nullable(),
  type: z.enum(["role", "skill", "project", "language", "tool", "career"] as const).optional(),
  category: z.string().optional().nullable(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"] as const).optional(),
  estimatedTime: z.string().min(1, "Estimated time is required").optional(),
  prerequisites: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  isOfficial: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  keywords: z.array(z.string()).optional(),
  order: z.number().optional(),
  priority: z.number().optional(),
  creatorId: z.string().optional().nullable(),
});

// GET /api/roadmaps/[roadmapId] - Get single roadmap
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const cacheKey = cacheKeys.roadmap(params.roadmapId);

  // Try to get from cache first (without user-specific data)
  const cached = await cache.get<CachedRoadmap>(cacheKey);
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
  if (userId && roadmap) {
    const [like, bookmark] = await Promise.all([
      prisma.roadmapLike.findUnique({
        where: {
          userId_roadmapId: {
            userId,
            roadmapId: roadmap!.id,
          },
        },
      }),
      prisma.bookmark.findUnique({
        where: {
          userId_roadmapId: {
            userId,
            roadmapId: roadmap!.id,
          },
        },
      }),
    ]);

    userStatus = {
      isLiked: !!like,
      isBookmarked: !!bookmark,
    };
  }

  // Increment view count (only increment when fromCache is false)
  if (roadmap && !cached) {
    await prisma.roadmap.update({
      where: { id: roadmap.id },
      data: { viewCount: { increment: 1 } },
    });
    // Increment on the local object so the response contains the updated value
    roadmap.viewCount = (roadmap.viewCount as number || 0) + 1;
  }

  return createApiResponse({
    ...roadmap!,
    userStatus,
    fromCache: !!cached,
  });
});

// PUT /api/roadmaps/[roadmapId] - Update roadmap (Admin only)
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: `/api/roadmaps/${params.roadmapId}`,
    method: 'PUT',
    message: 'Admin updated roadmap',
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const body = await request.json();
  const validatedData = roadmapUpdateSchema.parse(body);

  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  const updated = await prisma.roadmap.update({
    where: { roadmapId: params.roadmapId },
    data: {
      ...validatedData,
      updatedAt: new Date(),
    },
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

  // Invalidate caches so stale metadata is not served
  await Promise.all([
    cache.invalidate(cacheKeys.roadmap(params.roadmapId)),
    cache.invalidate(cacheKeys.roadmapList()),
  ]);

  return createApiResponse(updated, 'Roadmap updated successfully');
});

// DELETE /api/roadmaps/[roadmapId] - Delete roadmap (Admin only)
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: `/api/roadmaps/${params.roadmapId}`,
    method: 'DELETE',
    message: 'Admin deleted roadmap',
    adminId: session.user.id,
    adminRole: session.user.role,
  });

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

  // Invalidate caches
  await Promise.all([
    cache.invalidate(cacheKeys.roadmap(params.roadmapId)),
    cache.invalidate(cacheKeys.roadmapList()),
  ]);

  return createApiResponse(null, 'Roadmap deleted successfully');
});
