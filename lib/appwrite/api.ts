// /my-nextjs-app
// ├── /public                 # Static files like images and fonts
// ├── /src
// │   ├── /components         # Reusable UI components
// │   ├── /pages              # Next.js pages (auto-routed)
// │   │   ├── /api            # API routes for Next.js
// │   │   ├── _app.js         # Custom App component
// │   │   └── index.js        # Home page
// │   ├── /lib                # Utility functions and libraries
// │   │   └── appwrite.js     # Appwrite client initialization
// │   ├── /hooks              # Custom React hooks (e.g., useAuth, useFetch)
// │   ├── /context            # React context providers (e.g., AuthContext)
// │   ├── /styles             # Global styles and component-specific styles
// │   └── /types              # TypeScript definitions (if using TypeScript)
// ├── /config                 # Configuration files (e.g., environment variables)
// │   └── appwriteConfig.js   # Appwrite configuration (e.g., endpoints, project ID)
// ├── /tests                  # Unit and integration tests
// ├── .env                    # Environment variables
// ├── package.json            # Project metadata and dependencies
// └── next.config.js          # Next.js configuration

import { INewUser } from "@/types";
import { account, appwriteIds, avatars, databases } from "./config";
import { ID } from "appwrite";

// CREATE THE USER ACCOUNT
export async function createAccount(user: INewUser) {
  try {
    const createdAccount = await account.create(
      ID.unique(),
      user.name,
      user.email,
      user.password
    );

    if (!createdAccount) {
      throw new Error("An Error Occurred while creating an Account!");
    }

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: createdAccount.$id,
      name: createdAccount.name,
      email: createdAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// SAVE THE USER TO DATABASE
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteIds.databaseId,
      appwriteIds.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// SIGN IN FUNCTION
export async function signInUser(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {}
}
