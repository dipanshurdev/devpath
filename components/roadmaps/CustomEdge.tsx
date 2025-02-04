import { type EdgeProps, getBezierPath } from "reactflow";

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
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
          strokeWidth: 2,
          stroke: "#3b82f6",
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <path
        id={`${id}-bg`}
        style={{
          ...style,
          strokeWidth: 6,
          stroke: "#e5e7eb",
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
    </>
  );
}

export default CustomEdge;
