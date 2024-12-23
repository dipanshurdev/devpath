"use client";

import { useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
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
  roadmap: CustomNode,
};

const edgeTypes = {
  animated: CustomEdge,
};

function createNodesAndEdges(nodes: Models.Document): {
  nodes: Node[];
  edges: Edge[];
} {
  const flowNodes: Node[] = nodes.map(
    (node: Models.Document, index: number) => ({
      id: node.nodeId,
      type: "roadmap",
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
      type: "animated",
      animated: true,
      // style: { stroke: "#e5e7eb", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.Arrow,
        // color: "#e5e7eb",
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
        <Background
          className="rounded-3xl"
          color="#e5e7eb"
          size={1.2}
          gap={10}
        />
        {/* <Controls /> */}
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
}
