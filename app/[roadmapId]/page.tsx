// "use client";

// import { useParams } from "next/navigation";
// import React, { useEffect, useState, useMemo } from "react";
// import { getRoadmapById } from "@/lib/appwrite/api"; // Adjust this import to your actual API path
// import {
//   ReactFlow,
//   Background,
//   Controls,
//   ReactFlowProvider,
//   Node,
//   Edge,
// } from "@xyflow/react";
// import dagre from "dagrejs"; // for layout algorithm
// import "@xyflow/react/dist/style.css";
// import { Models } from "appwrite";
// import Loader from "@/components/Loader";

// // Dagre graph setup for tree layout
// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));

// // Function to handle node and edge layout with dagre
// const getLayoutedElements = (nodes = [], edges = [], direction = "TB") => {
//   // Set up graph layout direction
//   dagreGraph.setGraph({ rankdir: direction });

//   // Add nodes to the graph, checking if nodes exist
//   nodes?.forEach((node: any) => {
//     dagreGraph.setNode(node.id, { width: 220, height: 80 });
//   });

//   // Add edges to the graph, checking if edges exist
//   edges?.forEach((edge: any) => {
//     dagreGraph.setEdge(edge.source, edge.target);
//   });

//   // Apply Dagre layout
//   dagre.layout(dagreGraph);

//   // Update node positions based on layout calculation
//   return nodes.map((node: any) => {
//     const nodeWithPosition = dagreGraph.node(node.id);
//     return {
//       ...node,
//       position: {
//         x: nodeWithPosition?.x || 0, // Fallback to 0 if layout fails
//         y: nodeWithPosition?.y || 0,
//       },
//       style: {
//         width: 200,
//         height: 60,
//         borderRadius: "12px",
//         border: "2px solid #007acc",
//         padding: "12px",
//         backgroundColor: "#e0f7ff",
//         color: "#007acc",
//         fontWeight: "bold",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       },
//     };
//   });
// };

// const Page = () => {
//   const { roadmapId } = useParams();
//   const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!roadmapId) return;
//     const fetchRoadmap = async () => {
//       try {
//         const fetchedRoadmap = await getRoadmapById(roadmapId as string);
//         setRoadmapData(fetchedRoadmap);
//       } catch (error) {
//         console.error("Error fetching roadmap:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoadmap();
//   }, [roadmapId]);

//   // Generate nodes for the roadmap layout
//   const nodes = useMemo(() => {
//     if (!roadmapData?.nodes) return [];
//     return roadmapData.nodes.map((node: any) => ({
//       id: node.nodeId,
//       data: {
//         label: (
//           <div className="p-2 text-center">
//             <h3 className="text-blue-700 font-semibold">{node.title}</h3>
//             <p className="text-blue-500 text-xs">{node.description}</p>
//           </div>
//         ),
//       },
//       position: { x: 0, y: 0 },
//       type: "input",
//       style: {
//         borderRadius: "12px",
//         padding: "10px",
//         textAlign: "center",
//       },
//     }));
//   }, [roadmapData]);

//   // Generate edges with smooth transitions and animations
//   const edges = useMemo(() => {
//     if (!roadmapData?.nodes) return [];
//     return roadmapData.nodes.flatMap((node: any) =>
//       node.related_node.map((related: any) => ({
//         id: `${node.nodeId}-${related.nodeId}`,
//         source: node.nodeId,
//         target: related.nodeId,
//         type: "smoothstep",
//         animated: true,
//         style: { stroke: "#4a90e2", strokeWidth: 2 },
//       }))
//     );
//   }, [roadmapData]);

//   // Apply layout to nodes and edges if nodes/edges are defined
//   const layoutedElements = getLayoutedElements(nodes, edges, "TB");

//   if (loading) {
//     return <Loader loading={loading} />;
//   }

//   if (!roadmapData) return <p>{`Roadmap not found for ID: ${roadmapId}`}</p>;

//   return (
//     <div className="h-screen flex flex-col items-center py-8 bg-gradient-to-r from-blue-50 to-blue-200">
//       <div className="text-center mb-8">
//         <h1 className="text-4xl text-blue-800 font-bold">
//           {roadmapData.title}
//         </h1>
//         <p className="text-2xl text-blue-700">{roadmapData.description}</p>
//       </div>

