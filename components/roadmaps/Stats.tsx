import { useSession } from "next-auth/react";
import { Bookmark, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsBookmarkFill, BsHeartFill } from "react-icons/bs";
import toast from "react-hot-toast";

type StatsProps = {
  inConstruction?: boolean;
  userId?: string;
  savedUserIds?: string[];
  likedUserIds?: string[];
  savedBy: string[];
  liked_users: any[];
  $id: string;
  progressPercent?: number;
};

export const Stats = ({
  inConstruction,
  savedUserIds,
  likedUserIds,
  liked_users,
  savedBy,
  $id,
  progressPercent,
}: StatsProps) => {
  const { data: session } = useSession();
  const likeList = liked_users?.map((user: any) => user?.id || user?.$id) || [];
  
  const [likes, setLikes] = useState(likeList);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasSaved = savedUserIds?.find((record: string) => record === session?.user?.id);
  const hasLiked = likeList?.includes(session?.user?.id);

  useEffect(() => {
    setIsSaved(hasSaved ? true : false);
    setIsLiked(hasLiked ? true : false);
  }, [session?.user?.id, hasSaved, hasLiked]);

  // const { mutate: likePost } = useLikePost();
  // const { mutate: savePost, isPending: savingPost } = useSavePost();
  //  const { mutate: deleteSavePost, isPending: deletingPost } =
  //  useDeleteSavedPost();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session) {
      toast.error("Please login to like roadmaps");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement like API call
      toast.success(isLiked ? "Unliked!" : "Liked!");
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error("Failed to like roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) {
      toast.error("Please login to save roadmaps");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement save API call
      toast.success(isSaved ? "Removed from saved!" : "Saved!");
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error("Failed to save roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-2">
        <button
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition disabled:opacity-50"
          onClick={handleLike}
          disabled={inConstruction || isLoading}
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
          disabled={inConstruction || isLoading}
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
            style={{ width: `${progressPercent}%` }}
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
