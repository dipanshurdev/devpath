import React from "react";
import { BaseEdge, EdgeProps, getSmoothStepPath } from "reactflow";

const AnimatedEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 3,
          stroke: "url(#gradient)",
        }}
      />
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 3,
          stroke: "url(#gradient)",
          strokeDasharray: 10,
          strokeDashoffset: 0,
          animation: "flow 30s linear infinite",
        }}
      />
    </>
  );
};

export default AnimatedEdge;

//-------------------------------------------

// const AnimatedEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   style = {},
//   markerEnd,
// }: EdgeProps) => {
//   // Use a path to create a smooth curve
//   const edgePath = `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${
//     targetX - 50
//   },${targetY} ${targetX},${targetY}`;

//   return (
//     <g className="animated-edge">
//       <path
//         id={id}
//         d={edgePath}
//         style={{ ...style, stroke: "#1D4ED8", strokeWidth: 2 }}
//         markerEnd={markerEnd}
//         className="react-flow__edge-path"
//       />
//       <path
//         d={edgePath}
//         className="animated-path"
//         style={{
//           fill: "none",
//           stroke: "#e5e7eb", //Later => #1D4ED8
//           strokeWidth: 3,
//           strokeDasharray: "4,4", // Dotted line
//           animation: "dash 0.2s linear infinite", // Animation for flow effect
//         }}
//       />
//     </g>
//   );
// };

// export default AnimatedEdge;
