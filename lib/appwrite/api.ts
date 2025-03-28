"use client";

import { INewUser } from "@/types";
import { account, appwriteIds, avatars, databases } from "./config";
import { ID, Query } from "appwrite";

const {
  databaseId,
  nodeId,
  nodesId,
  // projectId,
  // projectUrl,
  // resourcesId,
  roadmapsId,
  userCollectionId,
  savedRoadmapsId
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
    console.error("Error fetching account:", error);
    return null;
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error("Account not found");

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("User data not found in the database");
    }
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
      Query.equal("roadmap_id", roadmapId),

      // `roadmap_id=equal.${roadmapId}`,
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

// ============================== LIKE / UNLIKE POST
export async function likePost(roadmapId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      databaseId,
      roadmapsId,
      roadmapId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(roadmapId: string, userId: string) {
  try {
    const saveRoadmap = await databases.createDocument(
      databaseId,
      savedRoadmapsId,
      ID.unique(),
      {
        user: userId,
        roadmap: roadmapId,
      }
    );

    if (!saveRoadmap) throw Error;

    return saveRoadmap;
  } catch (error) {
    console.log(error);
  }
}

// export async function commentPost(postId: string, comment: string[]) {
//   try {
//     // const post = await getPostById(postId);
//     // const prevComments = post?.cmnts;
//     console.log(`log from api ${comment} and the id ${postId}`);

//     const addComment = await databases.updateDocument(
//       appwriteConfig.databasesId,
//       appwriteConfig.postsCollectionId,
//       postId,
//       {
//         // cmnts: prevComments ? [...prevComments, comment] : comment,
//         userComment: comment,
//       }
//     );

//     if (!addComment) throw Error;
//     return addComment;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      databaseId,
      savedRoadmapsId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
// export async function getUserById(userId: string) {
//   try {
//     const user = await databases.getDocument(
//       appwriteConfig.databasesId,
//       appwriteConfig.userCollectionId,
//       userId
//     );

//     if (!user) throw Error;

//     return user;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== UPLOAD FILE
// export async function uploadFile(file: File) {
//   try {
//     const uploadedFile = await storage.createFile(
//       appwriteConfig.storageId,
//       ID.unique(),
//       file
//     );

//     return uploadedFile;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== GET FILE URL
// export function getFilePreview(fileId: string) {
//   try {
//     const fileUrl = storage.getFilePreview(
//       appwriteConfig.storageId,
//       fileId,
//       1000,
//       1000,
//       "top",
//       100
//     );

//     if (!fileUrl) throw Error;

//     return fileUrl;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== DELETE FILE
// export async function deleteFile(fileId: string) {
//   try {
//     await storage.deleteFile(appwriteConfig.storageId, fileId);

//     return { status: "ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== UPDATE USER
// export async function updateUser(user: IUpdateUser) {
//   const hasFileToUpdate = user.file.length > 0;
//   try {
//     let image = {
//       imageUrl: user.imageUrl,
//       imageId: user.imageId,
//     };

//     if (hasFileToUpdate) {
//       // Upload new file to appwrite storage
//       const uploadedFile = await uploadFile(user.file[0]);
//       if (!uploadedFile) throw Error;

//       // Get new file url
//       const fileUrl = getFilePreview(uploadedFile.$id);

//       if (!fileUrl) {
//         await deleteFile(uploadedFile.$id);
//         throw Error;
//       }

//       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
//     }

//     //  Update user
//     const updatedUser = await databases.updateDocument(
//       appwriteConfig.databasesId,
//       appwriteConfig.userCollectionId,
//       user.userId,
//       {
//         name: user.name,
//         bio: user.bio,
//         imageUrl: image.imageUrl,
//         imageId: image.imageId,
//       }
//     );

//     // Failed to update
//     if (!updatedUser) {
//       // Delete new file that has been recently uploaded
//       if (hasFileToUpdate) {
//         await deleteFile(image.imageId);
//       }
//       // If no new file uploaded, just throw error
//       throw Error;
//     }

//     // Safely delete old file after successful update
//     if (user.imageId && hasFileToUpdate) {
//       await deleteFile(user.imageId);
//     }

//     return updatedUser;
//   } catch (error) {
//     console.log(error);
//   }
// }
