import React from "react";
import { EdgeProps, getBezierPath, MarkerType } from "reactflow";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeDasharray: "2,2",
          animation: "dashdraw 30s linear infinite",
          stroke: "#e5e7eb",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        style={{
          ...style,
          strokeWidth: 6,
          strokeLinecap: "round",
          fill: "none",
          stroke: "#1D4ED8",
        }}
        d={edgePath}
      />
    </>
  );
}
