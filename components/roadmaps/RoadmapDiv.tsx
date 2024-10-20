import React from "react";
import { CiBookmark } from "react-icons/ci";

type Props = {
  id: number;
  name: string;
  // s: object;
};

const RoadmapDiv = ({ id, name }: Props) => {
  return (
    <div className="px-6 py-3 my-2 bg-darkLight rounded-lg flex items-center justify-between ">
      <span className="text-lg text-primaryWhite capitalize">{name}</span>
      <span className="flex-grow justify-end flex">
        <CiBookmark />
      </span>
    </div>
  );
};

export default RoadmapDiv;
