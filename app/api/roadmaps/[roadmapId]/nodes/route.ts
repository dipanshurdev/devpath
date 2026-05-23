import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { NodeType, Difficulty } from '@prisma/client';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/roadmaps/[roadmapId]/nodes - Get all nodes for a roadmap
export async function GET(
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const roadmap = await prisma.roadmap.findUnique({
      where: { roadmapId: params.roadmapId },
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, error: 'Roadmap not found' },
        { status: 404 }
      );
    }

    const nodes = await prisma.node.findMany({
      where: { roadmapId: roadmap.id },
      include: {
        resources: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            completedBy: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: nodes,
      count: nodes.length,
    });
  } catch (error: unknown) {
    console.error('Error fetching nodes:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch nodes';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST /api/roadmaps/[roadmapId]/nodes - Create new node (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();

    const roadmap = await prisma.roadmap.findUnique({
      where: { roadmapId: params.roadmapId },
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, error: 'Roadmap not found' },
        { status: 404 }
      );
    }

    const {
      nodeId,
      title,
      description,
      content,
      type = 'checkpoint',
      category,
      positionX,
      positionY,
      width,
      height,
      order = 0,
      level = 1,
      prerequisiteIds = [],
      estimatedTime,
      difficulty,
      isOptional = false,
      isLocked = false,
    } = body;

    // Validate required fields
    if (!nodeId || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (nodeId, title)' },
        { status: 400 }
      );
    }

    // Check if nodeId already exists
    const existing = await prisma.node.findUnique({
      where: { nodeId },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Node with this ID already exists' },
        { status: 409 }
      );
    }

    const node = await prisma.node.create({
      data: {
        nodeId,
        title,
        description,
        content,
        type: type as NodeType,
        category,
        positionX,
        positionY,
        width,
        height,
        order,
        level,
        prerequisiteIds,
        estimatedTime,
        difficulty: difficulty as Difficulty,
        isOptional,
        isLocked,
        roadmapId: roadmap.id,
      },
      include: {
        resources: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: node,
      message: 'Node created successfully',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating node:', error);
    const message = error instanceof Error ? error.message : 'Failed to create node';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
