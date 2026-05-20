"use client";

import { type EdgeProps, getSmoothStepPath, Position } from "reactflow";

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
}: EdgeProps) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePosition ?? Position.Bottom,
    targetX,
    targetY,
    targetPosition: targetPosition ?? Position.Top,
    borderRadius: 12,
    offset: 20,
  });

  const completed = (data as { completed?: boolean })?.completed ?? false;

  return (
    <>
      <path
        id={id}
        d={path}
        style={{
          ...style,
          strokeWidth: completed ? 3 : 2,
          stroke: completed
            ? "hsl(var(--primary))"
            : "hsl(var(--muted-foreground) / 0.35)",
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        className="react-flow__edge-path transition-all duration-300"
      />
      {!completed && (
        <path
          id={`${id}-animated`}
          d={path}
          style={{
            fill: "none",
            stroke: "hsl(var(--primary) / 0.4)",
            strokeWidth: 2,
            strokeDasharray: "8 8",
            strokeDashoffset: 0,
            strokeLinecap: "round",
            animation: "dash 0.8s linear infinite",
          }}
          className="react-flow__edge-path"
        />
      )}
    </>
  );
}

export default CustomEdge;
