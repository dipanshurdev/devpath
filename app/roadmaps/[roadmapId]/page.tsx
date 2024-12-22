// "use client";

// import { useState, useCallback, useEffect } from "react";
// import ReactFlow, {
//   Node,
//   Edge,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MarkerType,
//   // Panel,
//   Connection,
//   NodeMouseHandler,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Book,
//   CircleChevronDown,
//   CircleChevronUp,
//   Code,
//   FileVideo,
//   Folder,
//   Gamepad,
//   LinkIcon,
// } from "lucide-react";
// import { Models } from "appwrite";
// import { getRoadmapById } from "@/lib/appwrite/api";
// import { useParams } from "next/navigation";
// import Loader from "@/components/Loader";

// type Resource = {
//   title: string;
//   description: string;
//   url: string;
//   type: "article" | "video" | "docs";
//   difficulty: "Beginner" | "Intermediate" | "Advanced";
// };

// type RoadmapNodeData = {
//   title: string;
//   description: string;
//   resources?: Resource[];
//   type: string;
// };

// type RoadmapNode = Node<RoadmapNodeData>;

// type RoadmapEdge = Edge & {
//   markerEnd: {
//     type: MarkerType;
//     color: string;
//   };
// };

// // type RoadmapData = {
// //   title: string;
// //   description: string;
// //   nodes: Array<{
// //     nodeId: string;
// //     title: string;
// //     description: string;
// //     resources?: Resource[];
// //     type: string;
// //   }>;
// // };

// const getResourceIcon = (type: string) => {
//   switch (type) {
//     case "article":
//       return <Book className="w-4 h-4" />;
//     case "video":
//       return <FileVideo className="w-4 h-4" />;
//     case "docs":
//       return <Folder className="w-4 h-4" />;
//     case "game":
//       return <Gamepad className="w-4 h-4" />;
//     default:
//       return <Code className="w-4 h-4" />;
//   }
// };

// // Resource card
// const ResourceCard = ({ resource }: { resource: Resource }) => (
//   <Card className="mb-2">
//     <CardHeader className="p-4">
//       <CardTitle className="text-sm flex items-center gap-2">
//         {getResourceIcon(resource.type)}
//         {resource.title}
//       </CardTitle>
//     </CardHeader>
//     <CardContent className="p-4 pt-0">
//       <CardDescription className="text-xs">
//         {resource.description}
//       </CardDescription>
//       <div className="flex justify-between items-center mt-2 ">
//         <Badge
//           variant="secondary"
//           className="text-xs hover:bg-blue-500 bg-primaryBlue text-primaryWhite cursor-pointer"
//         >
//           {resource.difficulty}
//         </Badge>
//         <Button variant="outline" size="sm" asChild>
//           <a
//             href={resource.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-primaryBlue"
//           >
//             <LinkIcon className="w-4 h-4 mr-2" />
//             Open
//           </a>
//         </Button>
//       </div>
//     </CardContent>
//   </Card>
// );

// const Page = () => {
//   const { roadmapId } = useParams();
//   const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
//   const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
//   // const [roadmapTitle, setRoadmapTitle] = useState<string>("");
//   // const [roadmapDescription, setRoadmapDescription] = useState<string>("");
//   const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isExpanded, setIsExpanded] = useState<boolean>(false);

//   // Fetch roadmap data
//   useEffect(() => {
//     if (roadmapId) {
//       const fetchRoadmapData = async () => {
//         try {
//           const response: Models.Document | null = await getRoadmapById(
//             roadmapId as string
//           );
//           // setRoadmapTitle(response.title);
//           // setRoadmapDescription(response.description);
//           setRoadmapData(response);

//           const roadmapNodes: Node[] = response?.nodes.map(
//             (node: Models.Document, index: number) => ({
//               id: node.nodeId,

//               data: { label: node.title, ...node },
//               position: { x: index % 2 === 0 ? 400 : 800, y: index * 222 },
//               style: {
//                 minWidth: 150,
//                 width: "auto",
//                 maxWidth: 180,
//                 height: 100,
//                 borderRadius: "0.5rem",
//                 background: "#1D4ED8",
//                 color: "#e5e7eb",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "1rem",
//               },
//             })
//           );

//           const roadmapEdges: RoadmapEdge[] = response?.nodes
//             .slice(0, -1)
//             .map((node: Models.Document, index: number) => ({
//               id: `e${node.nodeId}-${response.nodes[index + 1].nodeId}`,
//               source: node.nodeId,
//               target: response.nodes[index + 1].nodeId,
//               animated: true,
//               style: { stroke: "#e5e7eb" },
//               markerEnd: { type: MarkerType.ArrowClosed, color: "#1D4ED8" },
//             }));

//           setNodes(roadmapNodes);
//           setEdges(roadmapEdges);
//         } catch (error) {
//           console.error("Failed to fetch roadmap data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchRoadmapData();
//     }
//   }, [roadmapId, setNodes, setEdges]);

//   const onConnect = useCallback(
//     (params: Connection) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
//     setSelectedNode(node);
//   }, []);

//   if (loading) {
//     return <Loader loading={loading} />;
//   }

