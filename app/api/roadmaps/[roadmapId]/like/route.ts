import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma/client';
import { cache, cacheKeys } from '@/lib/cache';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// POST /api/roadmaps/[roadmapId]/like - Like a roadmap
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const userId = session.user.id;

  // Get roadmap internal ID
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
    select: { id: true },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  // Check if already liked
  const existingLike = await prisma.roadmapLike.findUnique({
    where: {
      userId_roadmapId: {
        userId,
        roadmapId: roadmap.id,
      },
    },
  });

  if (existingLike) {
    throw ApiError.conflict('Roadmap already liked');
  }

  // Get current like count
  const currentRoadmap = await prisma.roadmap.findUnique({
    where: { id: roadmap.id },
    select: { likeCount: true },
  });

  // Create like and update count atomically
  await prisma.$transaction([
    prisma.roadmapLike.create({
      data: {
        userId,
        roadmapId: roadmap.id,
      },
    }),
    prisma.roadmap.update({
      where: { id: roadmap.id },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  // Invalidate caches
  await Promise.all([
    cache.invalidate(cacheKeys.roadmap(params.roadmapId)),
    cache.invalidate(cacheKeys.roadmapList()),
  ]);

  return createApiResponse(
    { isLiked: true, likeCount: (currentRoadmap?.likeCount || 0) + 1 },
    'Roadmap liked successfully'
  );
});

// DELETE /api/roadmaps/[roadmapId]/like - Unlike a roadmap
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const userId = session.user.id;

  // Get roadmap internal ID
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
    select: { id: true, likeCount: true },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  // Delete like and update count atomically
  await prisma.$transaction([
    prisma.roadmapLike.delete({
      where: {
        userId_roadmapId: {
          userId,
          roadmapId: roadmap.id,
        },
      },
    }),
    prisma.roadmap.update({
      where: { id: roadmap.id },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);

  // Invalidate caches
  await Promise.all([
    cache.invalidate(cacheKeys.roadmap(params.roadmapId)),
    cache.invalidate(cacheKeys.roadmapList()),
  ]);

  return createApiResponse(
    { isLiked: false, likeCount: Math.max(0, roadmap.likeCount - 1) },
    'Roadmap unliked successfully'
  );
});
