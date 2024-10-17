import React from "react";
import { Lang, skills, projects } from "@/lib/randomStack";
import RoadmapContent from "./RoadmapContent";

export const Roadmaps = () => {
  return (
    <section className="w-full px-4 mx-4 py-8 mb-6 ">
      <RoadmapContent title="Role Based Roadmaps" content={skills} />
      <RoadmapContent title="Skill Based Roadmaps" content={Lang} />
      <RoadmapContent title="Project Ideas" content={projects} />
    </section>
  );
};

export default Roadmaps;
