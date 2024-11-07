// src/data.ts
import { Node, Edge } from "reactflow";

export const initialNodes: Node[] = [
  {
    id: "1",
    type: "default",
    data: { label: "JavaScript" },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "default",
    data: { label: "React" },
    position: { x: 300, y: 150 },
  },
  {
    id: "3",
    type: "default",
    data: { label: "Node.js" },
    position: { x: 150, y: 300 },
  },
  {
    id: "4",
    type: "default",
    data: { label: "Python" },
    position: { x: 500, y: 100 },
  },
  {
    id: "5",
    type: "default",
    data: { label: "Django" },
    position: { x: 700, y: 200 },
  },
  {
    id: "6",
    type: "default",
    data: { label: "HTML" },
    position: { x: 50, y: 400 },
  },
  {
    id: "7",
    type: "default",
    data: { label: "CSS" },
    position: { x: 200, y: 400 },
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "animatedNode", // Use the custom edge type
    data: { node: "JavaScript to React" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "animatedNode",
    data: { node: "JavaScript to Node.js" },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    type: "animatedNode",
    data: { node: "Python to Django" },
  },
  {
    id: "e6-7",
    source: "6",
    target: "7",
    type: "animatedNode",
    data: { node: "HTML to CSS" },
  },
];
