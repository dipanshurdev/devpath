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
  BackgroundVariant,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";

const nodeTypes = { roadmap: CustomNode };
const edgeTypes = { custom: CustomEdge };

const COL_WIDTH = 280;
const ROW_HEIGHT = 180;
const GAP = 80;
const PADDING_X = 60;
const PADDING_Y = 40;

function createNodesAndEdges(
  nodes: Record<string, unknown>[],
  completedNodeIds: string[],
): { nodes: Node[]; edges: Edge[] } {
  if (!nodes?.length) return { nodes: [], edges: [] };

  const flowNodes: Node[] = nodes.map(
    (node: Record<string, unknown>, index: number) => {
      const isLeft = index % 2 === 0;
      const x = isLeft ? PADDING_X : PADDING_X + COL_WIDTH + GAP;
      const y = PADDING_Y + index * ROW_HEIGHT;

      return {
        id: String(node.nodeId ?? node.id),
        type: "roadmap",
        position: { x, y },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        data: {
          ...node,
          id: node.id,
          nodeId: node.nodeId,
          completed: completedNodeIds.includes(String(node.id ?? node.nodeId)),
          order: index,
        },
      };
    },
  );

  const edges: Edge[] = nodes.slice(0, -1).map((node, index) => {
    const sourceId = String(node.nodeId ?? node.id);
    const targetId = String(nodes[index + 1].nodeId ?? nodes[index + 1].id);
    const sourceInternalId = node.id ?? node.nodeId;
    const isCompleted = completedNodeIds.includes(String(sourceInternalId));

    return {
      id: `e${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: "custom",
      animated: !isCompleted,
      data: { completed: isCompleted },
      style: {
        stroke: isCompleted
          ? "hsl(var(--primary))"
          : "hsl(var(--muted-foreground) / 0.4)",
        strokeWidth: isCompleted ? 3 : 2,
      },
    };
  });

  return { nodes: flowNodes, edges };
}

interface RoadmapFlowProps {
  nodes: Record<string, unknown>[];
  completedNodeIds: string[];
  onNodeClick: (node: Record<string, unknown>) => void;
}

export default function RoadmapFlow({
  nodes,
  completedNodeIds,
  onNodeClick,
}: RoadmapFlowProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => createNodesAndEdges(nodes, completedNodeIds),
    [nodes, completedNodeIds],
  );

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setFlowNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setFlowNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick(node.data as Record<string, unknown>);
    },
    [onNodeClick],
  );

  return (
    <div className="h-full w-full min-h-[720px] rounded-none overflow-hidden border border-border/60 dark:border-zinc-800 bg-card">
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
        fitViewOptions={{ padding: 0.35, maxZoom: 1.1 }}
        minZoom={0.25}
        maxZoom={1.5}
        selectNodesOnDrag={false}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable
        edgesFocusable={false}
        draggable={true}
        className="roadmap-flow"
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={4.5}
          color="#1a2bc3"
          className="opacity-30"
        />
        <Controls
          showInteractive={false}
          className="!bg-card !border !border-border !rounded-xl !shadow-lg !p-1.5"
        />
      </ReactFlow>
    </div>
  );
}
