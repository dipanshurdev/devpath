import { Client, Account, Databases, Avatars } from "appwrite";
export const client = new Client();

export const appwriteIds = {
  projectId: process.env.NEXT_APP_APPWRITE_PROJECT_ID as string,
  databaseId: process.env.NEXT_APP_APPWRITE_DATABASE_ID as string,
  projectUrl: process.env.NEXT_APP_APPWRITE_URL as string,
  userCollectionId: process.env.NEXT_APP_APPWRITE_USERS_COLLECTION_ID as string,
};

client.setEndpoint(appwriteIds.projectUrl);
client.setProject(appwriteIds.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
// export const storage = new Storage(client);
export const avatars = new Avatars(client);
