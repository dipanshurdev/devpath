import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const resourceCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  url: z.string().url("URL must be a valid URL"),
  type: z.enum([
    "article", "video", "documentation", "course", "book",
    "podcast", "tool", "github", "interactive", "tutorial",
    "cheatsheet", "exercise",
  ] as const),
  format: z.string().optional().nullable(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"] as const).optional().nullable(),
  author: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  language: z.string().optional().default("en"),
  publishedDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  isPremium: z.boolean().optional().default(false),
  isVerified: z.boolean().optional().default(false),
  quality: z.number().int().min(0).max(100).optional().default(0),
  order: z.number().int().optional().default(0),
});

// GET /api/nodes/[nodeId]/resources - Get all resources for a node
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) => {
  const node = await prisma.node.findUnique({
    where: { nodeId: params.nodeId },
  });

  if (!node) {
    throw ApiError.notFound('Node not found');
  }

  const resources = await prisma.resource.findMany({
    where: { nodeId: node.id },
    orderBy: { order: 'asc' },
  });

  return createApiResponse(resources);
});

// POST /api/nodes/[nodeId]/resources - Create new resource (Admin only)
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: `/api/nodes/${params.nodeId}/resources`,
    method: 'POST',
    message: 'Admin created node resource',
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const body = await request.json();
  const validatedData = resourceCreateSchema.parse(body);

  const node = await prisma.node.findUnique({
    where: { nodeId: params.nodeId },
  });

  if (!node) {
    throw ApiError.notFound('Node not found');
  }

  const resource = await prisma.resource.create({
    data: {
      ...validatedData,
      nodeId: node.id,
    },
  });

  return createApiResponse(resource, 'Resource created successfully', 201);
});