//       <ReactFlowProvider>
//         <div style={{ width: "100%", height: "80vh" }}>
//           <ReactFlow
//             nodes={layoutedElements}
//             edges={edges}
//             zoomOnScroll={false}
//             fitView
//             fitViewOptions={{ padding: 0.1 }}
//             snapGrid={[15, 15]}
//             snapToGrid={true}
//           >
//             <Background gap={16} size={0.5} color="#e0f7ff" />
//             <Controls />
//           </ReactFlow>
//         </div>
//       </ReactFlowProvider>
//     </div>
//   );
// };

// export default Page;

"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { getRoadmapById } from "@/lib/appwrite/api"; // Adjust this import to your actual API path
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  // Node,
  // Edge,
} from "@xyflow/react";
import dagre from "dagrejs"; // for layout algorithm
import "@xyflow/react/dist/style.css";
import { Models } from "appwrite";
import Loader from "@/components/Loader";

// Dagre setup for left-to-right (horizontal) layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes = [], edges = [], direction = "LR") => {
  dagreGraph.setGraph({ rankdir: direction });

  // Add nodes and edges to Dagre for layout
  nodes.forEach((node: any) =>
    dagreGraph.setNode(node.id, { width: 240, height: 100 })
  );
  edges.forEach((edge: any) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  // Apply layout positions to nodes
  return nodes.map((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition?.x || 0,
      y: nodeWithPosition?.y || 0,
    };
    return node;
  });
};

const Page = () => {
  const { roadmapId } = useParams();
  const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roadmapId) return;
    const fetchRoadmap = async () => {
      try {
        const fetchedRoadmap = await getRoadmapById(roadmapId as string);
        setRoadmapData(fetchedRoadmap);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  // Generate nodes for the roadmap with style
  const nodes = useMemo(() => {
    if (!roadmapData?.nodes) return [];
    return roadmapData.nodes.map((node: any) => ({
      id: node.nodeId,
      data: {
        label: (
          <div className="p-4 bg-primaryWhite rounded-lg shadow-md border border-blue-300">
            <h3 className="text-lg font-semibold text-blue-800">
              {node.title}
            </h3>
            <ul className="mt-2 text-blue-700 text-sm list-disc list-inside">
              {node.resources?.map((res: any, index: any) => (
                <li key={res.$id}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📘 Resource {index + 1}: {res.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      position: { x: 20, y: 200 },
      type: "default",
      style: {
        width: 240,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    }));
  }, [roadmapData]);

  // Generate edges for smooth transitions
  const edges = useMemo(() => {
    if (!roadmapData?.nodes) return [];
    return roadmapData.nodes.flatMap((node: any) =>
      node.related_node.map((related: any) => ({
        id: `${node.nodeId}-${related.nodeId}`,
        source: node.nodeId,
        target: related.nodeId,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#4a90e2", strokeWidth: 2 },
      }))
    );
  }, [roadmapData]);

  // Apply layout with dagre to arrange nodes in a horizontal roadmap style
  const layoutedElements = getLayoutedElements(nodes, edges, "LR");

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (!roadmapData) return <p>{`Roadmap not found for ID: ${roadmapId}`}</p>;

  return (
    <div
      className="h-screen flex flex-col items-center py-8 
   
    "
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl text-primaryWhite font-bold">
          {roadmapData.title}
        </h1>
        <p className="text-xl text-primaryWhite">{roadmapData.description}</p>
      </div>

      <ReactFlowProvider>
        <div
          style={{ width: "100%", height: "80vh" }}
          // className="
          // bg-gradient-to-r from-primaryDark to-primaryBlue

          // "
          className="bg-slate-200"
        >
          <ReactFlow
            nodes={layoutedElements}
            edges={edges}
            zoomOnScroll={false}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            snapGrid={[15, 15]}
            snapToGrid={true}
          >
            <Background gap={16} size={0.5} color="#e0f7ff" />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default Page;
