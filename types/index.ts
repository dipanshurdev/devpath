export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tag?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tag?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type AppwriteIds = {
  projectId: string | undefined;
  databaseId: string | undefined;
  projectUrl: string | undefined;
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
