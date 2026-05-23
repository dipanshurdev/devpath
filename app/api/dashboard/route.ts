import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardData } from "@/lib/prisma/queries";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * GET /api/dashboard
 * Returns dashboard data for the current user: stats, in-progress roadmaps, saved.
 */
export const GET = withErrorHandler(async (_request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw ApiError.unauthorized();
  }
  
  const data = await getDashboardData(session.user.id);
  if (!data) {
    throw ApiError.notFound("User not found");
  }
  
  return createApiResponse(data);
});
