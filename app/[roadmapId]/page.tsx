// "use client";

// import { useParams } from "next/navigation";
// import React, { useEffect, useState, useMemo } from "react";
// import { getRoadmapById } from "@/lib/appwrite/api"; // Adjust this import to your actual API path
// import {
//   ReactFlow,
//   Background,
//   Controls,
//   ReactFlowProvider,
//   // Node,
//   // Edge,
// } from "@xyflow/react";
// import dagre from "dagrejs"; // for layout algorithm
// import "@xyflow/react/dist/style.css";
// import { Models } from "appwrite";
// import Loader from "@/components/Loader";

// // Dagre setup for left-to-right (horizontal) layout
// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));

// const getLayoutedElements = (
//   nodes: Models.Document,
//   edges: Models.Document,
//   direction = "LR"
// ) => {
//   dagreGraph.setGraph({ rankdir: direction });

//   // Add nodes and edges to Dagre for layout

//   nodes.forEach((node: Models.Document) =>
//     dagreGraph.setNode(node.id, { width: 240, height: 100 })
//   );
//   edges.forEach((edge: Models.Document) =>
//     dagreGraph.setEdge(edge.source, edge.target)
//   );

//   dagre.layout(dagreGraph);

//   // Apply layout positions to nodes
//   return nodes.map((node: Models.Document) => {
//     const nodeWithPosition = dagreGraph.node(node.id);
//     node.position = {
//       x: nodeWithPosition?.x || 0,
//       y: nodeWithPosition?.y || 0,
//     };
//     return node;
//   });
// };

// const Page = () => {
//   const { roadmapId } = useParams();
//   const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!roadmapId) return;
//     const fetchRoadmap = async () => {
//       try {
//         const fetchedRoadmap = await getRoadmapById(roadmapId as string);
//         setRoadmapData(fetchedRoadmap);
//       } catch (error) {
//         console.error("Error fetching roadmap:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoadmap();
//   }, [roadmapId]);

//   // Generate nodes for the roadmap with style
//   const nodes = useMemo(() => {
//     if (!roadmapData?.nodes) return [];
//     return roadmapData.nodes.map((node: Models.Document) => ({
//       id: node.nodeId,
//       data: {
//         label: (
//           <div className="p-4 bg-primaryWhite rounded-lg shadow-md border border-blue-300">
//             <h3 className="text-lg font-semibold text-blue-800">
//               {node.title}
//             </h3>
//             <ul className="mt-2 text-blue-700 text-sm list-disc list-inside">
//               {node.resources?.map((res: Models.Document, index: number) => (
//                 <li key={res.$id}>
//                   <a
//                     href={res.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     📘 Resource {index + 1}: {res.title}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ),
//       },
//       position: { x: 20, y: 200 },
//       type: "default",
//       style: {
//         width: 240,
//         height: 100,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       },
//     }));
//   }, [roadmapData]);

//   // Generate edges for smooth transitions
//   const edges = useMemo(() => {
//     if (!roadmapData?.nodes) return [];
//     return roadmapData.nodes.flatMap((node: Models.Document) =>
//       node.related_node.map((related: Models.Document) => ({
//         id: `${node.nodeId}-${related.nodeId}`,
//         source: node.nodeId,
//         target: related.nodeId,
//         type: "smoothstep",
//         animated: true,
//         style: { stroke: "#4a90e2", strokeWidth: 2 },
//       }))
//     );
//   }, [roadmapData]);

//   // Apply layout with dagre to arrange nodes in a horizontal roadmap style
//   const layoutedElements = getLayoutedElements(nodes, edges, "LR");

//   if (!roadmapData)
//     return (
//       <div className="w-full h-[50vh] text-center mt-12">
//         <h4>
//           Roadmap for <span className="text-primaryBlue">{roadmapId} </span>
//           is under construction!🚧
//         </h4>
//         <span>We are working on it.🙂</span>
//       </div>
//     );

//   return (
//     <div
//       className="h-screen flex flex-col items-center py-8

//     "
//     >
//       <div className="text-center mb-8">
//         <h1 className="text-3xl text-primaryWhite font-bold">
//           {roadmapData.title}
//         </h1>
//         <p className="text-xl text-primaryWhite">{roadmapData.description}</p>
//       </div>

//       <ReactFlowProvider>
//         <div
//           style={{ width: "100%", height: "80vh" }}
//           // className="
//           // bg-gradient-to-r from-primaryDark to-primaryBlue

