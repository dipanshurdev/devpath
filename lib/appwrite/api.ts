"use client";

import { INewUser } from "@/types";
import { account, appwriteIds, avatars, databases } from "./config";
import { ID, Query } from "appwrite";

const {
  databaseId,
  nodeId,
  nodesId,
  projectId,
  projectUrl,
  resourcesId,
  roadmapsId,
  userCollectionId,
} = appwriteIds;

// CREATE THE USER ACCOUNT
export async function createAccount(user: INewUser) {
  const { email, name, password, username } = user;
  try {
    const createdAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (!createdAccount) {
      throw new Error("An Error Occurred while creating an Account!");
    }

    const avatarUrl = avatars.getInitials(name);

    const newUser = await saveUserToDB({
      accountId: createdAccount.$id,
      name: createdAccount.name,
      email: createdAccount.email,
      username: username,
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
      databaseId,
      userCollectionId,
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
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getRoadmaps() {
  try {
    const roadmaps = await databases.listDocuments(databaseId, roadmapsId);

    return roadmaps;
  } catch (error) {
    console.log(error);
  }
}

export async function getRoadmapById(roadmapId: string) {
  try {
    const roadmaps = await databases.listDocuments(databaseId, roadmapsId, [
      `roadmap_id=equal.${roadmapId}`,
    ]);

    if (roadmaps.total === 0) {
      throw new Error("Roadmap not found");
    }

    // Return the first document that matches (assuming roadmapId is unique)
    return roadmaps.documents[0];
  } catch (error) {
    console.error("Error fetching roadmap by ID:", error);
    return null;
  }
}

export async function getNodes(nodeId: string) {
  return databases.listDocuments(databaseId, nodesId, [
    `nodeId=equal.${nodeId}`,
  ]);
}

export async function getNode(getNodeId: string) {
  return databases.listDocuments(databaseId, nodeId, [
    `nodeId=equal.${getNodeId}`,
  ]);
}
