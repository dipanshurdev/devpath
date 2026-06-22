import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import { withErrorHandler, createApiResponse } from "@/lib/api-handler";
import {
  attachOwnershipFlags,
  commentContentSchema,
  commentWithRepliesInclude,
  enforceCommentRateLimit,
  resolvePublishedNode,
} from "@/lib/comment-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * GET /api/nodes/[nodeId]/comments
 *
 * Public read with optional session — attaches isOwner on comments and replies.
 * No response caching: paginated comment threads are write-heavy and the in-memory
 * cache does not support pattern invalidation across page keys.
 */
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { nodeId: string } },
) => {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.min(
    Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10) || 20),
    100,
  );

  const node = await resolvePublishedNode(params.nodeId);
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const where = {
    roadmapId: node.roadmapId,
    parentId: node.id,
  };

  const skip = (page - 1) * pageSize;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: commentWithRepliesInclude,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.comment.count({ where }),
  ]);

  const commentsWithOwnership = attachOwnershipFlags(comments, userId);

  const pagination = {
    page,
    pageSize,
    total,
    hasMore: skip + comments.length < total,
    totalPages: Math.ceil(total / pageSize),
  };

  return createApiResponse({ comments: commentsWithOwnership, pagination });
});

/**
 * POST /api/nodes/[nodeId]/comments — create a node-scoped comment (requireAuth).
 */
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { nodeId: string } },
) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  await enforceCommentRateLimit(session.user.id);

  const node = await resolvePublishedNode(params.nodeId);

  const body = await request.json();
  const { content } = commentContentSchema.parse(body);

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: session.user.id,
      roadmapId: node.roadmapId,
      parentId: node.id,
    },
    include: commentWithRepliesInclude,
  });

  const [commentWithOwnership] = attachOwnershipFlags(
    [{ ...comment, replies: [] }],
    session.user.id,
  );

  return createApiResponse(commentWithOwnership, "Comment created successfully", 201);
});
