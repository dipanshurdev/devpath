import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Roadmap {
  id: string;
  roadmapId: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  _count?: {
    nodes: number;
    likes: number;
    bookmarks: number;
  };
}

interface RoadmapFilters {
  type?: string;
  difficulty?: string;
  featured?: boolean;
  search?: string;
}

// Fetch all roadmaps
export function useRoadmaps(filters?: RoadmapFilters) {
  return useQuery({
    queryKey: ["roadmaps", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append("type", filters.type);
      if (filters?.difficulty) params.append("difficulty", filters.difficulty);
      if (filters?.featured) params.append("featured", "true");
      if (filters?.search) params.append("search", filters.search);

      const { data } = await axios.get(`/api/roadmaps?${params.toString()}`);
      return data.data.data as Roadmap[];
    },
  });
}

// Fetch single roadmap
export function useRoadmap(roadmapId: string) {
  return useQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/roadmaps/${roadmapId}`);
      return data.data;
    },
    enabled: !!roadmapId,
  });
}

// Create roadmap
export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roadmapData: any) => {
      const { data } = await axios.post("/api/roadmaps", roadmapData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
    },
  });
}

// Update roadmap
export function useUpdateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roadmapId,
      data: roadmapData,
    }: {
      roadmapId: string;
      data: any;
    }) => {
      const { data } = await axios.put(
        `/api/roadmaps/${roadmapId}`,
        roadmapData,
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({
        queryKey: ["roadmap", variables.roadmapId],
      });
    },
  });
}

// Delete roadmap
export function useDeleteRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roadmapId: string) => {
      const { data } = await axios.delete(`/api/roadmaps/${roadmapId}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
    },
  });
}

// Like roadmap
export function useLikeRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roadmapId: string) => {
      const { data } = await axios.post(`/api/roadmaps/${roadmapId}/like`);
      return data;
    },
    onSuccess: (_, roadmapId) => {
      queryClient.invalidateQueries({ queryKey: ["roadmap", roadmapId] });
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
    },
  });
}

// Progress for a roadmap (completed node ids)
export function useRoadmapProgress(roadmapId: string) {
  return useQuery({
    queryKey: ["roadmap-progress", roadmapId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/roadmaps/${roadmapId}/progress`);
      return data.data?.completedNodeIds ?? [];
    },
    enabled: !!roadmapId,
  });
}

// Toggle node completion
export function useToggleNodeProgress(roadmapId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      nodeId,
      completed,
    }: {
      nodeId: string;
      completed: boolean;
    }) => {
      const { data } = await axios.post(`/api/roadmaps/${roadmapId}/progress`, {
        nodeId,
        completed,
      });
      return data.data?.completedNodeIds ?? [];
    },
    onSuccess: (completedNodeIds, _variables) => {
      queryClient.setQueryData(
        ["roadmap-progress", roadmapId],
        completedNodeIds,
      );
      queryClient.invalidateQueries({ queryKey: ["roadmap", roadmapId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// Dashboard data
export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard");
      return data.data;
    },
  });
}

// Search roadmaps via /api/search
export function useSearchRoadmaps(query: string, page = 1) {
  return useQuery({
    queryKey: ["roadmaps-search", query, page],
    queryFn: async () => {
      if (!query.trim()) return { roadmaps: [], pagination: null };
      const params = new URLSearchParams({ q: query, page: page.toString() });
      const { data } = await axios.get(`/api/search?${params.toString()}`);
      return {
        roadmaps: data.data.roadmaps as Roadmap[],
        pagination: data.data.pagination,
      };
    },
    enabled: query.trim().length > 0,
  });
}

// Trending roadmaps
export function useTrendingRoadmaps(limit = 6) {
  return useQuery({
    queryKey: ["roadmaps-trending", limit],
    queryFn: async () => {
      const { data } = await axios.get(`/api/trending?limit=${limit}`);
      return data.data.roadmaps as Roadmap[];
    },
  });
}
