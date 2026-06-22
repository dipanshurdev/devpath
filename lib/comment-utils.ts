/**
 * Shared helpers for comment/reply API routes.
 *
 * Node scoping: the Comment model has no nodeId field; `parentId` stores the
 * node's internal ObjectId so comments are scoped per node within a roadmap.
 */

import type { Session } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma/client";
import { cache } from "@/lib/cache";
import { ApiError, ERROR_CODES } from "@/lib/api-handler";

/** Min 1 char, max 5000 chars (trimmed). */
export const commentContentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(5000, "Content must be 5000 characters or fewer"),
});

export const authorSelect = {
  id: true,
  name: true,
  username: true,
  avatar: true,
} as const;

export const commentWithRepliesInclude = {
  user: { select: authorSelect },
  replies: {
    include: { user: { select: authorSelect } },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

export function isAdminRole(role: string | undefined): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function canDeleteResource(
  session: Session,
  authorUserId: string,
): boolean {
  return session.user.id === authorUserId || isAdminRole(session.user.role);
}

export async function resolvePublishedNode(nodeId: string) {
  const node = await prisma.node.findUnique({
    where: { nodeId },
    select: {
      id: true,
      roadmapId: true,
      roadmap: { select: { isPublished: true } },
    },
  });

  if (!node || !node.roadmap.isPublished) {
    throw ApiError.notFound("Node not found");
  }

  return node;
}

type WithUserId = { userId: string };
type CommentWithReplies = WithUserId & {
  replies?: WithUserId[];
};

export function attachOwnershipFlags<T extends CommentWithReplies>(
  comments: T[],
  sessionUserId?: string,
): Array<
  T & {
    isOwner: boolean;
    replies: Array<
      NonNullable<T["replies"]>[number] & { isOwner: boolean }
    >;
  }
> {
  if (!sessionUserId) {
    return comments.map((comment) => ({
      ...comment,
      isOwner: false,
      replies: (comment.replies ?? []).map((reply) => ({
        ...reply,
        isOwner: false,
      })),
    }));
  }

  return comments.map((comment) => ({
    ...comment,
    isOwner: comment.userId === sessionUserId,
    replies: (comment.replies ?? []).map((reply) => ({
      ...reply,
      isOwner: reply.userId === sessionUserId,
    })),
  }));
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60;

/** Simple cache-backed rate limit: 5 writes per user per 60 s. */
export async function enforceCommentRateLimit(userId: string): Promise<void> {
  const key = `ratelimit:comment:${userId}`;
  const count = (await cache.get<number>(key)) ?? 0;

  if (count >= RATE_LIMIT_MAX) {
    throw new ApiError(
      "Too many comments. Please wait before posting again.",
      429,
      ERROR_CODES.RATE_LIMIT,
    );
  }

  await cache.set(key, count + 1, { ttl: RATE_LIMIT_WINDOW_SECONDS });
}
