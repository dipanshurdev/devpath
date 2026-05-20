"use client";

import { motion } from "framer-motion";
import RoadmapCard from "./RoadmapCard";
import { Briefcase } from "lucide-react";
import { Roadmap } from "@/lib/hooks/use-roadmaps";

interface RoleBasedProps {
  filteredRoadmaps: Roadmap[];
}

export default function RoleBased({ filteredRoadmaps = [] }: RoleBasedProps) {
  const roleBasedRoadmaps = filteredRoadmaps?.filter(
    (roadmap) => roadmap.type === "role",
  );

  if (!roleBasedRoadmaps || roleBasedRoadmaps.length === 0) {
    return null;
  }

  return (
    <section className="mb-16 relative">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1.5 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Briefcase className="w-5 h-5 text-primary dark:text-blue-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Role based
          </h2>
        </div>
        <p className="text-muted-foreground text-base leading-relaxed">
          Skills for your target job role.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roleBasedRoadmaps.map((roadmap, index) => (
          <motion.div
            key={roadmap.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <RoadmapCard {...roadmap} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
