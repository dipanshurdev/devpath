import Link from "next/link";
import React from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { LuConstruction } from "react-icons/lu";

type Props = {
  id: string;
  name: string;
  inConstruction: boolean;
};

const RoadmapDiv = ({ id, name, inConstruction }: Props) => {
  return (
    <Link
      href={`/${id}`}
      className={` ${
        inConstruction ? "cursor-not-allowed" : "cursor-pointer"
      } px-6 py-3 my-2 w-full bg-darkLight rounded-lg flex items-center justify-between `}
    >
      <span className="text-lg text-primaryWhite capitalize">{name}</span>
      <span className="flex-grow justify-end flex">
        {inConstruction ? <LuConstruction /> : <CiLocationArrow1 />}
      </span>
    </Link>
  );
};

export default RoadmapDiv;
