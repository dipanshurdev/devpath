import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// POST /api/roadmaps/[roadmapId]/bookmark - Bookmark a roadmap
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }

  const userId = session.user.id;

  // Get roadmap internal ID
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
    select: { id: true },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  // Check if already bookmarked
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_roadmapId: {
        userId,
        roadmapId: roadmap.id,
      },
    },
  });

  if (existingBookmark) {
    throw ApiError.conflict('Roadmap already bookmarked');
  }

  // Get current bookmark count
  const currentRoadmap = await prisma.roadmap.findUnique({
    where: { id: roadmap.id },
    select: { bookmarkCount: true },
  });

  // Create bookmark and update count atomically
  await prisma.$transaction([
    prisma.bookmark.create({
      data: {
        userId,
        roadmapId: roadmap.id,
      },
    }),
    prisma.roadmap.update({
      where: { id: roadmap.id },
      data: { bookmarkCount: { increment: 1 } },
    }),
  ]);

  return createApiResponse(
    { isBookmarked: true, bookmarkCount: (currentRoadmap?.bookmarkCount || 0) + 1 },
    'Roadmap bookmarked successfully'
  );
});

// DELETE /api/roadmaps/[roadmapId]/bookmark - Remove bookmark
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }

  const userId = session.user.id;

  // Get roadmap internal ID
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
    select: { id: true, bookmarkCount: true },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  // Delete bookmark and update count atomically
  await prisma.$transaction([
    prisma.bookmark.delete({
      where: {
        userId_roadmapId: {
          userId,
          roadmapId: roadmap.id,
        },
      },
    }),
    prisma.roadmap.update({
      where: { id: roadmap.id },
      data: { bookmarkCount: { decrement: 1 } },
    }),
  ]);

  return createApiResponse(
    { isBookmarked: false, bookmarkCount: Math.max(0, roadmap.bookmarkCount - 1) },
    'Bookmark removed successfully'
  );
});
