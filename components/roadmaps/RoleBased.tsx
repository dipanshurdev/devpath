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
    <section className="py-10">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-1 mb-8"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Role-Based Roadmaps
          </h2>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed ml-0.5">
          Structured paths for your target job role.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
