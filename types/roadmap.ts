/**
 * Lightweight roadmap types for UI viewers (path view, demos).
 * API/Prisma shapes may differ; map at the boundary when needed.
 */

export interface RoadmapResource {
  id?: string
  title: string
  description?: string
  type?: string
  url?: string
  difficulty?: string
}

export interface RoadmapNode {
  nodeId: string
  title: string
  description?: string
  resources: RoadmapResource[]
}

export interface Roadmap {
  nodes: RoadmapNode[]
  title?: string
  /** Duration label shown in the path viewer (API may use snake_case) */
  estimated_time_to_finish?: string
  estimatedTime?: string
}
