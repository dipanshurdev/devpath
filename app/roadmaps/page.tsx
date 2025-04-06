"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import RoadmapCard from "@/components/roadmaps/RoadmapCard";
import { Models } from "appwrite";
import SearchBar from "@/components/roadmaps/SearchBar";
import { useGetRoadmaps } from "@/lib/hooks/swr-hooks";
import Loader from "@/components/Loader";

export default function RoadmapsPage() {
  const { data: roadmaps, isLoading } = useGetRoadmaps();
  const allRoadmaps: Models.Document[] | undefined = roadmaps?.documents;
  const [searchTerm, setSearchTerm] = useState<string>("");

  // useEffect(() => {
  //   const fetchRoadmaps = async () => {
  //     const data = await roadmaps;
  //     setAllRoadmaps(data?.documents);
  //   };
  //   fetchRoadmaps();
  // }, []);

  const filteredRoadmaps = searchTerm
    ? allRoadmaps?.filter(
        (roadmap) =>
          roadmap?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          roadmap?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allRoadmaps;

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-4 h-screen flex-col m-4 gap-2">
        <Loader loading={isLoading} />
      </div>
    );
  }

  return (
    <section className="w-full px-4 py-12 mt-10 mb-16" id="roadmaps">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full py-4 mt-3 mb-10"
      >
        <h1 className="text-4xl font-bold text-primaryWhite mb-4">
          Developer Roadmaps
        </h1>
        <p className="text-xl text-light dark:text-gray-300 max-w-2xl mx-auto">
          Explore our curated learning paths to master various aspects of
          software development.
        </p>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </motion.div>

      <section className="w-full mt-16">
        <h1 className="text-4xl font-bold text-primaryWhite">
          Role Based Roadmaps
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-8">
          {filteredRoadmaps && filteredRoadmaps.length > 0 ? (
            filteredRoadmaps.map((role) => (
              <RoadmapCard key={role.roadmap_id} {...role} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8 col-span-3">
              No roadmaps found. Try adjusting your search.
            </p>
          )}
        </div>
      </section>

      {/* <section className="w-full mt-16"> */}
      {/* <h1 className="text-4xl font-bold  text-primaryWhite "> */}
      {/* Language Based Roadmaps */}
      {/* </h1> */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 "> */}
      {/* {Lang.map((lang) => (
            <RoadmapCard key={lang.id} {...lang} />
          ))} */}
      {/* </div> */}
      {/* </section> */}

      {/* {filteredRoadmaps.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No roadmaps found. Try adjusting your search.
        </p>
      )} */}
    </section>
  );
}