//   if (!roadmapData) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100vh",
//           // backgroundColor: ,
//           color: "#e5e7eb",
//         }}
//       >
//         <h1
//           style={{
//             fontSize: "2rem",
//             marginBottom: "1rem",
//             color: "#007BFF",
//             textAlign: "center",
//           }}
//         >
//           🚧 Roadmap is Under Construction 🚧
//         </h1>
//         <p
//           style={{ fontSize: "1.2rem", textAlign: "center", maxWidth: "600px" }}
//         >
//           This Roadmap is currently being built. We are working hard to complete
//           it. So stay tuned for updates!🫡🚀
//         </p>
//         <p
//           style={{
//             fontSize: "1rem",
//             textAlign: "center",
//             maxWidth: "400px",
//             marginTop: "10px",
//           }}
//         >
//           Try other Roadmaps like: Frontend, Backend....
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-screen flex mt-16 mb-20 rounded-lg max-lg:flex-col ">
//       <div className="lg:flex-1 h-full max-lg:h-screen max-lg:mb-8">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           fitView
//           draggable={false}
//         >
//           <Background color="#1D4ED8" gap={16} size={1} />
//           {/* <Panel
//             position="top-left"
//             className="bg-background/95 p-4 rounded-lg border shadow-lg backdrop-blur-sm"
//           >
//             <h1 className="text-2xl font-bold mb-2 text-primaryBlue">
//               {roadmapData?.title}
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               {roadmapData?.description}
//             </p>
//           </Panel> */}
//           <Controls />
//         </ReactFlow>
//       </div>
//       <div className="w-80 bg-background border-l p-4 overflow-y-scroll rounded-lg">
//         <h2 className="text-2xl font-bold mb-4 text-primaryDark capitalize text-center">
//           {`<${roadmapData?.title}/>`}
//         </h2>

//         {/* <p className="text-sm text-muted-foreground mb-4 text-primaryDark text-center">
//           {roadmapData?.description}
//         </p> */}

//         <p className="text-sm text-start text-muted-foreground mb-4 text-primaryDark">
//           {!selectedNode?.data?.title ||
//           isExpanded ||
//           roadmapData?.description.length <= 150
//             ? roadmapData?.description
//             : `${roadmapData?.description.slice(0, 150)}...`}
//         </p>
//         {roadmapData?.description.length > 100 && selectedNode?.data?.title && (
//           <Button
//             variant="dropDown"
//             className="px-0  text-sm font-medium text-primaryBlue  hover:text-blue-600 "
//             onClick={() => setIsExpanded(!isExpanded)}
//           >
//             {isExpanded ? (
//               <span className="flex w-full items-center justify-between gap-2 text-base">
//                 Show Less <CircleChevronUp />
//               </span>
//             ) : (
//               <span className="flex w-full items-center justify-between gap-2 text-base">
//                 Show More <CircleChevronDown />
//               </span>
//             )}
//           </Button>
//         )}

//         {selectedNode ? (
//           <div>
//             <h3 className="text-lg font-semibold mb-2 text-primaryDark">
//               {selectedNode.data.title}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-4 text-primaryDarkLight">
//               {selectedNode.data.description}
//             </p>
//             <h4 className="text-md  font-semibold mb-4 text-primaryDarkLight">
//               Learning Resources:-
//             </h4>
//             <ScrollArea className="h-[calc(100vh-280px)]">
//               {selectedNode.data.resources?.map((resource, index) => (
//                 <ResourceCard key={index} resource={resource} />
//               ))}
//             </ScrollArea>
//           </div>
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-center">
//             <p className="text-lg text-muted-foreground text-primaryBlue">
//               Select a node to view details and resources.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Page;

// =--------------------------------------------------------------------------------------

// "use client";

// import { useParams } from "next/navigation";
// import ReactFlow, {
//   addEdge,
//   Connection,
//   Edge,
//   MarkerType,
//   NodeMouseHandler,
//   useEdgesState,
//   useNodesState,
// } from "reactflow";
// import React, { useCallback, useEffect, useState } from "react";
// import { Models } from "appwrite";
// import roadmapDataJSON from "@/skillBasedRoadmap.json";
// import { ScrollArea } from "@radix-ui/react-scroll-area";

// const Page = () => {
//   const { roadmapId } = useParams(); // Capture the dynamic route parameter
//   const [nodes, setNodes, onNodesChange] = useNodesState<any[]>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<any[]>([]);
//   const [selectedNode, setSelectedNode] = useState<Models.Document | null>(
//     null
//   );
//   const [roadmapData, setRoadmapData] = useState<any | null>(null);

//   useEffect(() => {
//     // Filter roadmaps based on the route parameter
//     const filteredRoadmap = roadmapDataJSON.roadmaps.find(
//       (roadmap) => roadmap.id == roadmapId
//     );

//     if (filteredRoadmap) {
//       setRoadmapData(filteredRoadmap);

