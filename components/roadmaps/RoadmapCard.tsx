import Link from "next/link";
import {
  ExternalLink,
  Clock,
  Construction,
  Heart,
  Bookmark,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BsBookmarkFill } from "react-icons/bs";
import { Models } from "appwrite";
import { motion } from "framer-motion";
import { useLikeRoadmap, useSaveRoadmap } from "@/lib/hooks/swr-hooks";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function RoadmapCard({
  inConstruction,
  roadmap_id,
  title,
  difficulty,
  estimated_time_to_finish,
  liked_users = [],
  $id,
  savedBy = [],
}: Models.Document) {
  const { user, isAuthenticated } = useUserContext(); //TODO chache it
  const userId = user?.id;

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesArray, setLikesArray] = useState<string[]>(liked_users);

  const { trigger: triggerLike, isMutating: isLiking } = useLikeRoadmap();
  const { trigger: triggerSave, isMutating: isSaving } = useSaveRoadmap();

  // Initialize like/save states safely when user is available
  useEffect(() => {
    if (!userId) return;

    setIsLiked(likesArray.includes(userId));
    setIsSaved(savedBy.includes(userId));
  }, [userId, likesArray, savedBy]);

  // Handle Like Roadmaps
  const handleLike = async () => {
    if (!isAuthenticated || !userId) {
      return toast.error("You must be logged in to like!");
    }

    let updatedLikes: string[];

    if (likesArray.includes(userId)) {
      updatedLikes = likesArray.filter((uid) => uid !== userId);
      setIsLiked(false);
    } else {
      updatedLikes = [...likesArray, userId];
      setIsLiked(true);
    }

    setLikesArray(updatedLikes);
    await triggerLike({ roadmapId: $id, updatedLikes });
  };

  // Handle Save Roadmaps
  const handleSave = async () => {
    if (!isAuthenticated || !userId) {
      return toast.error("You must be logged in to save!");
    }

    await triggerSave({ roadmapId: $id, userId });

    setIsSaved((prev) => !prev); // toggle saved state
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-darkLight rounded-2xl shadow-md overflow-hidden 
      transition-all duration-300 ${
        inConstruction ? "opacity-80 cursor-not-allowed" : "cursor-default"
      }`}
    >
      {/* Card Content */}
      <div className="p-6 flex flex-col gap-4">
        {/* Title & Difficulty Badge */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {difficulty && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full shadow-md 
              ${
                difficulty === "Advanced"
                  ? "bg-yellow-500 text-black"
                  : difficulty === "Intermediate"
                  ? "bg-green-500 text-white"
                  : difficulty === "Expert"
                  ? "bg-red-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {difficulty}
            </span>
          )}
        </div>

        {/* Estimated Time */}
        <div className="flex items-center text-gray-400 text-sm">
          <Clock size={16} className="mr-2" />
          <span>{estimated_time_to_finish}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          {inConstruction ? (
            <span className="flex items-center gap-2 text-sm bg-red-600 text-white px-3 py-1 rounded-full">
              <Construction size={16} />
              In Construction
            </span>
          ) : (
            <Link
              href={`/roadmaps/${roadmap_id}`}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              <span>View Roadmap</span>
              <ExternalLink size={16} />
            </Link>
          )}
        </div>

        {/* Like & Save Buttons */}
        <div className="flex justify-between items-center mt-2">
          <button
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition disabled:opacity-50"
            onClick={handleLike}
            disabled={inConstruction || isLiking}
          >
            {isLiked ? (
              <Heart size={20} className="text-red-500" />
            ) : (
              <Heart size={20} />
            )}
            <span>{likesArray?.length}</span>
          </button>

          <button
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition disabled:opacity-50"
            onClick={handleSave}
            disabled={inConstruction || isSaving}
          >
            {isSaved ? (
              <BsBookmarkFill size={20} className="text-blue-500" />
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
    </motion.div>
  );
}
