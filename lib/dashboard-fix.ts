/**
 * Dashboard Query Fix
 * 
 * This fixes the "Query data cannot be undefined" error
 * by providing fallback data and proper error handling
 */

import { useState, useEffect } from 'react';

export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    avatar: string | null;
    streak: number;
    points: number;
    lastActive: string;
  };
  stats: {
    inProgressRoadmaps: number;
    completedNodes: number;
    savedCount: number;
    totalActivities: number;
  };
  inProgress: any[];
  saved: any[];
  weeklyActivity: {
    dailyActivity: Record<string, any>;
    totalActivities: number;
    streakDays: number;
  };
}

export function useDashboardData(userId: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch dashboard data');
        }
        
        // Ensure data structure is valid and never undefined
        const dashboardData: DashboardData = {
          user: result.data?.user || {
            id: userId,
            name: 'User',
            email: '',
            username: 'user',
            avatar: null,
            streak: 0,
            points: 0,
            lastActive: new Date().toISOString(),
          },
          stats: result.data?.stats || {
            inProgressRoadmaps: 0,
            completedNodes: 0,
            savedCount: 0,
            totalActivities: 0,
          },
          inProgress: result.data?.inProgress || [],
          saved: result.data?.saved || [],
          weeklyActivity: result.data?.weeklyActivity || {
            dailyActivity: {},
            totalActivities: 0,
            streakDays: 0,
          },
        };
        
        setData(dashboardData);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
        
        // Set fallback data to prevent undefined errors
        const fallbackData: DashboardData = {
          user: {
            id: userId,
            name: 'User',
            email: '',
            username: 'user',
            avatar: null,
            streak: 0,
            points: 0,
            lastActive: new Date().toISOString(),
          },
          stats: {
            inProgressRoadmaps: 0,
            completedNodes: 0,
            savedCount: 0,
            totalActivities: 0,
          },
          inProgress: [],
          saved: [],
          weeklyActivity: {
            dailyActivity: {},
            totalActivities: 0,
            streakDays: 0,
          },
        };
        
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [userId]);

  return { data, loading, error };
}
