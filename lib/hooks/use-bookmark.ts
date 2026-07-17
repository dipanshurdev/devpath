"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axios from "axios";

interface BookmarkResponse {
  success: boolean;
  data: {
    isBookmarked: boolean;
    bookmarkCount: number;
  };
  message: string;
}

interface UseBookmarkOptions {
  roadmapId: string;
  initialBookmarked?: boolean;
  initialLiked?: boolean;
  initialCount?: number;
}

export function useBookmark({ roadmapId, initialBookmarked, initialLiked, initialCount = 0 }: UseBookmarkOptions) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const shouldFetchStatus = (initialBookmarked === undefined || initialLiked === undefined) && !!session?.user?.id;

  // Query to check if roadmap is bookmarked and liked (from status API)
  const { data: bookmarkStatus } = useQuery({
    queryKey: ["bookmark", roadmapId],
    queryFn: async () => {
      if (!session?.user?.id) return { isBookmarked: false, isLiked: false, bookmarkCount: initialCount };

      try {
        const response = await axios.get(`/api/roadmaps/${roadmapId}/status`);
        return {
          isBookmarked: response.data.data.isBookmarked ?? false,
          isLiked: response.data.data.isLiked ?? false,
          bookmarkCount: response.data.data.bookmarkCount ?? initialCount,
        };
      } catch (error) {
        console.error("Error fetching bookmark status:", error);
        return { isBookmarked: false, isLiked: false, bookmarkCount: initialCount };
      }
    },
    enabled: shouldFetchStatus,
    initialData: { 
      isBookmarked: initialBookmarked ?? false, 
      isLiked: initialLiked ?? false,
      bookmarkCount: initialCount 
    },
  });

  // Mutation to bookmark roadmap
  const bookmarkMutation = useMutation({
    mutationFn: async (): Promise<BookmarkResponse> => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to bookmark roadmaps");
      }

      const response = await axios.post(`/api/roadmaps/${roadmapId}/bookmark`);
      return response.data;
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["bookmark", roadmapId] });

      // Snapshot the previous value
      const previousBookmark = queryClient.getQueryData(["bookmark", roadmapId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["bookmark", roadmapId], (old: any) => ({
        isBookmarked: true,
        bookmarkCount: (old?.bookmarkCount || 0) + 1,
      }));

      // Return a context object with the snapshotted value
      return { previousBookmark };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousBookmark) {
        queryClient.setQueryData(["bookmark", roadmapId], context.previousBookmark);
      }
      
      const message = error instanceof Error ? error.message : "Failed to bookmark roadmap";
      toast.error(message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Roadmap bookmarked successfully!");
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  // Mutation to unbookmark roadmap
  const unbookmarkMutation = useMutation({
    mutationFn: async (): Promise<BookmarkResponse> => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to unbookmark roadmaps");
      }

      const response = await axios.delete(`/api/roadmaps/${roadmapId}/bookmark`);
      return response.data;
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["bookmark", roadmapId] });

      // Snapshot the previous value
      const previousBookmark = queryClient.getQueryData(["bookmark", roadmapId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["bookmark", roadmapId], (old: any) => ({
        isBookmarked: false,
        bookmarkCount: Math.max(0, (old?.bookmarkCount || 0) - 1),
      }));

      // Return a context object with the snapshotted value
      return { previousBookmark };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousBookmark) {
        queryClient.setQueryData(["bookmark", roadmapId], context.previousBookmark);
      }
      
      const message = error instanceof Error ? error.message : "Failed to remove bookmark";
      toast.error(message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Bookmark removed successfully!");
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const toggleBookmark = () => {
    if (bookmarkStatus?.isBookmarked) {
      unbookmarkMutation.mutate();
    } else {
      bookmarkMutation.mutate();
    }
  };

  return {
    isBookmarked: bookmarkStatus?.isBookmarked || false,
    isLiked: bookmarkStatus?.isLiked || false,
    bookmarkCount: bookmarkStatus?.bookmarkCount || 0,
    isLoading: bookmarkMutation.isPending || unbookmarkMutation.isPending,
    toggleBookmark,
    bookmark: bookmarkMutation.mutate,
    unbookmark: unbookmarkMutation.mutate,
  };
}

// Hook for getting user's saved roadmaps
export function useSavedRoadmaps() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["saved-roadmaps"],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      try {
        const response = await axios.get("/api/bookmarks");
        return response.data.data || [];
      } catch (error) {
        console.error("Error fetching saved roadmaps:", error);
        throw error;
      }
    },
    enabled: !!session?.user?.id,
  });
}
