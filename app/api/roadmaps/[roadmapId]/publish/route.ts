import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin } from '@/lib/auth-utils';
import { cache, cacheKeys } from '@/lib/cache';
import { withErrorHandler, ApiError, createApiResponse } from '@/lib/api-handler';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

/**
 * Publish-transition schema.
 *
 * `action` is the *explicit* intent — we never infer the direction
 * from the current DB state to avoid race conditions.
 */
const publishActionSchema = z.object({
  action: z.enum(['publish', 'unpublish'], {
    required_error: 'action is required',
    invalid_type_error: 'action must be "publish" or "unpublish"',
  }),
});

/**
 * PATCH /api/roadmaps/[roadmapId]/publish
 *
 * Publish / unpublish a roadmap.
 *
 * Validation rule (applied on "publish"):
 *   A roadmap may only be published when it has **at least one node**,
 *   ensuring users never encounter an empty roadmap on the public UI.
 *   Unpublish is always permitted regardless of node count.
 *
 * Cache invalidation:
 *   Both transitions invalidate:
 *     - the individual roadmap entry  (cacheKeys.roadmap)
 *     - the full roadmap list         (cacheKeys.roadmapList)
 *   so GET /api/roadmaps and GET /api/roadmaps/[roadmapId] reflect the
 *   new state immediately after the toggle.
 */
export const PATCH = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  // --- Validate body ---
  const body = await request.json();
  const { action } = publishActionSchema.parse(body);

  // --- Load roadmap + node count in one query ---
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId: params.roadmapId },
    include: {
      _count: { select: { nodes: true } },
    },
  });

  if (!roadmap) {
    throw ApiError.notFound('Roadmap not found');
  }

  // --- Transition guard (publish only) ---
  if (action === 'publish') {
    if (roadmap._count.nodes === 0) {
      throw ApiError.badRequest(
        'Cannot publish a roadmap with zero nodes. Add at least one node before publishing.',
        { nodeCount: 0 }
      );
    }
    // Already published — idempotent OK, but log it
    if (roadmap.isPublished) {
      logger.info({
        route: `/api/roadmaps/${params.roadmapId}/publish`,
        method: 'PATCH',
        message: 'Roadmap was already published (no-op)',
        adminId: session.user.id,
        adminRole: session.user.role,
      });
    }
  }

  logger.info({
    route: `/api/roadmaps/${params.roadmapId}/publish`,
    method: 'PATCH',
    message: `Admin ${action}ed roadmap`,
    adminId: session.user.id,
    adminRole: session.user.role,
    roadmapId: params.roadmapId,
    previousIsPublished: roadmap.isPublished,
  });

  // --- Compute update payload ---
  const isPublishing = action === 'publish';
  const now = new Date();

  const updated = await prisma.roadmap.update({
    where: { roadmapId: params.roadmapId },
    data: {
      isPublished: isPublishing,
      status: isPublishing ? 'PUBLISHED' : 'DRAFT',
      // Set publishedAt only on first-ever publish
      ...(isPublishing && !roadmap.publishedAt ? { publishedAt: now } : {}),
      updatedAt: now,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      _count: {
        select: { nodes: true },
      },
    },
  });

  // --- Cache invalidation ---
  await Promise.all([
    cache.invalidate(cacheKeys.roadmap(params.roadmapId)),
    cache.invalidate(cacheKeys.roadmapList()),
  ]);

  return createApiResponse(
    updated,
    `Roadmap ${action}ed successfully`
  );
});
