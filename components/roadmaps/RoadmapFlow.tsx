"use client";

import { useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { Models } from "appwrite";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

function createNodesAndEdges(nodes: Models.Document): {
  nodes: Node[];
  edges: Edge[];
} {
  const flowNodes: Node[] = nodes.map(
    (node: Models.Document, index: number) => ({
      id: node.nodeId,
      type: "custom",
      position: { x: index % 2 === 0 ? 400 : 800, y: index * 333 },
      data: { ...node },
    })
  );

  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e${nodes[i].nodeId}-${nodes[i + 1].nodeId}`,
      source: nodes[i].nodeId,
      target: nodes[i + 1].nodeId,
      type: "custom",
      animated: true,
      style: { stroke: "#888", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#888",
      },
    });
  }

  return { nodes: flowNodes, edges };
}

interface RoadmapFlowProps {
  nodes: Models.Document;
  onNodeClick: (node: Models.Document) => void;
}

export default function RoadmapFlow({ nodes, onNodeClick }: RoadmapFlowProps) {
  const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(
    nodes as Models.Document
  );
  const [flowNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    onNodeClick(node.data);
  };

  useEffect(() => {
    if (!nodes) {
      setNodes(nodes);
    }
  }, [nodes, setNodes]);

  return (
    <div style={{ height: "calc(100vh - 200px)" }}>
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
      >
        <Background color="#e0e0e0" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
