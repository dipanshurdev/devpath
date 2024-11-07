"use client";

import React from "react";
// import { getRoadmaps } from "@/lib/appwrite/api";
// import { Models } from "appwrite";
import RoadmapDiv from "./RoadmapDiv";

type Props = {
  title: string;
  data?: any;
  inBuilding?: boolean;
};

export const Roadmaps = ({ title, data, inBuilding }: Props) => {
  return (
    <section className="w-full px-4 mx-4 py-8 mt-10 mb-16">
      <div className="text-center w-full py-4 mt-3 mb-6 border-b border-primaryDarkLight">
        <h3 className="text-3xl font-bold ">{title} Roadmaps</h3>
        {/* <div className="h-[0.5px] my-2 w-full bg-primaryWhite" /> */}
      </div>
      <div className="grid grid-cols-4 max-sm:grid-cols-3   w-full gap-4 items-center justify-center">
        {inBuilding && (
          <h4 className="text-xl text-center text-primaryWhite">
            Under Development
          </h4>
        )}
        {!inBuilding &&
          data?.map((roadmap: any) => (
            <RoadmapDiv
              key={roadmap.id}
              id={roadmap.id}
              inConstruction={roadmap.inConstruction}
              name={roadmap.name}
            />
          ))}
      </div>
    </section>
  );
};

export default Roadmaps;
