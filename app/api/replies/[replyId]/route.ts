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
 * DELETE /api/replies/[replyId]
 *
 * Owner (reply.userId === session.user.id) or ADMIN/SUPER_ADMIN may delete.
 */
export const DELETE = withErrorHandler(async (
  _request: NextRequest,
  { params }: { params: { replyId: string } },
) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const reply = await prisma.reply.findUnique({
    where: { id: params.replyId },
    select: { id: true, userId: true },
  });

  if (!reply) {
    throw ApiError.notFound("Reply not found");
  }

  if (!canDeleteResource(session, reply.userId)) {
    throw ApiError.forbidden("You do not have permission to delete this reply");
  }

  if (session.user.id !== reply.userId) {
    logger.info({
      route: `/api/replies/${params.replyId}`,
      method: "DELETE",
      message: "Admin deleted reply",
      adminId: session.user.id,
      adminRole: session.user.role,
    });
  }

  await prisma.reply.delete({ where: { id: reply.id } });

  return createApiResponse(null, "Reply deleted successfully");
});
