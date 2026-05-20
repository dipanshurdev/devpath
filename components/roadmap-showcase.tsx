"use client"

import { useEffect, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Frontend Development" },
    position: { x: 250, y: 0 },
    className: "node-current",
  },
  {
    id: "2",
    data: { label: "HTML & CSS" },
    position: { x: 100, y: 100 },
    className: "node-completed",
  },
  {
    id: "3",
    data: { label: "JavaScript" },
    position: { x: 250, y: 100 },
    className: "node-completed",
  },
  {
    id: "4",
    data: { label: "React" },
    position: { x: 400, y: 100 },
  },
  {
    id: "5",
    data: { label: "CSS Frameworks" },
    position: { x: 100, y: 200 },
  },
  {
    id: "6",
    data: { label: "State Management" },
    position: { x: 250, y: 200 },
  },
  {
    id: "7",
    data: { label: "Testing" },
    position: { x: 400, y: 200 },
  },
]

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    className: "edge-completed",
    style: {
      strokeWidth: 3,
      strokeDasharray: 5,
      strokeDashoffset: 0,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#10b981",
    },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    className: "edge-completed",
    style: {
      strokeWidth: 3,
      strokeDasharray: 5,
      strokeDashoffset: 0,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#10b981",
    },
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
    animated: true,
    className: "edge-current",
    style: {
      strokeWidth: 3,
      strokeDasharray: 5,
      strokeDashoffset: 0,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "hsl(var(--primary))",
    },
  },
  {
    id: "e2-5",
    source: "2",
    target: "5",
    style: { strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
    },
  },
  {
    id: "e3-6",
    source: "3",
    target: "6",
    style: { strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
    },
  },
  {
    id: "e4-7",
    source: "4",
    target: "7",
    style: { strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
    },
  },
]

export function RoadmapShowcase() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] rounded-xl border border-border bg-muted/20 flex items-center justify-center glass-card">
        Loading roadmap...
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] rounded-xl border border-border overflow-hidden glass-card shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-right"
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { strokeWidth: 2 },
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        className="bg-gradient-to-br from-background/80 to-muted/30"
      >
        <Controls showInteractive={false} />
        <Background gap={12} size={1} color="rgba(0,0,0,0.05)" />
      </ReactFlow>
    </div>
  )
}
