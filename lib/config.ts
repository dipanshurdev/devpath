/**
 * Central application configuration module.
 *
 * All non-secret, application-level configuration lives here.
 * Secret values (API keys, connection strings) belong in `lib/env.ts`.
 *
 * Requirements: 16.1, 12.4
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SubscriptionTier = "FREE" | "PRO" | "TEAM";

export interface TierLimits {
  /** Maximum number of custom roadmaps the user may create. */
  maxCustomRoadmaps: number;
  /** Maximum number of team members (0 = no team feature). */
  maxTeamMembers: number;
  /** Whether the tier includes access to premium resources. */
  premiumResources: boolean;
  /** Whether the tier includes advanced analytics. */
  advancedAnalytics: boolean;
  /** Whether the tier includes priority support. */
  prioritySupport: boolean;
}

export interface FeatureGates {
  /** Feature name → minimum tier required to access it. */
  [featureName: string]: SubscriptionTier;
}

export interface PaginationConfig {
  defaultPageSize: number;
  maxPageSize: number;
}

export interface CacheConfig {
  /** TTL in seconds for the roadmap list endpoint. */
  roadmapListTtl: number;
  /** TTL in seconds for individual roadmap detail endpoints. */
  roadmapDetailTtl: number;
}

export interface PointsConfig {
  /** Points awarded when a user completes a node. */
  nodeCompleted: number;
  /** Points awarded when a user completes an entire roadmap. */
  roadmapCompleted: number;
}

export interface AppConfig {
  pagination: PaginationConfig;
  cache: CacheConfig;
  subscriptionTiers: Record<SubscriptionTier, TierLimits>;
  /**
   * Maps feature names to the minimum subscription tier required.
   * Populated fully in task 16.2; placeholder entries are included here
   * so that `checkFeatureAccess` can reference this object from day one.
   */
  featureGates: FeatureGates;
  points: PointsConfig;
}

// ---------------------------------------------------------------------------
// Configuration object
// ---------------------------------------------------------------------------

export const config: AppConfig = {
  // -------------------------------------------------------------------------
  // Pagination
  // -------------------------------------------------------------------------
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // -------------------------------------------------------------------------
  // Cache TTLs (seconds)
  // -------------------------------------------------------------------------
  cache: {
    roadmapListTtl: 60,
    roadmapDetailTtl: 300,
  },

  // -------------------------------------------------------------------------
  // Subscription tier limits
  // Placeholder values — adjust when billing is wired up (task 16.x).
  // -------------------------------------------------------------------------
  subscriptionTiers: {
    FREE: {
      maxCustomRoadmaps: 3,
      maxTeamMembers: 0,
      premiumResources: false,
      advancedAnalytics: false,
      prioritySupport: false,
    },
    PRO: {
      maxCustomRoadmaps: 50,
      maxTeamMembers: 0,
      premiumResources: true,
      advancedAnalytics: true,
      prioritySupport: false,
    },
    TEAM: {
      maxCustomRoadmaps: 200,
      maxTeamMembers: 25,
      premiumResources: true,
      advancedAnalytics: true,
      prioritySupport: true,
    },
  },

  // -------------------------------------------------------------------------
  // Feature gates
  // Maps feature name → minimum tier required.
  // Will be expanded in task 16.2 when `checkFeatureAccess` is implemented.
  // -------------------------------------------------------------------------
  featureGates: {
    custom_roadmaps: "PRO",
    team_collaboration: "TEAM",
    premium_resources: "PRO",
    advanced_analytics: "PRO",
    priority_support: "TEAM",
  },

  // -------------------------------------------------------------------------
  // Gamification points
  // -------------------------------------------------------------------------
  points: {
    nodeCompleted: 10,
    roadmapCompleted: 100,
  },
} as const;
