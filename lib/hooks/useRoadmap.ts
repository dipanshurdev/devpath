import useSWR from "swr";
import { getRoadmapById } from "@/lib/appwrite/api";

export function useRoadmap(roadmapId: string) {
  const { data, error, mutate } = useSWR(
    `roadmap-${roadmapId}`,
    () => getRoadmapById(roadmapId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    roadmap: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
