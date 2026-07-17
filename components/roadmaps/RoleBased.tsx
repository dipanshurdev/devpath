"use client";

import RoadmapCard from "./RoadmapCard";
import { Roadmap } from "@/lib/hooks/use-roadmaps";

interface RoleBasedProps {
  filteredRoadmaps: Roadmap[];
}

export default function RoleBased({ filteredRoadmaps = [] }: RoleBasedProps) {
  const roleRoadmaps = filteredRoadmaps.filter((r) => r.type === "role");
  if (roleRoadmaps.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
      {roleRoadmaps.map((roadmap) => (
        <RoadmapCard key={roadmap.id} {...roadmap} />
      ))}
    </div>
  );
}
