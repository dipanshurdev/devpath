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

export type AuthResult =
  | { session: Session; response: null }
  | { session: null; response: NextResponse };

/**
 * Returns the current session if the request is authenticated.
 * If not authenticated, returns a 401 NextResponse that the caller should
 * return immediately.
 *
 * @example
 * ```ts
 * const { session, response } = await requireAuth();
 * if (response) return response;
 * // session is guaranteed non-null here
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      ),
    };
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
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return { session, response: null };
}
