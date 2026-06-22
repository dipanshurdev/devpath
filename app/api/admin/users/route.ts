/**
 * Admin User Management — List Users
 *
 * GET /api/admin/users
 *   Returns a paginated, filterable list of users.
 *   Requires ADMIN or SUPER_ADMIN role.
 *
 * Query params:
 *   page        - page number (default 1)
 *   pageSize    - items per page (default 20, max 100)
 *   role        - filter by UserRole (USER | MODERATOR | ADMIN | SUPER_ADMIN)
 *   search      - case-insensitive match on name, username, or email
 *   disabled    - "true" | "false" to filter by account status (maps to isDisabled field)
 */

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma/client";
import { withErrorHandler, createApiResponse } from "@/lib/api-handler";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { Prisma, UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  role: z.nativeEnum(UserRole).optional(),
  search: z.string().max(200).optional(),
  disabled: z
    .enum(["true", "false"])
    .transform((v) => (v === "true" ? true : v === "false" ? false : undefined))
    .optional(),
});

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { session, response } = await requireAdmin();
  if (response) return response;

  logger.info({
    route: "/api/admin/users",
    method: "GET",
    message: "Admin listed users",
    adminId: session.user.id,
    adminRole: session.user.role,
  });

  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const query = querySchema.parse(searchParams);
  const { page, pageSize, role, search, disabled } = query;

  const where: Prisma.UserWhereInput = {};

  if (role) where.role = role;

  // Filter by admin-disable state using the dedicated `isDisabled` field.
  if (disabled !== undefined) {
    where.isDisabled = disabled;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        isPublic: true,
        isDisabled: true,
        points: true,
        streak: true,
        lastActive: true,
        createdAt: true,
        subscription: {
          select: {
            tier: true,
            status: true,
            currentPeriodEnd: true,
          },
        },
        _count: {
          select: {
            progress: true,
            bookmarks: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  const pagination = {
    page,
    pageSize,
    total,
    hasMore: skip + users.length < total,
    totalPages: Math.ceil(total / pageSize),
  };

  return createApiResponse({ users, pagination });
});
