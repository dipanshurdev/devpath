import React from "react";
import { LuBookMarked } from "react-icons/lu";

type Props = {
  id: number;
  name: string;
  // s: object;
};

const RoadmapDiv = ({ id, name }: Props) => {
  console.log(id, name);
  return (
    <div className="px-6 py-3 my-2 bg-neutral-800 rounded-lg flex items-center justify-between ">
      <span className="text-lg text-blue-100 capitalize">{name}</span>
      <span className="flex-grow justify-end flex">
        <LuBookMarked />
      </span>
    </div>
  );
};

export default RoadmapDiv;
