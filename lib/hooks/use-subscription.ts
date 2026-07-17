"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export type SubscriptionTier = "FREE" | "PRO" | "TEAM";
export type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "PAST_DUE" | "NONE";

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionResponse {
  success: boolean;
  data?: {
    subscription: Subscription | null;
    user: {
      id: string;
      name: string | null;
      username: string | null;
      email: string;
      avatar: string | null;
    };
  };
  error?: string;
}

/**
 * Fetch the current user's subscription status
 * Returns null subscription if user has no subscription
 */
export function useSubscription() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["subscription"],
    queryFn: async (): Promise<Subscription | null> => {
      if (!session?.user?.id) {
        return null;
      }

      try {
        const response = await axios.get<SubscriptionResponse>("/api/subscriptions/me");
        
        if (response.data.success && response.data.data?.subscription) {
          return response.data.data.subscription;
        }
        
        return null;
      } catch (error) {
        console.error("Error fetching subscription:", error);
        // Return null on error - user likely has no subscription
        return null;
      }
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Check if user has an active subscription
 */
export function useHasActiveSubscription() {
  const { data: session } = useSession();
  const { data: subscription, ...rest } = useSubscription();

  const hasActiveSubscription = subscription?.status === "ACTIVE";

  return {
    hasActiveSubscription,
    subscription,
    ...rest,
    isAuthenticated: !!session?.user?.id,
  };
}

/**
 * Get the subscription display info for UI
 */
export function useSubscriptionDisplay() {
  const { hasActiveSubscription, subscription, isLoading, error } = useHasActiveSubscription();

  const tierDisplay: Record<SubscriptionTier, string> = {
    FREE: "Free",
    PRO: "Pro",
    TEAM: "Team",
  };

  const statusDisplay: Record<SubscriptionStatus, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    CANCELLED: "Cancelled",
    PAST_DUE: "Past Due",
    NONE: "No subscription",
  };

  return {
    tierLabel: subscription ? tierDisplay[subscription.tier] : "Free",
    statusLabel: subscription ? statusDisplay[subscription.status] : "Free",
    hasActiveSubscription,
    subscription,
    isLoading,
    error,
    isAuthenticated: !!isLoading,
  };
}
