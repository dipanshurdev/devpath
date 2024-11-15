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
  Panel,
  Connection,
  NodeMouseHandler,
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
import { Book, Code, FileVideo, Folder, Gamepad, LinkIcon } from "lucide-react";
import { Models } from "appwrite";
import { getRoadmapById } from "@/lib/appwrite/api";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";

type Resource = {
  title: string;
  description: string;
  url: string;
  type: "article" | "video" | "docs";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

type RoadmapNodeData = {
  title: string;
  description: string;
  resources?: Resource[];
  type: string;
};

type RoadmapNode = Node<RoadmapNodeData>;

type RoadmapEdge = Edge & {
  markerEnd: {
    type: MarkerType;
    color: string;
  };
};

// type RoadmapData = {
//   title: string;
//   description: string;
//   nodes: Array<{
//     nodeId: string;
//     title: string;
//     description: string;
//     resources?: Resource[];
//     type: string;
//   }>;
// };

const getResourceIcon = (type: string) => {
  switch (type) {
    case "article":
      return <Book className="w-4 h-4" />;
    case "video":
      return <FileVideo className="w-4 h-4" />;
    case "docs":
      return <Folder className="w-4 h-4" />;
    case "game":
      return <Gamepad className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
};

// Resource card
const ResourceCard = ({ resource }: { resource: Resource }) => (
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
          className="text-xs bg-primaryBlue text-primaryWhite cursor-pointer"
        >
          {resource.difficulty}
        </Badge>
        <Button variant="outline" size="sm" asChild>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
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

const Page = () => {
  const { roadmapId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  // const [roadmapTitle, setRoadmapTitle] = useState<string>("");
  // const [roadmapDescription, setRoadmapDescription] = useState<string>("");
  const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch roadmap data
  useEffect(() => {
    if (roadmapId) {
      const fetchRoadmapData = async () => {
        try {
          const response: Models.Document | null = await getRoadmapById(
            roadmapId as string
          );
          // setRoadmapTitle(response.title);
          // setRoadmapDescription(response.description);
          setRoadmapData(response);

          const roadmapNodes: Node[] = response?.nodes.map(
            (node: Models.Document, index: number) => ({
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

          const roadmapEdges: RoadmapEdge[] = response?.nodes
            .slice(0, -1)
            .map((node: Models.Document, index: number) => ({
              id: `e${node.nodeId}-${response.nodes[index + 1].nodeId}`,
              source: node.nodeId,
              target: response.nodes[index + 1].nodeId,
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
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  if (loading) {
    return <Loader loading={loading} />;
  }

  return (
    <div className="w-full h-screen flex mt-16 mb-20 rounded-lg">
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
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
      <div className="w-80 bg-background border-l p-4 overflow-y-scroll rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-primaryDark capitalize text-center">
          {roadmapData?.title}
        </h2>
        <p className="text-sm text-muted-foreground mb-4 text-primaryDark text-center">
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
              {selectedNode.data.resources?.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
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
};

export default Page;
