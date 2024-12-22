"use client";
// import Roadmaps from "@/components/roadmaps/Roadmaps";
import { Roles } from "@/lib/randomStack";
import React from "react";
// import { useState } from "react";
import { motion } from "framer-motion";
import RoadmapCard from "@/components/roadmaps/RoadmapCard";
// import SearchBar from "@/components/roadmaps/SearchBar";
// import { getAllRoadmaps } from "@/lib/api";

export default function RoadmapsPage() {
  //   const allRoadmaps = getAllRoadmaps();
  //   const filteredRoadmaps = allRoadmaps.filter(
  //     (roadmap) =>
  //       roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       roadmap.description.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  return (
    <section className="w-full px-4 py-12 mt-10 mb-16" id="roadmaps">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full py-4 mt-3 mb-10"
      >
        <h1 className="text-4xl font-bold  text-primaryWhite mb-4">
          Developer Roadmaps
        </h1>
        <p className="text-xl text-light dark:text-gray-300 max-w-2xl mx-auto">
          Explore our curated learning paths to master various aspects of
          software development.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Roles.map((role) => (
          <RoadmapCard key={role.id} {...role} />
        ))}

        {/* {filteredRoadmaps.map((roadmap, index) => (
          <motion.div
            key={roadmap.roadmap_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <RoadmapCard roadmap={roadmap} />
          </motion.div>
        ))} */}
      </div>

      {/* {filteredRoadmaps.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No roadmaps found. Try adjusting your search.
        </p>
      )} */}
    </section>
  );
}
