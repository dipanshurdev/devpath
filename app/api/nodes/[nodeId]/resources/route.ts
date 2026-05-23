import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { ResourceType, Difficulty } from '@prisma/client';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// GET /api/nodes/[nodeId]/resources - Get all resources for a node
export async function GET(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  try {
    const node = await prisma.node.findUnique({
      where: { nodeId: params.nodeId },
    });

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    const resources = await prisma.resource.findMany({
      where: { nodeId: node.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: resources,
      count: resources.length,
    });
  } catch (error: unknown) {
    console.error('Error fetching resources:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch resources';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST /api/nodes/[nodeId]/resources - Create new resource (Admin only)
export async function POST(
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

    const {
      title,
      description,
      url,
      type,
      format,
      difficulty,
      author,
      publisher,
      duration,
      language = 'en',
      publishedDate,
      isPremium = false,
      isVerified = false,
      quality = 0,
      order = 0,
    } = body;

    // Validate required fields
    if (!title || !url || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (title, url, type)' },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        url,
        type: type as ResourceType,
        format,
        difficulty: difficulty as Difficulty,
        author,
        publisher,
        duration,
        language,
        publishedDate: publishedDate ? new Date(publishedDate) : undefined,
        isPremium,
        isVerified,
        quality,
        order,
        nodeId: node.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: resource,
      message: 'Resource created successfully',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating resource:', error);
    const message = error instanceof Error ? error.message : 'Failed to create resource';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
