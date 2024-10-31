import React from "react";
import Image from "next/image";
import DevPath from "../../assets/icons/path.svg";

type Props = {
  title: string;
};

const Icon = ({ title }: Props) => {
  return (
    <div className="inline-block border border-dotted px-3 py-2 rounded-lg">
      <div className="flex flex-row justify-center items-center gap-2">
        <div className="w-full">
          <Image
            src={DevPath}
            alt="DevPath"
            width={20}
            height={20}
            //   className="stroke-blue-100"
          />
        </div>
        <span className="text-lg font-bold">{title}</span>
      </div>
    </div>
  );
};

export default Icon;
