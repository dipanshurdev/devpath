import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma/client";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";
import {
  authorSelect,
  commentContentSchema,
  enforceCommentRateLimit,
} from "@/lib/comment-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * POST /api/comments/[commentId]/replies — create a reply (requireAuth).
 */
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { commentId: string } },
) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  await enforceCommentRateLimit(session.user.id);

  const comment = await prisma.comment.findUnique({
    where: { id: params.commentId },
    select: {
      id: true,
      roadmap: { select: { isPublished: true } },
    },
  });

  if (!comment || !comment.roadmap.isPublished) {
    throw ApiError.notFound("Comment not found");
  }

  const body = await request.json();
  const { content } = commentContentSchema.parse(body);

  const reply = await prisma.reply.create({
    data: {
      content,
      userId: session.user.id,
      commentId: comment.id,
    },
    include: { user: { select: authorSelect } },
  });

  return createApiResponse(
    { ...reply, isOwner: true },
    "Reply created successfully",
    201,
  );
});
