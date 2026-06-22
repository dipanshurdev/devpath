import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma/client";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";
import { canDeleteResource } from "@/lib/comment-utils";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * DELETE /api/comments/[commentId]
 *
 * Owner (comment.userId === session.user.id) or ADMIN/SUPER_ADMIN may delete.
 * Cascade deletes nested replies via Prisma onDelete: Cascade.
 */
export const DELETE = withErrorHandler(async (
  _request: NextRequest,
  { params }: { params: { commentId: string } },
) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const comment = await prisma.comment.findUnique({
    where: { id: params.commentId },
    select: { id: true, userId: true },
  });

  if (!comment) {
    throw ApiError.notFound("Comment not found");
  }

  if (!canDeleteResource(session, comment.userId)) {
    throw ApiError.forbidden("You do not have permission to delete this comment");
  }

  if (session.user.id !== comment.userId) {
    logger.info({
      route: `/api/comments/${params.commentId}`,
      method: "DELETE",
      message: "Admin deleted comment",
      adminId: session.user.id,
      adminRole: session.user.role,
    });
  }

  await prisma.comment.delete({ where: { id: comment.id } });

  return createApiResponse(null, "Comment deleted successfully");
});
