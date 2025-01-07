import { Models } from "appwrite";
import { Button } from "../ui/button";
import { useState } from "react";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";

export default function RoadmapInfo({ roadmap }: { roadmap: Models.Document }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold mb-2 inline-block text-transparent bg-clip-text bg-gradient-to-r  from-primaryBlue to-primaryWhite">
        {roadmap.title}
      </h1>

      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {!roadmap?.title || isExpanded || roadmap?.description?.length <= 150
          ? roadmap?.description
          : `${roadmap?.description?.slice(0, 120)}...`}
      </p>
      {roadmap?.description.length > 100 && roadmap?.title && (
        <Button
          variant="dropDown"
          className="px-0  text-sm font-medium text-primaryBlue  hover:text-blue-600 "
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <span className="flex w-full items-center justify-between gap-2 text-base">
              Show Less <CircleChevronUp />
            </span>
          ) : (
            <span className="flex w-full items-center justify-between gap-2 text-base">
              Show More <CircleChevronDown />
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