//       // Create nodes for the filtered roadmap
//       const roadmapNodes = filteredRoadmap.steps.map((step, index) => ({
//         id: step.id,
//         data: {
//           label: step.title,
//           ...step,
//           // resources: step?.resources,
//         },
//         position: { x: index % 2 === 0 ? 400 : 800, y: index * 222 },
//         style: {
//           minWidth: 150,
//           width: "auto",
//           maxWidth: 180,
//           height: 100,
//           borderRadius: "0.5rem",
//           background: "#1D4ED8",
//           color: "#e5e7eb",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: "1rem",
//         },
//       }));

//       // Create edges for the filtered roadmap
//       const roadmapEdges = filteredRoadmap.steps
//         .slice(0, -1)
//         .map((step, index) => ({
//           id: `e${step.id}-${filteredRoadmap.steps[index + 1].id}`,
//           source: step.id,
//           target: filteredRoadmap.steps[index + 1].id,
//           animated: true,
//           style: { stroke: "#e5e7eb" },
//           markerEnd: { type: MarkerType.ArrowClosed, color: "#1D4ED8" },
//         }));

//       setNodes(roadmapNodes as any);
//       setEdges(roadmapEdges);
//     } else {
//       setRoadmapData(null); // If no matching roadmap, show a fallback message
//     }
//   }, [roadmapId]);

//   const onConnect = useCallback(
//     (params: Connection) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const onNodeClick: NodeMouseHandler = useCallback((_, node: any) => {
//     setSelectedNode(node);
//   }, []);

//   return (
//     <div className="w-full h-screen flex flex-col">
//       <div className="flex-1 h-full">
//         {roadmapData ? (
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             onNodeClick={onNodeClick}
//             fitView
//           >
//             {/* <Background color="#1D4ED8" gap={16} size={1} />
//             <Controls /> */}
//           </ReactFlow>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-lg text-muted-foreground">
//               No roadmap found for "{roadmapId}". Please check the URL or try
//               another roadmap.
//             </p>
//           </div>
//         )}
//       </div>
//       {roadmapData && (
//         <div className="w-full p-4 bg-gray-100">
//           {selectedNode ? (
//             <>
//               <h3 className="text-lg font-bold">{selectedNode.data.title}</h3>
//               <p>{selectedNode.data.description}</p>
//               <ScrollArea>
//                 {selectedNode.data.resources?.map(
//                   (resource: any, index: any) => (
//                     // <ResourceCard key={index} resource={resource} />
//                     <div
//                       key={index}
//                       className="p-4 my-2 bg-white rounded-lg shadow"
//                     >
//                       <h4>{resource.title}</h4>
//                       <p>{resource.description}</p>
//                     </div>
//                   )
//                 )}
//               </ScrollArea>
//             </>
//           ) : (
//             <p>Select a node to view details.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;

// -----------------------------New Code------------------------------

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RoadmapFlow from "@/components/roadmaps/RoadmapFlow";
import RoadmapInfo from "@/components/roadmaps/RoadmapInfo";
import NodeDetails from "@/components/roadmaps/NodeDetails";
import { Models } from "appwrite";
import { getRoadmapById } from "@/lib/appwrite/api";
import Loader from "@/components/Loader";

export default function RoadmapPage({
  params,
}: {
  params: { roadmapId: string };
}) {
  const [selectedNode, setSelectedNode] = useState<Models.Document | null>(
    null
  );
  const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (params.roadmapId) {
      const fetchRoadmapData = async () => {
        try {
          const response: Models.Document | null = await getRoadmapById(
            params.roadmapId as string
          );
          // setRoadmapTitle(response.title);
          // setRoadmapDescription(response.description);
          setRoadmapData(response);
        } catch (error) {
          console.log(error);
          // notFound()
        } finally {
          setLoading(false);
        }
      };
      fetchRoadmapData();
    }
  }, [params.roadmapId]);

  if (loading) {
    <Loader loading={loading} />;
  }

  return (
    <div className="flex items-center h-screen">
      {roadmapData ? (
        <>
          <div className="flex-1 overflow-hidden">
            <div className="container mx-auto px-4 py-8">
              <RoadmapInfo roadmap={roadmapData} />
              <RoadmapFlow
                nodes={roadmapData.nodes as Models.Document}
                onNodeClick={(node: Models.Document) => setSelectedNode(node)}
              />
            </div>
          </div>
          {/* <AnimatePresence> */}
          {selectedNode && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-1/3 bg-white dark:bg-gray-800 p-4 overflow-y-auto border-l border-gray-200 dark:border-gray-700 "
              style={{ height: "100vh - 200px)" }}
            >
              <NodeDetails node={selectedNode} />
            </motion.div>
          )}
          {/* </AnimatePresence> */}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            // backgroundColor: ,
            color: "#e5e7eb",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "1rem",
              color: "#007BFF",
              textAlign: "center",
            }}
          >
            🚧 Roadmap is Under Construction 🚧
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            This Roadmap is currently being built. We are working hard to
            complete it. So stay tuned for updates!🫡🚀
          </p>
          <p
            style={{
              fontSize: "1rem",
              textAlign: "center",
              maxWidth: "400px",
              marginTop: "10px",
            }}
          >
            Try other Roadmaps like: Frontend, Backend....
          </p>
        </div>
      )}
    </div>
  );
}
