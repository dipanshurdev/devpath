"use client";

// import React, { useEffect, useState } from "react";
// import ReactFlow, {
//   //   Background,
//   //   Controls,
//   Edge,
//   EdgeProps,
//   Node,
//   //   Position,
//   useEdgesState,
//   useNodesState,
// } from "reactflow";
// import "reactflow/dist/style.css";

// // const initialNodes: Node[] = [
// //   {
// //     id: "1",
// //     data: { label: "You" },
// //     position: { x: 0, y: -500 },
// //     type: "default",
// //   },
// //   {
// //     id: "2",
// //     data: { label: "Frontend" },
// //     position: { x: 200, y: -200 },
// //     type: "default",
// //   },
// //   {
// //     id: "3",
// //     data: { label: "Backend" },
// //     position: { x: 400, y: -400 },
// //     type: "default",
// //   },
// //   {
// //     id: "4",
// //     data: { label: "Fullstack" },
// //     position: { x: 600, y: 0 },
// //     type: "default",
// //   },
// //   {
// //     id: "5",
// //     data: { label: "More..." },
// //     position: { x: 800, y: -300 },
// //     type: "default",
// //   },
// // ];

// const initialNodes: Node[] = [
//   {
//     id: "1",
//     data: { label: "🙎‍♂️", icon: "👤" },
//     position: { x: 0, y: -500 },
//     type: "custom",
//   },
//   {
//     id: "2",
//     data: { label: "Frontend", icon: "💻" },
//     position: { x: 200, y: -200 },
//     type: "custom",
//   },
//   {
//     id: "3",
//     data: { label: "Backend", icon: "🖧" },
//     position: { x: 400, y: -400 },
//     type: "custom",
//   },
//   {
//     id: "4",
//     data: { label: "Fullstack", icon: "🔗" },
//     position: { x: 600, y: 0 },
//     type: "custom",
//   },
//   {
//     id: "5",
//     data: { label: "More...", icon: "✨" },
//     position: { x: 800, y: -300 },
//     type: "custom",
//   },
// ];

// const initialEdges: Edge[] = [
//   { id: "e1-2", source: "1", target: "2", type: "animatedEdge" },
//   { id: "e2-3", source: "2", target: "3", type: "animatedEdge" },
//   { id: "e3-4", source: "3", target: "4", type: "animatedEdge" },
//   { id: "e4-5", source: "4", target: "5", type: "animatedEdge" },
// ];

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

// const edgeTypes = { animatedEdge: AnimatedEdge };

// export default function HeroRoadmap() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const [isVertical, setIsVertical] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsVertical(window.innerWidth < 666);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (isVertical) {
//       setNodes((nodes) =>
//         nodes.map((node, index) => ({
//           ...node,
//           position: { x: index * 100, y: index * 200 },
//         }))
//       );
//     } else {
//       setNodes(nodes);
//     }
//     setEdges(edges);
//   }, [isVertical, setNodes, setEdges, nodes, edges]);

//   return (
//     <div
//       // style={{ width: "100%", maxHeight: "500px", height: "100%" }}
//       className="w-full max-h-[500px] h-full max-lg:w-full"
//     >
//       <ReactFlow
//         nodes={nodes.map((n) => ({
//           ...n,
//           style: {
//             padding: "16px",
//             borderRadius: "50px",
//             background: "linear-gradient(135deg, #3b82f6, #1D4ED8)",
//             color: "#fff",
//             fontSize: "22px",
//             fontWeight: "500",
//             textAlign: "center",
//             border: "none",
//           },
//         }))}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         edgeTypes={edgeTypes}
//         fitView
//         nodesConnectable={false}
//         elementsSelectable={false}
//         panOnScroll={false}
//         zoomOnScroll={false}
//         zoomOnPinch={false}
//       >
//         {/* <Controls /> */}
//         {/* <Background /> */}
//       </ReactFlow>
//     </div>
//   );
// }

//------------------------------------------------

import React, { useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  // Controls,
  // Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeTypes,
  NodeTypes,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import RoadmapNode from "./RoadmapNode";
import AnimatedEdge from "./AnimatedEdge";

const nodeTypes: NodeTypes = {
  roadmap: RoadmapNode,
};

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "Start", icon: "🚀", description: "Begin your journey" },
    position: { x: 380, y: -1551 },
    type: "roadmap",
  },
  {
    id: "2",
    data: {
      label: "Frontend",
      icon: "💻",
      description: "Master HTML, CSS, JS",
    },
    position: { x: 243, y: -1369 },
    type: "roadmap",
  },
  {
    id: "3",
    data: {
      label: "Backend",
      icon: "⚛️",
      description: "Learn server-side programming",
    },
    position: { x: 141, y: -1200 },
    type: "roadmap",
  },
  {
    id: "4",
    data: {
      label: "Fullstack",
      icon: "🔗",
      description: "Combine frontend and backend skills",
    },
    position: { x: 550, y: -1200 },
    type: "roadmap",
  },
  {
    id: "5",
    data: {
      label: "Advanced",
      icon: "🏆",
      description: "Specialize and excel",
    },
    position: { x: 403, y: -888 },
    type: "roadmap",
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "animated",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "animated",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    type: "animated",
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    type: "animated",
    markerEnd: { type: MarkerType.Arrow },
  },
];

const StylishRoadmapFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        {/* <Controls /> */}
        {/* <Background color="#f0f0f0" gap={16} /> */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
        </svg>
      </ReactFlow>
    </div>
  );
};

export default StylishRoadmapFlow;
