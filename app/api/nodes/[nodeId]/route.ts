import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// GET /api/nodes/[nodeId] - Get single node
export async function GET(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  try {
    const node = await prisma.node.findUnique({
      where: { nodeId: params.nodeId },
      include: {
        roadmap: {
          select: {
            id: true,
            roadmapId: true,
            title: true,
            slug: true,
          },
        },
        resources: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            completedBy: true,
          },
        },
      },
    });

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: node,
    });
  } catch (error: unknown) {
    console.error('Error fetching node:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch node';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PUT /api/nodes/[nodeId] - Update node (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();

    const node = await prisma.node.findUnique({
      where: { nodeId: params.nodeId },
    });

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.node.update({
      where: { nodeId: params.nodeId },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        resources: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Node updated successfully',
    });
  } catch (error: unknown) {
    console.error('Error updating node:', error);
    const message = error instanceof Error ? error.message : 'Failed to update node';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/nodes/[nodeId] - Delete node (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const node = await prisma.node.findUnique({
      where: { nodeId: params.nodeId },
    });

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    // Delete node (cascade will delete resources)
    await prisma.node.delete({
      where: { nodeId: params.nodeId },
    });

    return NextResponse.json({
      success: true,
      message: 'Node deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Error deleting node:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete node';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
