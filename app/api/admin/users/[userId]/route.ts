/**
 * Admin User Management — Single User
 *
 * GET   /api/admin/users/[userId]   — view full user detail
 * PATCH /api/admin/users/[userId]   — update role or disable/enable account
 *
 * Soft-disable field: `isDisabled Boolean @default(false)` on User.
 *   isDisabled = true  → account is disabled (blocked in requireAuth)
 *   isDisabled = false → account is active
 * This is separate from `isPublic` (user-facing profile-privacy toggle).
 *
 * Role-escalation rules enforced here (cumulative):
 *   1. Non-SUPER_ADMIN cannot modify any account whose current role is
 *      ADMIN or SUPER_ADMIN.
 *   2. Only SUPER_ADMIN can set a role to SUPER_ADMIN.
 *   3. Only SUPER_ADMIN can set a role to ADMIN.
 *   Net result: a plain ADMIN can only toggle the `disabled` flag on
 *   regular USER/MODERATOR accounts. Only SUPER_ADMIN can create new admins.
 *
 * DELETE is intentionally NOT implemented (soft-disable only by design).
 */

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma/client";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// ---------------------------------------------------------------------------
// GET /api/admin/users/[userId]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(
  async (_request: NextRequest, context: { params: { userId: string } }) => {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const { userId } = context.params;

    logger.info({
      route: "/api/admin/users/[userId]",
      method: "GET",
      message: "Admin viewed user detail",
      adminId: session.user.id,
      adminRole: session.user.role,
      targetUserId: userId,
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        github: true,
        linkedin: true,
        twitter: true,
        website: true,
        location: true,
        company: true,
        isPublic: true,
        isDisabled: true,
        newsletter: true,
        points: true,
        streak: true,
        lastActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        subscription: {
          select: {
            id: true,
            tier: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            externalId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            progress: true,
            bookmarks: true,
            likes: true,
            comments: true,
            replies: true,
            achievements: true,
            activities: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return createApiResponse(user);
  },
);

// ---------------------------------------------------------------------------
// PATCH /api/admin/users/[userId]
// ---------------------------------------------------------------------------

/**
 * Allow-listed fields an admin may update.
 * Raw body spread is NOT used — only fields present in this schema are written.
 */
const userPatchSchema = z
  .object({
    /** Change the user's platform role. */
    role: z.nativeEnum(UserRole).optional(),
    /**
     * Soft-disable (true) or re-enable (false) the account.
     * Maps to the `isDisabled` field in the User model.
     * Note: this is independent of `isPublic` (profile privacy).
     */
    disabled: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Request body must contain at least one field to update",
  });

export const PATCH = withErrorHandler(
  async (request: NextRequest, context: { params: { userId: string } }) => {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const { userId } = context.params;

    const body = await request.json();
    const validated = userPatchSchema.parse(body);

    // Resolve the target user first so we can guard against certain ops
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isDisabled: true },
    });

    if (!targetUser) {
      throw ApiError.notFound("User not found");
    }

    // Prevent a non-SUPER_ADMIN from modifying another ADMIN/SUPER_ADMIN
    if (
      session.user.role !== "SUPER_ADMIN" &&
      (targetUser.role === "ADMIN" || targetUser.role === "SUPER_ADMIN")
    ) {
      throw ApiError.forbidden(
        "Only SUPER_ADMIN can modify other admin accounts",
      );
    }

    // Prevent an admin from escalating a role to SUPER_ADMIN unless they are one
    if (validated.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      throw ApiError.forbidden("Only SUPER_ADMIN can grant SUPER_ADMIN role");
    }

    // Prevent a plain ADMIN from granting ADMIN role — only SUPER_ADMIN may
    // create new admins (or upgrade existing ones to ADMIN)
    if (validated.role === "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      throw ApiError.forbidden("Only SUPER_ADMIN can grant ADMIN role");
    }

    // Build explicit update payload from allow-list (no body spread)
    const updateData: { role?: UserRole; isDisabled?: boolean } = {};
    if (validated.role !== undefined) updateData.role = validated.role;
    if (validated.disabled !== undefined) updateData.isDisabled = validated.disabled;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isDisabled: true,
        updatedAt: true,
      },
    });

    logger.info({
      route: "/api/admin/users/[userId]",
      method: "PATCH",
      message: "Admin updated user",
      adminId: session.user.id,
      adminRole: session.user.role,
      targetUserId: userId,
      changes: updateData,
    });

    return createApiResponse(
      {
        ...updatedUser,
        // `disabled` is the logical API surface; `isDisabled` is the DB field
        disabled: updatedUser.isDisabled,
      },
      "User updated successfully",
    );
  },
);