//           // "
//           className="bg-slate-200"
//         >
//           <ReactFlow
//             nodes={layoutedElements}
//             edges={edges}
//             zoomOnScroll={false}
//             fitView
//             fitViewOptions={{ padding: 0.2 }}
//             snapGrid={[15, 15]}
//             snapToGrid={true}
//           >
//             <Background gap={16} size={0.5} color="#e0f7ff" />
//             <Controls />
//           </ReactFlow>
//         </div>
//       </ReactFlowProvider>
//     </div>
//   );
// };

// export default Page;

"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelatedNode, Resource, NodeData } from "@/types/index";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Book, Code, FileVideo, Link } from "lucide-react";
import { useParams } from "next/navigation";
import { Models } from "appwrite";
import { getRoadmapById } from "@/lib/appwrite/api";
import Loader from "@/components/Loader";

// Define the shape of our node data

// const roadmapData = {
//   roadmap_id: "fullstack",
//   title: "Fullstack Development Roadmap",
//   nodes: [
//     {
//       nodeId: "fullstack_node101",
//       title: "HTML & CSS",
//       description:
//         "HTML structures the webpage, and CSS styles it. These two are essential for building any web page.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "HTML Forms",
//           description:
//             "An HTML form is used to collect user input. The user input is most often sent to a server for processing.",
//           type: "article",
//           url: "https://www.w3schools.com/html/html_forms.asp",
//           difficulty: "Intermediate",
//         },
//         {
//           title: "HTML Basics Video",
//           description: "HTML Basics Video",
//           type: "video",
//           url: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
//           difficulty: "easy",
//         },
//         {
//           title: "CSS Basics Tutorial",
//           description: "CSS Basics Tutorial",
//           type: "article",
//           url: "https://www.w3schools.com/css/css_intro.asp",
//           difficulty: "Intermediate",
//         },
//       ],
//       related_node: [
//         {
//           title: "HTML Basics",
//           description:
//             "HTML stands for HyperText Markup Language. It is used on the frontend and gives the structure to the webpage which you can style using CSS and make interactive using JavaScript.",
//           nodeId: "html_basics",
//         },
//       ],
//     },
//     {
//       nodeId: "fullstack_node102",
//       title: "JavaScript",
//       description:
//         "JavaScript is the core scripting language of the web, allowing you to make your webpages interactive.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "JavaScript Introduction",
//           description: "JavaScript Introduction",
//           type: "article",
//           url: "https://www.w3schools.com/js/js_intro.asp",
//           difficulty: "Intermediate",
//         },
//       ],
//       related_node: [],
//     },
//     {
//       nodeId: "fullstack_node103",
//       title: "Responsive Design & CSS Frameworks",
//       description:
//         "Learn about responsive web design and popular CSS frameworks.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Responsive design & CSS Frameworks",
//           description:
//             "Responsive web design (RWD) is a web design approach that renders web pages well on all screen sizes and resolutions while ensuring good usability.",
//           type: "article",
//           url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design",
//           difficulty: "Intermediate",
//         },
//         {
//           title: "Learn Flexbox by Game",
//           description: "A fun way to learn CSS flexbox",
//           type: "docs",
//           url: "https://flexboxfroggy.com",
//           difficulty: "easy",
//         },
//         {
//           title: "TailwindCSS",
//           description: "A utility-first CSS framework",
//           type: "docs",
//           url: "https://tailwindcss.com/",
//           difficulty: "Intermediate",
//         },
//       ],
//       related_node: [],
//     },
//     {
//       nodeId: "fullstack_node104",
//       title: "Version Control (Git & GitHub)",
//       description:
//         "Learn about version control systems and how to use Git and GitHub.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn Git",
//           description: "Comprehensive guide to Git",
//           type: "docs",
//           url: "https://www.atlassian.com/git",
//           difficulty: "easy",
//         },
//         {
//           title: "Learn Git and Github",
//           description: "Video tutorial on Git and GitHub",
//           type: "video",
//           url: "https://youtu.be/RGOj5yH7evk?si=uaSPmrXSgjSFDn8P",
//           difficulty: "Intermediate",
//         },
//       ],
//       related_node: [],
//     },
//     {
//       nodeId: "fullstack_node105",
//       title: "JavaScript Advanced",
//       description:
//         "Dive deeper into JavaScript with advanced concepts and ES6+ features.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn ES6 JavaScript",
//           description: "Video tutorial on ES6 JavaScript features",
//           type: "video",
//           url: "https://youtu.be/nZ1DMMsyVyI?si=K-gu3hNrCMzXI1a9",
//           difficulty: "Intermediate",
//         },
//         {
//           title: "Advance JavaScript",
//           description: "In-depth video on advanced JavaScript concepts",
//           type: "video",
//           url: "https://youtu.be/R9I85RhI7Cg?si=ajHDSsUYfopSbCVP",
//           difficulty: "Intermediate",
//         },
//       ],
//       related_node: [],
//     },
//     {
//       nodeId: "fullstack_node106",
//       title: "Frontend Frameworks",
//       description:
//         "Explore popular frontend frameworks like React, Vue, and Angular.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn Reactjs",
//           description: "Comprehensive React.js tutorial",
//           type: "video",
//           url: "https://youtu.be/bMknfKXIFA8?si=omYli50Utm-3lemC",
//           difficulty: "easy",
//         },
//         {
//           title: "Learn Vuejs",
//           description: "Vue.js tutorial for beginners",
//           type: "video",
//           url: "https://youtu.be/1GNsWa_EZdw?si=hQ7Kq0nHfqR-f-X9",
//           difficulty: "easy",
//         },
//         {
//           title: "Learn Angularjs in 2 hours",
//           description: "Quick Angular.js tutorial",
//           type: "video",
//           url: "https://youtu.be/k5E2AVpwsko?si=9eJ7ecKHqzmsIn-x",
//           difficulty: "Intermediate",
//         },
//       ],
//       related_node: [],
//     },
//   ],
// };

