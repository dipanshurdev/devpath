import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const resourceUpdateSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character").optional(),
  description: z.string().optional().nullable(),
  url: z.string().url("URL must be a valid URL").optional(),
  type: z.enum([
    "article", "video", "documentation", "course", "book", "podcast", "tool", "github", "interactive", "tutorial", "cheatsheet", "exercise"
  ] as const).optional(),
  format: z.string().optional().nullable(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"] as const).optional().nullable(),
  author: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  language: z.string().optional(),
  publishedDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  isPremium: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  quality: z.number().int().optional(),
  order: z.number().int().optional(),
});

// GET /api/resources/[id] - Get single resource
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
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
    throw ApiError.notFound('Resource not found');
  }

  return createApiResponse(resource);
});

// PUT /api/resources/[id] - Update resource (Admin only)
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: `/api/resources/${params.id}`,
    method: 'PUT',
    message: 'Admin updated resource',
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const body = await request.json();
  const validatedData = resourceUpdateSchema.parse(body);

  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
  });

  if (!resource) {
    throw ApiError.notFound('Resource not found');
  }

  const updated = await prisma.resource.update({
    where: { id: params.id },
    data: {
      ...validatedData,
      updatedAt: new Date(),
    },
  });

  return createApiResponse(updated, 'Resource updated successfully');
});

// DELETE /api/resources/[id] - Delete resource (Admin only)
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: `/api/resources/${params.id}`,
    method: 'DELETE',
    message: 'Admin deleted resource',
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
  });

  if (!resource) {
    throw ApiError.notFound('Resource not found');
  }

  await prisma.resource.delete({
    where: { id: params.id },
  });

  return createApiResponse(null, 'Resource deleted successfully');
});
