"use client";

import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  // getSmoothStepPath,
  // EdgeProps,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Code, FileVideo, Folder, LinkIcon } from "lucide-react";
// import fullstack from "@/lib/data/fullstack.json";
import { Models } from "appwrite";
import { useParams } from "next/navigation";
import { getRoadmapById } from "@/lib/appwrite/api";
import Loader from "@/components/Loader";
// import { motion } from "framer-motion";

// type Resource = {
//   title: string;
//   description: string;
//   url: string;
//   type: "article" | "video" | "docs";
//   difficulty: "Beginner" | "Intermediate" | "Advanced";
// };

// type RoadmapNode = Node & {
//   data: {
//     title: string;
//     description: string;
//     resources?: Resource[];
//     type: string;
//   };
// };

// type RoadmapEdge = Edge & {
//   markerEnd: {
//     type: MarkerType;
//     color: string;
//   };
// };

// const AnimatedEdge = (props: EdgeProps) => {
//   const edgeColor = "#1D4ED8";
//   const [edgePath] = getSmoothStepPath({
//     sourceX: props.sourceX,
//     sourceY: props.sourceY,
//     targetX: props.targetX,
//     targetY: props.targetY,
//     sourcePosition: props.sourcePosition,
//     targetPosition: props.targetPosition,
//   });

//   return (
//     <motion.path
//       animate={{ opacity: [0.5, 1, 0.5] }}
//       transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
//       fill="none"
//       stroke={edgeColor}
//       strokeWidth={2}
//       d={edgePath}
//       markerEnd={`url(#react-flow__arrowclosed)`}
//     />
//   );
// };

// const edgeTypes = {
//   default: AnimatedEdge,
// };

// CustomNode component for displaying each node's data
// const CustomNode = ({ data }: { data: Models.Document }) => (
//   <motion.div
//     initial={{ scale: 0.5, opacity: 0 }}
//     animate={{ scale: 1, opacity: 1 }}
//     transition={{ duration: 0.5, type: "spring" }}
//     className={`p-4 rounded-lg border w-full shadow-lg backdrop-blur-sm ${
//       data.type === "group"
//         ? "bg-primary/10 border-primary"
//         : "bg-card/90 border-border"
//     }`}
//   >
//     <div className="flex flex-col gap-1 w-full">
//       <h3 className="font-semibold text-sm text-primaryBlue">{data.title}</h3>
//       {data.type === "required" && (
//         <Badge variant="secondary" className="self-start mt-1">
//           Required
//         </Badge>
//       )}
//     </div>
//   </motion.div>
// );

// Define all possible node types
// const nodeTypes = {
//   default: CustomNode,
//   group: CustomNode,
//   required: CustomNode,
//   checkpoint: CustomNode, // Added to prevent the error for "checkpoint" type
// };

function getResourceIcon(type: string) {
  switch (type) {
    case "article":
      return <Book className="w-4 h-4" />;
    case "video":
      return <FileVideo className="w-4 h-4" />;
    case "docs":
      return <Folder className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
}

const ResourceCard = ({ resource }: any) => (
  <Card className="mb-2">
    <CardHeader className="p-4">
      <CardTitle className="text-sm flex items-center gap-2">
        {getResourceIcon(resource.type)}
        {resource.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <CardDescription className="text-xs">
        {resource.description}
      </CardDescription>
      <div className="flex justify-between items-center mt-2 ">
        <Badge
          variant="secondary"
          className="text-xs text-primaryWhite bg-primaryBlue cursor-cell hover:bg-blue-500"
        >
          {resource.difficulty}
        </Badge>
        <Button variant="outline" size="sm" className="h-8" asChild>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer "
            className="text-primaryBlue"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Open
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function Page() {
  const params = useParams();
  const roadmapId = params.roadmapId;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Models.Document | null>(
    null
  );
  const [roadmapData, setRoadmapData] = useState<Models.Document | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roadmapId) {
      const fetchRoadmapData = async () => {
        try {
          const response = await getRoadmapById(roadmapId as string); // Fetch data based on roadmapId
          // setRoadmapTitle(response.title);
          // setRoadmapDescription(response.description);
          setRoadmapData(response);

          // Map fetched data to nodes and edges
          const roadmapNodes: Node[] = response?.nodes.map(
            (node: any, index: number) => ({
              id: node.nodeId,
              data: { label: node.title, ...node },
              position: { x: index % 2 === 0 ? 100 : 400, y: index * 220 },
              style: {
                minWidth: 150,
                width: "auto",
                maxWidth: 180,
                height: 100,
                borderRadius: "0.5rem",
                background: "#e5e7eb",
                color: "#1D4ED8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
              },
            })
          );

          const roadmapEdges: Edge[] = response?.nodes
            .slice(0, -1)
            .map((node: any, index: number) => ({
              id: `e${node.nodeId}-${response?.nodes[index + 1].nodeId}`,
              source: node.nodeId,
              target: response?.nodes[index + 1].nodeId,
              animated: true,
              style: { stroke: "#1D4ED8" },
              markerEnd: { type: MarkerType.ArrowClosed, color: "#1D4ED8" },
            }));

          setNodes(roadmapNodes);
          setEdges(roadmapEdges);
        } catch (error) {
          console.error("Failed to fetch roadmap data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRoadmapData();
    }
  }, [roadmapId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNode(node);
  }, []);

  // const nodeTypes = {
  //   default: ({ data }: any) => (
  //     <div className="bg-card text-card-foreground rounded-md border shadow-sm p-4 flex flex-col justify-center items-center text-center">
  //       <h3 className="font-semibold">{data.title}</h3>
  //       <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
  //     </div>
  //   ),
  // };

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <div className="w-full h-screen flex mt-16 mb-20 border-primaryWhite border border-dashed rounded-lg">
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          // nodeTypes={nodeTypes}
          // edgeTypes={edgeTypes}
          fitView
          draggable={false}
        >
          <Background color="#1D4ED8" gap={16} size={1} />
          <Panel
            position="top-left"
            className="bg-background/95 p-4 rounded-lg border shadow-lg backdrop-blur-sm"
          >
            <h1 className="text-2xl font-bold mb-2 text-primaryBlue">
              {roadmapData?.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {roadmapData?.description}
            </p>
          </Panel>
          <Controls />
        </ReactFlow>
      </div>
      <div className="w-80 bg-background border-l p-4">
        <h2 className="text-2xl font-bold mb-4 text-primaryDark capitalize text-center">
          {roadmapData?.title}
        </h2>
        <p className="text-sm text-muted-foreground mb-4 text-primaryDark">
          {roadmapData?.description}
        </p>
        {selectedNode ? (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primaryDark">
              {selectedNode.data.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 text-primaryDarkLight">
              {selectedNode.data.description}
            </p>
            <h4 className="text-md font-semibold mb-2 text-primaryDarkLight">
              Resources:
            </h4>
            <ScrollArea className="h-[calc(100vh-280px)]">
              {selectedNode.data.resources.map(
                (resource: any, index: number) => (
                  <ResourceCard key={index} resource={resource} />
                )
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center">
            <p className="text-lg text-muted-foreground text-primaryBlue">
              Select a node to view details and resources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
