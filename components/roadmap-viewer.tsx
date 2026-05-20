"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ConnectionMode,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { RoadmapNode } from "@/components/roadmap-node";
import type { RoadmapData } from "@/lib/roadmap-data";
import { ResourcePanel } from "@/components/resource-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Clock,
} from "lucide-react";

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

interface RoadmapViewerProps {
  roadmapData: RoadmapData;
  completedNodes: string[];
  onNodeSelect: (nodeId: string) => void;
  selectedNodeId: string | null;
}

export function RoadmapViewer({
  roadmapData,
  completedNodes,
  onNodeSelect,
  selectedNodeId,
}: RoadmapViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Create nodes from roadmap data
    const flowNodes: Node[] = roadmapData.nodes.map((node) => ({
      id: node?.id,
      type: "roadmapNode",
      position: node?.position,
      data: {
        ...node,
        isCompleted: completedNodes.includes(node?.id),
        isSelected: selectedNodeId === node?.id,
        onClick: () => onNodeSelect(node?.id),
      },
      draggable: true,
    }));

    // Create edges from connections
    const flowEdges: Edge[] = roadmapData.connections.map(
      (connection, index) => ({
        id: `edge-${index}`,
        source: connection.from,
        target: connection.to,
        type: "smoothstep",
        animated: true,
        style: {
          strokeWidth: 3,
          stroke: "hsl(var(--primary))",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "hsl(var(--primary))",
        },
      })
    );

    setNodes(flowNodes);
    setEdges(flowEdges);

    // Add loading delay for animation
    setTimeout(() => setIsLoaded(true), 500);
  }, [
    roadmapData,
    completedNodes,
    selectedNodeId,
    onNodeSelect,
    setNodes,
    setEdges,
  ]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`h-screen w-full relative ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        draggable={true}
        className={`transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          className="bg-card border border-border rounded-lg shadow-lg"
          showInteractive={false}
        />
        <Background
          color="hsl(var(--primary))"
          gap={30}
          size={2}
          className="opacity-30"
        />
      </ReactFlow>

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading roadmap...</p>
          </div>
        </div>
      )}

      {/* Fullscreen toggle button */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-sm"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Estimated time badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge
          variant="outline"
          className="bg-background/80 backdrop-blur-sm flex items-center gap-1"
        >
          <Clock className="h-3 w-3" />
          <span>{roadmapData?.duration}</span>
        </Badge>
      </div>

      {/* Resource panel */}
      {selectedNodeId && (
        <div
          className={`absolute top-0 right-0 h-full bg-background/95 backdrop-blur-md border-l border-border transition-all duration-300 ${
            isFullscreen
              ? "w-full md:w-1/3 translate-x-0"
              : "w-0 translate-x-full"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-2 left-2 z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <ResourcePanel
            node={roadmapData.nodes.find((n) => n.id === selectedNodeId) ?? null}
          />
        </div>
      )}

      {/* Resources button */}
      {!isFullscreen && selectedNodeId && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(true)}
          className="absolute top-1/2 right-0 -translate-y-1/2 rounded-l-full rounded-r-none border-r-0 bg-background/80 backdrop-blur-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Resources</span>
        </Button>
      )}
    </div>
  );
}
