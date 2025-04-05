import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  getRoadmaps,
  getRoadmapById,
  getCurrentUser,
  getNodes,
  likeRoadmap,
  saveRoadmap,
} from "../appwrite/api";

export function useGetRoadmaps() {
  return useSWR("roadmaps", getRoadmaps);
}

export function useGetRoadmap(roadmapId: string) {
  return useSWR(roadmapId ? `roadmap-${roadmapId}` : null, () =>
    getRoadmapById(roadmapId)
  );
}

export function useGetCurrentUser() {
  return useSWR("current-user", getCurrentUser);
}

export function useNodes(nodeId: string) {
  return useSWR(nodeId ? `nodes-${nodeId}` : null, () => getNodes(nodeId));
}

export function useLikeRoadmap() {
  return useSWRMutation(
    "roadmaps", // Key for SWR to trigger revalidation
    async (
      _,
      { arg }: { arg: { roadmapId: string; updatedLikes: string[] } }
    ) => {
      const { roadmapId, updatedLikes } = arg;
      return await likeRoadmap(roadmapId, updatedLikes);
    }
  );
}

// Hook for handling save functionality
export function useSaveRoadmap() {
  return useSWRMutation(
    "saved-roadmaps", // Key for SWR to trigger revalidation
    async (_, { arg }: { arg: { roadmapId: string; userId: string } }) => {
      const { roadmapId, userId } = arg;
      return await saveRoadmap(roadmapId, userId);
    }
  );
}
