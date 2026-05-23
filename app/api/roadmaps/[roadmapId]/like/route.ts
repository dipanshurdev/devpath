import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import { cache, cacheKeys } from '@/lib/cache';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// POST /api/roadmaps/[roadmapId]/like - Like a roadmap
export async function POST(
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get roadmap internal ID
    const roadmap = await prisma.roadmap.findUnique({
      where: { roadmapId: params.roadmapId },
      select: { id: true },
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, error: 'Roadmap not found' },
        { status: 404 }
      );
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
      return NextResponse.json(
        { success: false, error: 'Roadmap already liked' },
        { status: 409 }
      );
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

    return NextResponse.json({
      success: true,
      data: { isLiked: true, likeCount: (currentRoadmap?.likeCount || 0) + 1 },
      message: 'Roadmap liked successfully',
    });
  } catch (error: unknown) {
    console.error('Error liking roadmap:', error);
    const message = error instanceof Error ? error.message : 'Failed to like roadmap';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/roadmaps/[roadmapId]/like - Unlike a roadmap
export async function DELETE(
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get roadmap internal ID
    const roadmap = await prisma.roadmap.findUnique({
      where: { roadmapId: params.roadmapId },
      select: { id: true, likeCount: true },
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, error: 'Roadmap not found' },
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      data: { isLiked: false, likeCount: Math.max(0, roadmap.likeCount - 1) },
      message: 'Roadmap unliked successfully',
    });
  } catch (error: unknown) {
    console.error('Error unliking roadmap:', error);
    const message = error instanceof Error ? error.message : 'Failed to unlike roadmap';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
