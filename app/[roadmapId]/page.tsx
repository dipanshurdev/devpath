"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { getRoadmapById } from "@/lib/appwrite/api"; // Adjust this import to your actual API path
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  // Node,
  // Edge,
} from "@xyflow/react";
import dagre from "dagrejs"; // for layout algorithm
import "@xyflow/react/dist/style.css";
import { Models } from "appwrite";
import Loader from "@/components/Loader";

// Dagre setup for left-to-right (horizontal) layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (
  nodes: Models.Document,
  edges: any[],
  direction = "LR"
) => {
  dagreGraph.setGraph({ rankdir: direction });

  // Add nodes and edges to Dagre for layout

  nodes.forEach((node: Models.Document) =>
    dagreGraph.setNode(node.id, { width: 240, height: 100 })
  );
  edges.forEach((edge: Models.Document) =>
    dagreGraph.setEdge(edge.source, edge.target)
  );

  dagre.layout(dagreGraph);

  // Apply layout positions to nodes
  return nodes.map((node: Models.Document) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition?.x || 0,
      y: nodeWithPosition?.y || 0,
    };
    return node;
  });
};

const Page = () => {
  const { roadmapId } = useParams();
  const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roadmapId) return;
    const fetchRoadmap = async () => {
      try {
        const fetchedRoadmap = await getRoadmapById(roadmapId as string);
        setRoadmapData(fetchedRoadmap);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  // Generate nodes for the roadmap with style
  const nodes = useMemo(() => {
    if (!roadmapData?.nodes) return [];
    return roadmapData.nodes.map((node: Models.Document) => ({
      id: node.nodeId,
      data: {
        label: (
          <div className="p-4 bg-primaryWhite rounded-lg shadow-md border border-blue-300">
            <h3 className="text-lg font-semibold text-blue-800">
              {node.title}
            </h3>
            <ul className="mt-2 text-blue-700 text-sm list-disc list-inside">
              {node.resources?.map((res: Models.Document, index: number) => (
                <li key={res.$id}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📘 Resource {index + 1}: {res.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
      position: { x: 20, y: 200 },
      type: "default",
      style: {
        width: 240,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    }));
  }, [roadmapData]);

  // Generate edges for smooth transitions
  const edges = useMemo(() => {
    if (!roadmapData?.nodes) return [];
    return roadmapData.nodes.flatMap((node: Models.Document) =>
      node.related_node.map((related: Models.Document) => ({
        id: `${node.nodeId}-${related.nodeId}`,
        source: node.nodeId,
        target: related.nodeId,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#4a90e2", strokeWidth: 2 },
      }))
    );
  }, [roadmapData]);

  // Apply layout with dagre to arrange nodes in a horizontal roadmap style
  const layoutedElements = getLayoutedElements(nodes, edges, "LR");

  if (loading) {
    return <Loader loading={loading} />;
  }

  if (!roadmapData)
    return (
      <div className="w-full h-[50vh] text-center mt-12">
        <h4>
          Roadmap for <span className="text-primaryBlue">{roadmapId} </span>
          is under construction!🚧
        </h4>
        <span>We are working on it.🙂</span>
      </div>
    );

  return (
    <div
      className="h-screen flex flex-col items-center py-8 
   
    "
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl text-primaryWhite font-bold">
          {roadmapData.title}
        </h1>
        <p className="text-xl text-primaryWhite">{roadmapData.description}</p>
      </div>

      <ReactFlowProvider>
        <div
          style={{ width: "100%", height: "80vh" }}
          // className="
          // bg-gradient-to-r from-primaryDark to-primaryBlue

          // "
          className="bg-slate-200"
        >
          <ReactFlow
            nodes={layoutedElements}
            edges={edges}
            zoomOnScroll={false}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            snapGrid={[15, 15]}
            snapToGrid={true}
          >
            <Background gap={16} size={0.5} color="#e0f7ff" />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default Page;
