import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma/client";
import {
  getCompletedNodeIdsForRoadmap,
  setNodeCompleted,
  createActivity,
} from "@/lib/prisma/queries";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

/**
 * GET /api/roadmaps/[roadmapId]/progress
 * Returns completed node IDs (internal ids) for the current user on this roadmap.
 */
export const GET = withErrorHandler(async (
  _request: NextRequest,
  { params }: { params: { roadmapId: string } },
) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const roadmapId = params.roadmapId;
  if (!roadmapId) {
    throw ApiError.badRequest("roadmapId required");
  }

  const completedNodeIds = await getCompletedNodeIdsForRoadmap(
    session.user.id,
    roadmapId,
  );

  return createApiResponse({ completedNodeIds });
});

/**
 * POST /api/roadmaps/[roadmapId]/progress
 * Body: { nodeId: string, completed: boolean }
 * Toggle node completion for the current user. nodeId is the Node's internal id.
 * Records activity, detects completion, and awards points.
 */
export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { roadmapId: string } },
) => {
  const { session, response } = await requireAuth();
  if (response) return response;

  const roadmapId = params.roadmapId;
  if (!roadmapId) {
    throw ApiError.badRequest("roadmapId required");
  }

  const body = await request.json();
  const { nodeId, completed } = body;
  if (typeof nodeId !== "string" || typeof completed !== "boolean") {
    throw ApiError.badRequest("nodeId (string) and completed (boolean) required");
  }

  // Get roadmap and node info for activity tracking
  const roadmap = await prisma.roadmap.findUnique({
    where: { roadmapId },
    select: { id: true, title: true },
  });

  const node = await prisma.node.findUnique({
    where: { id: nodeId },
    select: { title: true },
  });

  if (!roadmap || !node) {
    throw ApiError.notFound("Roadmap or node not found");
  }

  // Update progress
  await setNodeCompleted(session.user.id, roadmapId, nodeId, completed);

  // Get roadmap completion status for response
  const allNodes = await prisma.node.findMany({
    where: { roadmapId: roadmap.id },
    select: { id: true },
  });

  const completedNodeIds = await getCompletedNodeIdsForRoadmap(
    session.user.id,
    roadmapId,
  );

  // Record activity and award points if completed
  if (completed) {
    // Create activity entry
    await createActivity({
      userId: session.user.id,
      type: "NODE_COMPLETED",
      roadmapId: roadmap.id,
      metadata: JSON.stringify({
        nodeId,
        nodeTitle: node.title,
        roadmapTitle: roadmap.title,
      }),
    });

    // Award points for node completion (10 points per node)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: { increment: 10 },
        lastActive: new Date(),
      },
    });

    // Check if roadmap is now fully completed
    if (completedNodeIds.length === allNodes.length && allNodes.length > 0) {
      // Roadmap fully completed - award bonus points and create activity
      await prisma.$transaction(async (tx) => {
        // Award completion bonus (50 points)
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            points: { increment: 50 },
            streak: { increment: 1 },
          },
        });
        
        // Create completion activity
        await tx.activity.create({
          data: {
            userId: session.user.id,
            type: "ROADMAP_COMPLETED",
            roadmapId: roadmap.id,
            metadata: JSON.stringify({
              roadmapTitle: roadmap.title,
              totalNodes: allNodes.length,
            }),
          },
        });
        
        // Update roadmap completion count
        await tx.roadmap.update({
          where: { id: roadmap.id },
          data: { completionCount: { increment: 1 } },
        });
      });
    }
  }

  return createApiResponse({ 
    completedNodeIds,
    pointsEarned: completed ? 10 : 0,
    isRoadmapCompleted: completedNodeIds.length === allNodes.length,
  });
});
