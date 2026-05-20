"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loader from "../Loader";
import RoadmapCard from "./RoadmapCard";
import { useRoadmaps } from "@/lib/hooks/use-roadmaps";

export default function SimilarRoadmaps() {
  const { data: roadmaps, isLoading: roadmapsLoading } = useRoadmaps();
  const [similarRoadmaps, setSimilarRoadmaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const roadmapId = params?.roadmapId as string;

  useEffect(() => {
    if (!roadmapId || !roadmaps) return;

    const getSimilarRoadmaps = (currentId: string) => {
      const currentRoadmap = roadmaps.find(
        (r) => r.roadmapId === currentId
      );
      if (!currentRoadmap) return [];

      return roadmaps
        .filter(
          (r) =>
            r.roadmapId !== currentId &&
            r.difficulty === currentRoadmap.difficulty
        )
        .slice(0, 3);
    };

    try {
      setIsLoading(true);
      const similar = getSimilarRoadmaps(roadmapId);
      setSimilarRoadmaps(similar);
    } catch (err) {
      console.error("Failed to fetch similar roadmaps:", err);
    } finally {
      setIsLoading(false);
    }
  }, [roadmapId, roadmaps]);

  if (isLoading || roadmapsLoading) {
    return <Loader loading={true} />;
  }

  if (!similarRoadmaps.length) {
    return (
      <div className="text-center text-gray-400">No similar roadmaps found</div>
    );
  }

  return (
    <div className="mt-20 mb-32">
      <h2 className="text-3xl font-bold dark:text-white mb-8">
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
