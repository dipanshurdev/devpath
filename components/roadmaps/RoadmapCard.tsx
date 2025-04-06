import Link from "next/link";
import {
  ExternalLink,
  Clock,
  Construction,
  Heart,
  Bookmark,
} from "lucide-react";
import { useState } from "react";
import { BsBookmarkFill } from "react-icons/bs";
import { Models } from "appwrite";
import { motion } from "framer-motion";
import { useLikeRoadmap, useSaveRoadmap } from "@/lib/hooks/swr-hooks";
import { useUserContext } from "@/context/AuthContext";

export default function RoadmapCard({
  inConstruction,
  roadmap_id,
  title,
  difficulty,
  estimated_time_to_finish,
  liked_roadmap,
  $id,
  savedBy,
}: Models.Document) {
  const { user } = useUserContext(); //TODO chache it
  const { id } = user;
  const [isSaved, setIsSaved] = useState(
    // savedBy.incluedes(user?.id)
    savedBy?.includes(id) || false
  );
  const [isLiked, setIsLiked] = useState(
    // savedBy.incluedes(user?.id)
    liked_roadmap?.includes(id) || false
  );
  // console.log(savedBy);

  const [likesArray, setLikesArray] = useState<string[]>(liked_roadmap || []);

  const { trigger: triggerLike } = useLikeRoadmap();
  const { trigger: triggerSave } = useSaveRoadmap();

  // Handle Like Roadmaps
  const handleLike = async () => {
    let updatedLikes;
    if (likesArray.includes(id)) {
      updatedLikes = likesArray.filter((uid: string) => uid !== id);
    } else {
      updatedLikes = [...likesArray, id];
      setIsLiked(true);
    }

    setLikesArray(updatedLikes);
    await triggerLike({ roadmapId: $id, updatedLikes });
  };

  // Handle Save Roadmaps
  const handleSave = async () => {
    if (!user) return alert("You must be logged in to save!");

    await triggerSave({ roadmapId: $id, userId: id });
    setIsSaved(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-darkLight rounded-2xl shadow-md overflow-hidden 
      transition-all duration-300 ${
        inConstruction ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
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
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition"
            onClick={handleLike}
          >
            {isLiked ? (
              <Heart size={20} className="text-red-500" />
            ) : (
              <Heart size={20} />
            )}
            <span>{likesArray?.length}</span>

            {/* Likes count here if needed */}
          </button>

          <button
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
            onClick={handleSave}
          >
            {isSaved ? (
              <BsBookmarkFill size={20} className="text-blue-500" />
            ) : (
              <Bookmark size={20} />
            )}
            <span>{savedBy?.length}</span>
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
