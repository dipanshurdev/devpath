/**
 * Admin Dashboard Stats API
 *
 * Returns real-time counts for roadmaps, nodes, resources, and users.
 * Requires admin authentication.
 *
 * Requirements: 5.4, 13.3
 */

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma/client";
import { logger } from "@/lib/logger";

export async function GET() {
  const { session, response } = await requireAdmin();
  if (response) return response;

  try {
    // Log admin access to aggregate user data
    logger.info({
      route: "/api/admin/stats",
      method: "GET",
      message: "Admin accessed platform stats",
      adminId: session.user.id,
      adminRole: session.user.role,
    });

    const [roadmapCount, nodeCount, resourceCount, userCount] = await Promise.all(
      [
        prisma.roadmap.count(),
        prisma.node.count(),
        prisma.resource.count(),
        prisma.user.count(),
      ],
    );

    return NextResponse.json({
      success: true,
      data: { roadmapCount, nodeCount, resourceCount, userCount },
    });
  } catch (error: unknown) {
    logger.error({
      route: "/api/admin/stats",
      method: "GET",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
