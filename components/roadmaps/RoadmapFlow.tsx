"use client";

import { useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { Models } from "appwrite";
import { useKeyboardNavigation } from "@/lib/hooks/useKeyboardNavigation";

const nodeTypes = {
  roadmap: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

function createNodesAndEdges(
  nodes: Models.Document[],
  completedNodeIds: string[]
): {
  nodes: Node[];
  edges: Edge[];
} {
  const flowNodes: Node[] = nodes.map(
    (node: Models.Document, index: number) => ({
      id: node.nodeId,
      type: "roadmap",
      position: { x: index % 2 === 0 ? 400 : 800, y: index * 333 },
      data: { ...node, completed: completedNodeIds.includes(node.nodeId) },
    })
  );

  const edges: Edge[] = nodes.slice(0, -1).map((node, index) => ({
    id: `e${node.nodeId}-${nodes[index + 1].nodeId}`,
    source: node.nodeId,
    target: nodes[index + 1].nodeId,
    type: "animated",
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 5 },
    markerEnd: {
      type: MarkerType.Arrow,
      color: "#e5e7eb",
    },
  }));

  return { nodes: flowNodes, edges };
}

interface RoadmapFlowProps {
  nodes: Models.Document[];
  completedNodeIds: string[];
  onNodeClick: (node: Models.Document) => void;
}

export default function RoadmapFlow({
  nodes,
  completedNodeIds,
  onNodeClick,
}: RoadmapFlowProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => createNodesAndEdges(nodes, completedNodeIds),
    [nodes, completedNodeIds]
  );
  const [flowNodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick(node.data);
    },
    [onNodeClick]
  );

  const { currentNodeIndex, handleKeyDown } = useKeyboardNavigation(
    flowNodes.length
  );

  useEffect(() => {
    if (currentNodeIndex !== null) {
      const currentNode = flowNodes[currentNodeIndex];
      onNodeClick(currentNode.data);
    }
  }, [currentNodeIndex, flowNodes, onNodeClick]);

  return (
    <div
      className="h-full min-h-[600px] overflow-y-auto"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={2}
        selectNodesOnDrag={false}
        nodesFocusable={false}
        edgesFocusable={false}
        className="w-full"
      >
        <Background color="#e5e7eb" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
