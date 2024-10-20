import React from "react";
import RoadmapDiv from "./RoadmapDiv";

type Props = {
  content: Array<object>;
  title: string;
};

const RoadmapContent = ({ content, title }: Props) => {
  return (
    <div className="flex items-center justify-center w-full flex-col h-full mb-4">
      <div className="text-center w-full py-4 mt-3 mb-6">
        <h3 className="text-2xl font-semibold ">{title}</h3>
        <div className="h-[0.5px] my-2 w-full bg-primaryWhite" />
      </div>

      <div className="grid grid-cols-4 w-full gap-4 items-center justify-center">
        {content?.map((s: any) => {
          return <RoadmapDiv key={s.id} name={s.name} id={s.id} />;
        })}
      </div>
    </div>
  );
};
export default RoadmapContent;
