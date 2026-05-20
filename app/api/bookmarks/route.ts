import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

/**
 * GET /api/bookmarks - Get current user's saved/bookmarked roadmaps
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }

  const userId = session.user.id;

  // Get user's bookmarks with roadmap details
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      roadmap: {
        include: {
          _count: {
            select: {
              nodes: true,
              likes: true,
              bookmarks: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform the data to match the expected format
  const savedRoadmaps = bookmarks.map((bookmark) => ({
    id: bookmark.roadmap.id,
    roadmapId: bookmark.roadmap.roadmapId,
    title: bookmark.roadmap.title,
    description: bookmark.roadmap.description,
    type: bookmark.roadmap.type,
    difficulty: bookmark.roadmap.difficulty,
    estimatedTime: bookmark.roadmap.estimatedTime,
    viewCount: bookmark.roadmap.viewCount,
    likeCount: bookmark.roadmap.likeCount,
    bookmarkCount: bookmark.roadmap.bookmarkCount,
    isFeatured: bookmark.roadmap.isFeatured,
    isPublished: bookmark.roadmap.isPublished,
    _count: bookmark.roadmap._count,
    createdAt: bookmark.roadmap.createdAt,
    updatedAt: bookmark.roadmap.updatedAt,
  }));

  return createApiResponse(savedRoadmaps, 'Saved roadmaps fetched successfully');
});
