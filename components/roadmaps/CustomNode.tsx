// import { Models } from "appwrite";
// import { Handle, Position } from "reactflow";

// export default function CustomNode({ data }: { data: Models.Document }) {
//   return (
//     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-4 border-gray-300 dark:border-gray-600 w-60 h-30 flex flex-col justify-center items-center transition-transform hover:scale-110">
//       <Handle type="target" position={Position.Top} className="w-3 h-3" />
//       <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white text-center">
//         {data.title}
//       </h3>
//       <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
//         {data.resources.length} Resources
//       </span>
//       <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
//     </div>
//   );
// }

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const CustomNode = ({ data }: NodeProps) => {
  return (
    <div className="px-8 py-4 shadow-lg rounded-lg bg-primaryWhite border-2 border-primaryBlue transition-all duration-300 hover:scale-105">
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-primaryBlue"
      />
      <div className="flex items-center">
        <div className="text-lg font-bold text-blue-900">{data.title}</div>
        {/* <div className="text-sm text-primaryDarkLight">
            {data.description.length > 50
              ? `${data.description.slice(0, 50)}...`
              : data.description}

          </div> */}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-primaryBlue"
      />
    </div>
  );
};

export default memo(CustomNode);
