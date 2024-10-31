import Link from "next/link";
import React from "react";
import { CiBookmark } from "react-icons/ci";

type Props = {
  id: string;
  name: string;
};

const RoadmapDiv = ({ id, name }: Props) => {
  return (
    <Link
      href={`/${id}`}
      className="px-6 py-3 my-2 w-full bg-darkLight rounded-lg flex items-center justify-between "
    >
      <span className="text-lg text-primaryWhite capitalize">{name}</span>
      <span className="flex-grow justify-end flex">
        <CiBookmark />
      </span>
    </Link>
  );
};

export default RoadmapDiv;
