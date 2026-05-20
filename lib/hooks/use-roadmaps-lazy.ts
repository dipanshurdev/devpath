import React, { useCallback, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface RoadmapFilters {
  type?: string;
  difficulty?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface Roadmap {
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
  creator: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  _count?: {
    nodes: number;
    likes: number;
    bookmarks: number;
  };
}

// Optimized hook with lazy loading and infinite scroll
export function useRoadmapsLazy(filters: RoadmapFilters = {}) {
  const queryClient = useQueryClient();

  // Base query for initial data
  const baseQuery = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.featured) params.append('featured', 'true');
    if (filters.search) params.append('search', filters.search);
    
    const { data } = await axios.get(`/api/roadmaps?${params.toString()}`);
    return data.data as { data: Roadmap[]; pagination: any };
  }, [filters]);

  const {
    data: initialData,
    isLoading: isInitialLoading,
    error: initialError,
  } = useQuery({
    queryKey: ['roadmaps', 'initial', filters],
    queryFn: baseQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Infinite scroll query
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    error,
  } = useInfiniteQuery({
    queryKey: ['roadmaps', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.featured) params.append('featured', 'true');
      if (filters.search) params.append('search', filters.search);
      params.append('page', pageParam.toString());
      
      return axios.get(`/api/roadmaps?${params.toString()}`);
    },
    getNextPageParam: (lastPage: any) => {
      if (!lastPage || !lastPage.pagination) return 1;
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return infiniteData?.pages?.flat() || [];
  }, [infiniteData]);

  // Combine data from both queries
  const allData = useMemo(() => {
    if (filters.page || filters.pageSize) {
      // Use infinite scroll for pagination
      return filteredData;
    }
    return initialData?.data || [];
  }, [initialData?.data, filteredData]);

  const isLoading = isInitialLoading || isFetching;

  return {
    data: allData,
    isLoading,
    error: initialError || error,
    infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  };
}

// Hook for lazy loading with intersection observer
export function useLazyRoadmap(roadmapId: string) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['roadmap', roadmapId],
    queryFn: async () => {
      if (!shouldFetch) return null;
      const { data } = await axios.get(`/api/roadmaps/${roadmapId}`);
      return data.data;
    },
    enabled: shouldFetch,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Start fetching when component comes into view
  React.useEffect(() => {
    if (inView && !shouldFetch && !data) {
      setShouldFetch(true);
    }
  }, [inView, shouldFetch, data]);

  return {
    data,
    isLoading,
    error,
    ref,
  };
}

// Optimized hook for roadmap list with virtual scrolling
export function useVirtualizedRoadmaps(filters: RoadmapFilters = {}) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['roadmaps', 'virtualized', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.featured) params.append('featured', 'true');
      if (filters.search) params.append('search', filters.search);
      
      const { data } = await axios.get(`/api/roadmaps?${params.toString()}`);
      return data.data as { data: Roadmap[]; pagination: any };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: any) => ({
      data: data.data,
      pagination: data.pagination,
    }),
  });

  // Memoized filtered data with performance optimizations
  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.filter((roadmap: Roadmap) => {
      if (filters.type && roadmap.type !== filters.type) return false;
      if (filters.difficulty && roadmap.difficulty !== filters.difficulty) return false;
      if (filters.featured && !roadmap.isFeatured) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          roadmap.title.toLowerCase().includes(searchLower) ||
          roadmap.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [data?.data, filters]);

  return {
    data: filteredData,
    isLoading,
    error,
    pagination: data?.pagination,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  };
}
