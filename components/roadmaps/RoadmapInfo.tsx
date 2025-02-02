// import { Models } from "appwrite";
// import { Button } from "../ui/button";
// import { useState } from "react";
// import { CircleChevronDown, CircleChevronUp } from "lucide-react";

// export default function RoadmapInfo({ roadmap }: { roadmap: Models.Document }) {
//   const [isExpanded, setIsExpanded] = useState<boolean>(false);
//   return (
//     <div className="mb-8 text-center">
//       <h1 className="text-4xl font-bold mb-2 inline-block text-transparent bg-clip-text bg-gradient-to-r  from-primaryBlue to-primaryWhite">
//         {roadmap.title}
//       </h1>

//       <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//         {!roadmap?.title || isExpanded || roadmap?.description?.length <= 150
//           ? roadmap?.description
//           : `${roadmap?.description?.slice(0, 120)}...`}
//       </p>
//       {roadmap?.description.length > 100 && roadmap?.title && (
//         <Button
//           variant="dropDown"
//           className="px-0  text-sm font-medium text-primaryBlue  hover:text-blue-600 "
//           onClick={() => setIsExpanded(!isExpanded)}
//         >
//           {isExpanded ? (
//             <span className="flex w-full items-center justify-between gap-2 text-base">
//               Show Less <CircleChevronUp />
//             </span>
//           ) : (
//             <span className="flex w-full items-center justify-between gap-2 text-base">
//               Show More <CircleChevronDown />
//             </span>
//           )}
//         </Button>
//       )}
//     </div>
//   );
// }

// ---------------------v0--------------------
"use client";

import type { Models } from "appwrite";
import { Button } from "../ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { motion } from "framer-motion";
// import { Progress } from "../ui/progress";

interface RoadmapInfoProps {
  roadmap: Models.Document;
  completedNodeIds: string[];
}

export default function RoadmapInfo({
  roadmap,
}: // completedNodeIds,
RoadmapInfoProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const shouldShowToggle = roadmap?.description?.length > 150;
  const displayDescription =
    isExpanded || !shouldShowToggle
      ? roadmap?.description
      : `${roadmap?.description?.slice(0, 150)}...`;

  const shareRoadmap = () => {
    if (navigator.share) {
      navigator
        .share({
          title: roadmap.title,
          text: roadmap.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch(console.error);
    }
  };

  // const progress = (completedNodeIds.length / roadmap.nodes.length) * 100;

  return (
    <div className=" rounded-lg p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold text-primaryWhite">
          {roadmap.title}
        </h1>
        <Button
          onClick={shareRoadmap}
          variant="default"
          size="sm"
          className=" bg-darkLight text-primaryWhite hover:bg-darkLight/80"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : "80px" }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-light dark:text-gray-300 mb-2">
          {displayDescription}
        </p>
      </motion.div>
      {shouldShowToggle && (
        <Button
          variant="ghost"
          className="mt-2 text-sm font-medium text-primaryBlue hover:text-primaryBlue/80"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <span className="flex items-center gap-2">
              Show Less <ChevronUp className="w-4 h-4" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Show More <ChevronDown className="w-4 h-4" />
            </span>
          )}
        </Button>
      )}

      {/* TODO */}
      {/* <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Progress: {Math.round(progress)}%
        </p>
        <Progress value={progress} className="w-full bg-primaryWhite" />
      </div> */}
    </div>
  );
}
