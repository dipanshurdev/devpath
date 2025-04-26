import Link from "next/link";
import { ExternalLink, Clock, Construction } from "lucide-react";

import { Models } from "appwrite";
import { motion } from "framer-motion";
import { Stats } from "./Stats";

export default function RoadmapCard({
  inConstruction,
  roadmap_id,
  title,
  difficulty,
  estimated_time_to_finish,
  liked_users = [],
  $id,
  savedBy = [],
  nodes = [],
  completedNodeIds = [],
}: Models.Document) {
  const totalNodes = nodes?.length || 0;
  const completedCount = completedNodeIds.length;
  const progressPercent =
    totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  const savedUserIds = savedBy.map((item: Models.Document) => item.user?.$id);
  const likedUserIds = liked_users.map((item: Models.Document) => item.$id);

  console.log({
    nodes,
    completedNodeIds,
    completedCount,
    totalNodes,
    progressPercent,
  });

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
              href={`/roadmaps/roadmap/${roadmap_id}`}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              <span>View Roadmap</span>
              <ExternalLink size={16} />
            </Link>
          )}
        </div>
        <Stats
          inConstruction={inConstruction}
          savedUserIds={savedUserIds}
          likedUserIds={likedUserIds}
          liked_users={liked_users}
          savedBy={savedBy}
          $id={$id}
          progressPercent={progressPercent}
        />
        {/* Like & Save Buttons */}
      </div>
    </motion.div>
  );
}
