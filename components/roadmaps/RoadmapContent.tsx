import React from "react";
import RoadmapDiv from "./RoadmapDiv";
import { Models } from "appwrite";

type Props = {
  roadmap: Models.Document;
};

const RoadmapContent = ({ roadmap }: Props) => {
  const { title } = roadmap;
  return (
    <div className="flex items-center justify-center w-full flex-col h-full mb-4">
      <div className="grid grid-cols-4 w-full gap-4 items-center justify-center">
        <RoadmapDiv title={title} />
      </div>
    </div>
  );
};
export default RoadmapContent;