const nodeColor = (node: Node) => {
  switch (node.type) {
    case "input":
      return "#6366f1";
    case "default":
      return "#22c55e";
    case "output":
      return "#ef4444";
    default:
      return "#64748b";
  }
};

const ResourceIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case "article":
      return <Book className="w-4 h-4" />;
    case "video":
      return <FileVideo className="w-4 h-4" />;
    case "docs":
      return <Code className="w-4 h-4" />;
    default:
      return <Link className="w-4 h-4" />;
  }
};

export default function page() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
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

  if (loading) {
    return <Loader loading={loading} />;
  }

  const onConnect = (params: any) => {
    if (roadmapData?.title) {
      setEdges((eds) => addEdge(params, eds));
    }
  };

  useEffect(() => {
    if (!roadmapData) return;

    // Map roadmapData to nodes
    const newNodes: Node[] = roadmapData.nodes.map(
      (node: any, index: number) => ({
        id: node.nodeId,
        type:
          index === 0
            ? "input"
            : index === roadmapData.nodes.length - 1
            ? "output"
            : "default",
        data: { label: node.title, ...node },
        position: { x: 250 * (index % 3), y: 100 * Math.floor(index / 3) },
      })
    );

    // Map newNodes to edges
    const newEdges: Edge[] = [];
    for (let i = 0; i < newNodes.length - 1; i++) {
      newEdges.push({
        id: `e${newNodes[i].id}-${newNodes[i + 1].id}`,
        source: newNodes[i].id,
        target: newNodes[i + 1].id,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    }

    // Use state setters outside of conditionals
    setNodes(newNodes);
    setEdges(newEdges);
  }, [roadmapData]); // Only depends on roadmapData

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as NodeData);
  }, []);

  return (
    <div className="w-full h-screen flex">
      <div className="w-2/3 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      <div className="w-1/3 h-full p-4 bg-background border-l">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{roadmapData?.title}</CardTitle>
            <CardDescription>Click on a node to view details</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                  <h3 className="text-lg font-semibold">
                    {selectedNode.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedNode.description}
                  </p>
                  {selectedNode.related_node.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold">Related Topics:</h4>
                      <ul className="list-disc list-inside mt-2">
                        {selectedNode.related_node.map((related) => (
                          <li key={related.nodeId} className="text-sm">
                            {related.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="resources">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {selectedNode.resources.map((resource, index) => (
                      <Card key={index} className="mb-4">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <ResourceIcon type={resource.type} />
                            {resource.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {resource.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <Badge variant="secondary">
                              {resource.difficulty}
                            </Badge>
                            <Button asChild size="sm">
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Open Resource
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-center text-muted-foreground">
                Select a node to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
