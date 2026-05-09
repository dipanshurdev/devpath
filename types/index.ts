export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

/**
 * Canonical user type aligned with the Prisma User model and NextAuth session.
 * Use this instead of the Prisma-generated User type for UI/API boundaries.
 */
export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  /** Avatar URL — maps to `avatar` in the Prisma User model */
  avatar?: string;
  bio?: string;
  role: string;
};

export interface NodeData {
  title: string;
  description: string | null;
  resources: Resource[];
  related_node: RelatedNode[];
}

export interface Resource {
  title: string;
  description: string | null;
  type: string;
  url: string;
  difficulty: string;
}

export interface RelatedNode {
  title: string;
  description: string;
  nodeId: string;
}

export type RoleType = {
  id: string;
  name: string;
  inConstruction?: boolean;
  estimatedTime?: string;
  difficulty?: "Advanced" | "Intermediate" | "Expert";
  topics?: string;
  likes?: string[];
};
