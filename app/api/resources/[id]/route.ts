import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// GET /api/resources/[id] - Get single resource
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: {
        node: {
          select: {
            id: true,
            nodeId: true,
            title: true,
            roadmapId: true,
          },
        },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resource,
    });
  } catch (error: unknown) {
    console.error('Error fetching resource:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch resource';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id] - Update resource (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();

    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.resource.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Resource updated successfully',
    });
  } catch (error: unknown) {
    console.error('Error updating resource:', error);
    const message = error instanceof Error ? error.message : 'Failed to update resource';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Delete resource (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    await prisma.resource.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error: unknown) {
    console.error('Error deleting resource:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete resource';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
