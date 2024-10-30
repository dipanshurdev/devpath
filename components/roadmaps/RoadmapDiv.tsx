import React from "react";
import { CiBookmark } from "react-icons/ci";

type Props = {
  title: string;
  // s: object;
};

const RoadmapDiv = ({ title }: Props) => {
  return (
    <div className="px-6 py-3 my-2 bg-darkLight rounded-lg flex items-center justify-between ">
      <span className="text-lg text-primaryWhite capitalize">{title}</span>
      <span className="flex-grow justify-end flex">
        <CiBookmark />
      </span>
    </div>
  );
};

export default RoadmapDiv;
