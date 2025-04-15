import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteSavedRoadmap,
  useGetCurrentUser,
  useLikeRoadmap,
  useSaveRoadmap,
} from "@/lib/hooks/swr-hooks";
import { Models } from "appwrite";
import { Bookmark, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsBookmarkFill, BsHeartFill } from "react-icons/bs";
import { toast } from "react-toastify";

type StatsProps = {
  inConstruction?: boolean;
  userId?: string;
  savedUserIds?: string[];
  likedUserIds?: string[];
  savedBy: string[];
  liked_users: Models.Document[];
  $id: string;
};

export const Stats = ({
  inConstruction,
  savedUserIds,
  likedUserIds,
  liked_users,
  savedBy,
  $id,
}: StatsProps) => {
  const { user, isAuthenticated } = useUserContext();
  const likeList = liked_users?.map((user: Models.Document) => user?.$id);
  const savePostLength = savedBy?.length;

  const [likes, setLikes] = useState(likeList);

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const hasSaved = savedUserIds?.find((record: string) => record === user?.id);
  const hasLiked = likeList?.includes(user?.id);

  useEffect(() => {
    setIsSaved(hasSaved ? true : false);
    setIsLiked(hasLiked ? true : false);

    console.log({
      likes,
      hasLiked,
      hasSaved,
      likeList,
      savePostLength,
      savedUserIds,
    });
  }, [user]);

  // const [isLiked, setIsLiked] = useState<boolean | undefined>(false);
  // const [isSaved, setIsSaved] = useState<boolean | undefined>(false);

  const { trigger: triggerLike, isMutating: isLiking } = useLikeRoadmap();
  const { trigger: triggerSave, isMutating: isSaving } = useSaveRoadmap();
  const { trigger: deleteSave } = useDeleteSavedRoadmap();

  // const { mutate: likePost } = useLikePost();
  // const { mutate: savePost, isPending: savingPost } = useSavePost();
  //  const { mutate: deleteSavePost, isPending: deletingPost } =
  //  useDeleteSavedPost();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes: string[] = [...likes];
    const hasLiked = newLikes.includes(user.id);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== user.id);
    } else {
      newLikes.push(user.id);
    }
    setLikes(newLikes);
    triggerLike({ roadmapId: $id, updatedLikes: newLikes });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasSaved) {
      setIsSaved(false);
      deleteSave({ savedRecordId: $id });
    } else {
      triggerSave({ roadmapId: $id, userId: user.id });
      setIsSaved(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-2">
        <button
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition disabled:opacity-50"
          onClick={handleLike}
          disabled={inConstruction || isLiking}
        >
          {isLiked ? (
            <BsHeartFill size={20} className="text-red-800" />
          ) : (
            <Heart size={20} />
          )}
          <span>{likeList?.length}</span>
        </button>

        <button
          className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition disabled:opacity-50"
          onClick={handleSave}
          disabled={inConstruction || isSaving}
        >
          {isSaved ? (
            <BsBookmarkFill size={20} className="text-blue-800" />
          ) : (
            <Bookmark size={20} />
          )}
          <span>{savedBy?.length ?? 0}</span>
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>
      </div>

      {!inConstruction && (
        <div className="bg-gray-700 h-2 rounded-b-lg overflow-hidden">
          <div
            className="bg-green-500 h-full"
            style={{ width: "50%" }}
            title="Progress: 50%"
          ></div>
        </div>
      )}
    </div>
  );
};

// const [isLiked, setIsLiked] = useState<boolean | undefined>(false);
// const [isSaved, setIsSaved] = useState<boolean | undefined>(false);

// const { trigger: triggerLike, isMutating: isLiking } = useLikeRoadmap();
// const { trigger: triggerSave, isMutating: isSaving } = useSaveRoadmap();

// // Check states when user or arrays change
// useEffect(() => {
//   if (!userId) return;

//   setIsLiked(likedUserIds?.includes(userId));
//   setIsSaved(savedUserIds?.includes(userId));

//   console.log({
//     userId,

//     likedUserIds,
//     savedUserIds,
//     isLiked: likedUserIds?.includes(userId),
//     isSaved: savedUserIds?.includes(userId),
//   });
// }, [userId, likedUserIds, savedUserIds]);

// console.log(likedUserIds?.includes(userId || ""));

// // Handle Like Roadmaps
// const handleLike = async () => {
//   if (!isAuthenticated || !userId) {
//     return toast.error("You must be logged in to like!");
//   }

//   let updatedLikes: string[];

//   if (likedUserIds?.includes(userId)) {
//     updatedLikes = likedUserIds.filter((uid) => uid !== userId);
//     setIsLiked(false);
//   } else {
//     updatedLikes = [likedUserIds, userId];
//     setIsLiked(true);
//   }

//   setLikesArray(updatedLikes);
//   await triggerLike({ roadmapId: $id, updatedLikes });
// };

// // Handle Save Roadmaps
// const handleSave = async () => {
//   if (!isAuthenticated || !userId) {
//     return toast.error("You must be logged in to save!");
//   }

//   await triggerSave({ roadmapId: $id, userId });

//   setIsSaved(!isSaved);
// };
