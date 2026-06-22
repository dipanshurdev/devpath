import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const nodeUpdateSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character").optional(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  type: z.enum(["checkpoint", "milestone", "optional", "project", "quiz", "resource"] as const).optional(),
  category: z.string().optional().nullable(),
  positionX: z.number().optional().nullable(),
  positionY: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  order: z.number().int().optional(),
  level: z.number().int().optional(),
  prerequisiteIds: z.array(z.string()).optional(),
  estimatedTime: z.string().optional().nullable(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"] as const).optional().nullable(),
  isOptional: z.boolean().optional(),
  isLocked: z.boolean().optional(),
});

// GET /api/nodes/[nodeId] - Get single node
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) => {
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
    throw ApiError.notFound('Node not found');
  }

  return createApiResponse(node);
});

// PUT /api/nodes/[nodeId] - Update node (Admin only)
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: `/api/nodes/${params.nodeId}`,
    method: 'PUT',
    message: 'Admin updated node',
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const body = await request.json();
  const validatedData = nodeUpdateSchema.parse(body);

  const node = await prisma.node.findUnique({
    where: { nodeId: params.nodeId },
  });

  if (!node) {
    throw ApiError.notFound('Node not found');
  }

  const updated = await prisma.node.update({
    where: { nodeId: params.nodeId },
    data: {
      ...validatedData,
      updatedAt: new Date(),
    },
    include: {
      resources: true,
    },
  });

  return createApiResponse(updated, 'Node updated successfully');
});

// DELETE /api/nodes/[nodeId] - Delete node (Admin only)
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: `/api/nodes/${params.nodeId}`,
    method: 'DELETE',
    message: 'Admin deleted node',
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const node = await prisma.node.findUnique({
    where: { nodeId: params.nodeId },
  });

  if (!node) {
    throw ApiError.notFound('Node not found');
  }

  // Delete node (cascade will delete resources)
  await prisma.node.delete({
    where: { nodeId: params.nodeId },
  });

  return createApiResponse(null, 'Node deleted successfully');
});
