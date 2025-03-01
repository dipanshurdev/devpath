"use client";

import { useState, useEffect } from "react";
import { Roles } from "@/lib/randomStack"; // Assuming this is the correct path
import { useParams } from "next/navigation";
import Loader from "../Loader";
import RoadmapCard from "./RoadmapCard";

export default function SimilarRoadmaps() {
  const [similarRoadmaps, setSimilarRoadmaps] = useState(Roles); // Fix: Use correct shape
  const [isLoading, setIsLoading] = useState(true);
  const { roadmapId } = useParams(); // Fix: Extract directly

  useEffect(() => {
    if (!roadmapId) return;

    const getSimilarRoadmaps = (currentId: string) => {
      // Find the current roadmap
      const currentRoadmap = Roles.find((roadmap) => roadmap.id === currentId);

      if (!currentRoadmap) return [];

      // Filter similar roadmaps based on difficulty
      const similarList = Roles.filter(
        (roadmap) =>
          roadmap.id !== currentId &&
          roadmap.difficulty === currentRoadmap.difficulty
      ).slice(0, 3);

      return similarList;
    };

    try {
      setIsLoading(true);
      const roadmaps = getSimilarRoadmaps(roadmapId as string);
      setSimilarRoadmaps(roadmaps);
    } catch (err) {
      console.error("Failed to fetch similar roadmaps:", err);
    } finally {
      setIsLoading(false);
    }
  }, [roadmapId]);

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  if (!similarRoadmaps.length) {
    return <div className="text-center">No similar roadmaps found</div>;
  }

  return (
    <div className="mt-20 mb-32">
      <h2 className="text-3xl font-bold  dark:text-white mb-8">
        Similar Roadmaps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {similarRoadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.id} {...roadmap} />
        ))}
      </div>
    </div>
  );
}
