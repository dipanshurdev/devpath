import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const nodeCreateSchema = z.object({
  nodeId: z.string().min(1, "nodeId is required").max(100),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  type: z.enum(["checkpoint", "milestone", "optional", "project", "quiz", "resource"] as const).default("checkpoint"),
  category: z.string().optional().nullable(),
  positionX: z.number().optional().nullable(),
  positionY: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  order: z.number().int().default(0),
  level: z.number().int().default(1),
  prerequisiteIds: z.array(z.string()).optional().default([]),
  estimatedTime: z.string().optional().nullable(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"] as const).optional().nullable(),
  isOptional: z.boolean().optional().default(false),
  isLocked: z.boolean().optional().default(false),
});

// GET /api/roadmaps/[roadmapId]/nodes - Get all nodes for a roadmap
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
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

  return createApiResponse(nodes);
});

// POST /api/roadmaps/[roadmapId]/nodes - Create new node (Admin only)
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: `/api/roadmaps/${params.roadmapId}/nodes`,
    method: 'POST',
    message: 'Admin created roadmap node',
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const body = await request.json();
  const validatedData = nodeCreateSchema.parse(body);

  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  // Check if nodeId already exists
  const existing = await prisma.node.findUnique({
    where: { nodeId: validatedData.nodeId },
  });

  if (existing) {
    throw ApiError.conflict('Node with this ID already exists');
  }

  const node = await prisma.node.create({
    data: {
      ...validatedData,
      roadmapId: roadmap.id,
    },
    include: {
      resources: true,
    },
  });

  return createApiResponse(node, 'Node created successfully', 201);
});
