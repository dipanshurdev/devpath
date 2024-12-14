import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const RoadmapNode = ({ data }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-primaryWhite border-2 border-primaryBlue transition-all duration-300 hover:scale-105">
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-primaryBlue"
      />
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 text-2xl">
          {data.icon}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-blue-900">{data.label}</div>
          <div className="text-sm text-primaryDarkLight">
            {data.description}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-primaryBlue"
      />
    </div>
  );
};

export default memo(RoadmapNode);
