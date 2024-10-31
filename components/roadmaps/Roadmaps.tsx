"use client";

import React from "react";
import { Roles } from "@/lib/randomStack";
// import { getRoadmaps } from "@/lib/appwrite/api";
// import { Models } from "appwrite";
import RoadmapDiv from "./RoadmapDiv";

export const Roadmaps = () => {
  return (
    <section className="w-full px-4 mx-4 py-8 mb-6 ">
      <div className="text-center w-full py-4 mt-3 mb-6">
        <h3 className="text-2xl font-semibold ">Role Based Roadmaps</h3>
        <div className="h-[0.5px] my-2 w-full bg-primaryWhite" />
      </div>
      <div className="grid grid-cols-4 w-full gap-4 items-center justify-center">
        {Roles?.map((roadmap) => (
          <RoadmapDiv key={roadmap.id} id={roadmap.id} name={roadmap.name} />
        ))}
      </div>
    </section>
  );
};

export default Roadmaps;
