import { NextRequest } from "next/server";
import { getDashboardData } from "@/lib/prisma/queries";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";
import { requireAuth } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * GET /api/dashboard
 * Returns dashboard data for the current user: stats, in-progress roadmaps, saved.
 */
export const GET = withErrorHandler(async (_request: NextRequest) => {
  const { session, response } = await requireAuth();
  if (response) return response;
  
  const data = await getDashboardData(session.user.id);
  if (!data) {
    throw ApiError.notFound("User not found");
  }
  
  return createApiResponse(data);
});
