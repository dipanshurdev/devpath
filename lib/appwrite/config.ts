"use client";

import { Client, Account, Databases, Avatars } from "appwrite";

export const appwriteIds = {
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
  projectUrl: process.env.NEXT_PUBLIC_APPWRITE_URL as string,
  userCollectionId: process.env
    .NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID as string,
};

export const client = new Client();

client.setProject(appwriteIds.projectId).setEndpoint(appwriteIds.projectUrl);

export const account = new Account(client);
export const databases = new Databases(client);
// export const storage = new Storage(client);
export const avatars = new Avatars(client);
