import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
    select: {
      id: true,
      _count: {
        select: {
          likes: true,
          bookmarks: true,
        },
      },
    },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  let isLiked = false;
  let isBookmarked = false;

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

    isLiked = !!like;
    isBookmarked = !!bookmark;
  }

  return createApiResponse({
    isLiked,
    isBookmarked,
    bookmarkCount: roadmap._count.bookmarks,
    likeCount: roadmap._count.likes,
  });
});
