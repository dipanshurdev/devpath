"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { Lang, skills, projects } from "@/lib/randomStack";
import RoadmapContent from "./RoadmapContent";
import { getRoadmaps } from "@/lib/appwrite/api";
import { Models } from "appwrite";

export const Roadmaps = () => {
  const [roadmapsData, setRoadmapsData] = useState<
    Models.Document[] | undefined
  >();

  // roadmap_id
  // :
  // "frontend"
  // title
  // :
  // "Frontend Roadmap"
  // description
  // :
  // "Roadmap for Frontend Developers"
  // $id
  // :
  // "671fd87d0002abbed856"
  // $createdAt
  // :
  // "2024-10-28T18:31:25.270+00:00"
  // $updatedAt
  // :
  // "2024-10-28T18:31:25.270+00:00"

  // $permissions
  // :
  // []
  // creator
  // :
  // null

  // savedRoadmaps
  // :
  // []

  // nodes
  // :
  // [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
  // $databaseId
  // :
  // "6713dc29002d5e960b6c"
  // $collectionId
  // :

  useEffect(() => {
    async function getStaticProps() {
      const fetchRoadmaps = await getRoadmaps();
      setRoadmapsData(fetchRoadmaps?.documents);
    }
    getStaticProps();
  }, []);

  return (
    <section className="w-full px-4 mx-4 py-8 mb-6 ">
      <div className="text-center w-full py-4 mt-3 mb-6">
        <h3 className="text-2xl font-semibold ">Skill Based</h3>
        <div className="h-[0.5px] my-2 w-full bg-primaryWhite" />
      </div>
      {roadmapsData?.map((roadmap) => (
        <RoadmapContent roadmap={roadmap} />
      ))}
    </section>
  );
};

export default Roadmaps;
