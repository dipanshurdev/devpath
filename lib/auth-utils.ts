/**
 * Server-side session guard helpers.
 *
 * Use `requireAuth` and `requireAdmin` at the top of API route handlers to
 * enforce authentication and authorization before any DB queries are made.
 *
 * Requirements: 4.6, 5.1, 5.2, 5.3
 */

import { getServerSession, type Session } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import crypto from "crypto";

export type AuthResult =
  | { session: Session; response: null }
  | { session: null; response: NextResponse };

/**
 * Returns the current session if the request is authenticated AND the account
 * is not admin-disabled.
 *
 * Admin disable: a SUPER_ADMIN or ADMIN sets `isDisabled = true` via
 * `PATCH /api/admin/users/[userId]` with `{ disabled: true }`.  Because the
 * JWT lives up to 30 days we cannot rely on the token alone — we re-check the
 * DB on every request so a disable takes effect immediately on the next call.
 *
 * `isDisabled` is intentionally separate from `isPublic` (the user-facing
 * profile-privacy toggle).  A user setting their profile to private does NOT
 * affect their ability to use requireAuth-guarded routes.
 *
 * @example
 * ```ts
 * const { session, response } = await requireAuth();
 * if (response) return response;
 * // session is guaranteed non-null here, and user is not disabled
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const requestId = `req_${crypto.randomUUID()}`;
    const response = NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
        code: "UNAUTHORIZED",
        timestamp: new Date().toISOString(),
        requestId,
      },
      { status: 401 },
    );
    response.headers.set("X-Request-ID", requestId);
    return { session: null, response };
  }

  // Re-check the DB to enforce immediate disable (JWT cannot be revoked).
  // We select only `isDisabled` — profile privacy (`isPublic`) is irrelevant here.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isDisabled: true },
  });

  if (!dbUser || dbUser.isDisabled) {
    const requestId = `req_${crypto.randomUUID()}`;
    const response = NextResponse.json(
      {
        success: false,
        error: "Account disabled",
        code: "ACCOUNT_DISABLED",
        timestamp: new Date().toISOString(),
        requestId,
      },
      { status: 403 },
    );
    response.headers.set("X-Request-ID", requestId);
    return { session: null, response };
  }

  return { session, response: null };
}

/**
 * Returns the current session if the request is authenticated AND the user
 * has an admin role (ADMIN or SUPER_ADMIN).
 * Returns a 401 if not authenticated, or a 403 if authenticated but not admin.
 *
 * @example
 * ```ts
 * const { session, response } = await requireAdmin();
 * if (response) return response;
 * // session.user.role is ADMIN or SUPER_ADMIN here
 * ```
 */
export async function requireAdmin(): Promise<AuthResult> {
  const authResult = await requireAuth();
  if (authResult.response) return authResult;

  const { session } = authResult;
  const role = session.user.role;

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    const requestId = `req_${crypto.randomUUID()}`;
    const response = NextResponse.json(
      {
        success: false,
        error: "Forbidden",
        code: "FORBIDDEN",
        timestamp: new Date().toISOString(),
        requestId,
      },
      { status: 403 },
    );
    response.headers.set("X-Request-ID", requestId);
    return {
      session: null,
      response,
    };
  }

  return { session, response: null };
}
