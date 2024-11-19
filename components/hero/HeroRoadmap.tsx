"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, {
  //   Background,
  //   Controls,
  Edge,
  EdgeProps,
  Node,
  //   Position,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "You" },
    position: { x: 0, y: -500 },
    type: "default",
  },
  {
    id: "2",
    data: { label: "Frontend" },
    position: { x: 200, y: -200 },
    type: "default",
  },
  {
    id: "3",
    data: { label: "Backend" },
    position: { x: 400, y: -400 },
    type: "default",
  },
  {
    id: "4",
    data: { label: "Fullstack" },
    position: { x: 600, y: 0 },
    type: "default",
  },
  {
    id: "5",
    data: { label: "More..." },
    position: { x: 800, y: -300 },
    type: "default",
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "animatedEdge" },
  { id: "e2-3", source: "2", target: "3", type: "animatedEdge" },
  { id: "e3-4", source: "3", target: "4", type: "animatedEdge" },
  { id: "e4-5", source: "4", target: "5", type: "animatedEdge" },
];

const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) => {
  // Use a path to create a smooth curve
  const edgePath = `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${
    targetX - 50
  },${targetY} ${targetX},${targetY}`;

  return (
    <g className="animated-edge">
      <path
        id={id}
        d={edgePath}
        style={{ ...style, stroke: "#1D4ED8", strokeWidth: 2 }}
        markerEnd={markerEnd}
        className="react-flow__edge-path"
      />
      <path
        d={edgePath}
        className="animated-path"
        style={{
          fill: "none",
          stroke: "#e5e7eb", //Later => #1D4ED8
          strokeWidth: 3,
          strokeDasharray: "4,4", // Dotted line
          animation: "dash 0.2s linear infinite", // Animation for flow effect
        }}
      />
    </g>
  );
};

const edgeTypes = { animatedEdge: AnimatedEdge };

export default function HeroRoadmap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isVertical, setIsVertical] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < 666);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isVertical) {
      setNodes((nodes) =>
        nodes.map((node, index) => ({
          ...node,
          position: { x: index * 100, y: index * 200 },
        }))
      );
    } else {
      setNodes(nodes);
    }
    setEdges(edges);
  }, [isVertical, setNodes, setEdges]);

  return (
    <div
      // style={{ width: "100%", maxHeight: "500px", height: "100%" }}
      className="w-full max-h-[500px] h-full max-lg:w-full"
    >
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          style: {
            padding: "16px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #1D4ED8)",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "500",
            textAlign: "center",
            border: "none",
            boxShadow: "4px 4px 4px rgba(250, 250, 250, 0.9)",
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        fitView
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
      >
        {/* <Controls /> */}
        {/* <Background /> */}
      </ReactFlow>
    </div>
  );
}
