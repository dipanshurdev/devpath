// "use client";

// import { useState, useCallback, useMemo, useEffect } from "react";
// import ReactFlow, {
//   Node,
//   Edge,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MarkerType,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { NodeData } from "@/types/index";

// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Book, Code, FileVideo, Link } from "lucide-react";
// import { useParams } from "next/navigation";
// import { Models } from "appwrite";
// import { getRoadmapById } from "@/lib/appwrite/api";
// import Loader from "@/components/Loader";

// const nodeColor = (node: Node) => {
//   switch (node.type) {
//     case "input":
//       return "#6366f1";
//     case "default":
//       return "#22c55e";
//     case "output":
//       return "#ef4444";
//     default:
//       return "#64748b";
//   }
// };

// const ResourceIcon = ({ type }: { type: string }) => {
//   switch (type.toLowerCase()) {
//     case "article":
//       return <Book className="w-4 h-4" />;
//     case "video":
//       return <FileVideo className="w-4 h-4" />;
//     case "docs":
//       return <Code className="w-4 h-4" />;
//     default:
//       return <Link className="w-4 h-4" />;
//   }
// };

// export default function page() {
//   const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
//   const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
//   const { roadmapId } = useParams();
//   const [roadmapData, setRoadmapData] = useState<Models.Document | null>(null);
//   const [loading, setLoading] = useState(true);

//   const fetchRoadmap = useCallback(async (id: string) => {
//     setLoading(true);
//     try {
//       const fetchedRoadmap = await getRoadmapById(id);
//       setRoadmapData(fetchedRoadmap);
//     } catch (error) {
//       console.error("Error fetching roadmap:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (roadmapId) {
//       fetchRoadmap(roadmapId as string);
//     }
//   }, [roadmapId, fetchRoadmap]);

//   if (loading) {
//     return <Loader loading={loading} />;
//   }

//   const generateFlowData = useCallback(() => {
//     if (!roadmapData || !roadmapData.nodes)
//       return {
//         newNodes: [],
//         newEdges: [],
//       };

//     const newNodes: Node[] = roadmapData.nodes.map(
//       (node: any, index: number) => ({
//         id: node.nodeId,
//         type:
//           index === 0
//             ? "input"
//             : index === roadmapData.nodes.length - 1
//             ? "output"
//             : "default",
//         data: { label: node.title, ...node },
//         position: { x: 250 * (index % 3), y: 100 * Math.floor(index / 3) },
//       })
//     );

//     // Map newNodes to edges
//     //  Edge[] = []
//     const newEdges: Edge[] = newNodes.slice(0, -1).map((node, i) => ({
//       id: `e${node.id}-${newNodes[i + 1].id}`,
//       source: node.id,
//       target: newNodes[i + 1].id,
//       type: "smoothstep",
//       animated: true,
//       markerEnd: { type: MarkerType.ArrowClosed },
//     }));

//     // for (let i = 0; i < newNodes.length - 1; i++) {
//     //   newEdges.push({
//     //     id: `e${newNodes[i].id}-${newNodes[i + 1].id}`,
//     //     source: newNodes[i].id,
//     //     target: newNodes[i + 1].id,
//     //     type: "smoothstep",
//     //     animated: true,
//     //     markerEnd: {
//     //       type: MarkerType.ArrowClosed,
//     //     },
//     //   });
//     // }

//     // Use state setters outside of conditionals
//     // setNodes(newNodes);
//     // setEdges(newEdges);
//     return { newNodes, newEdges };
//   }, [roadmapData]);

//   useEffect(() => {
//     if (roadmapData?.title) {
//       const { newNodes, newEdges } = generateFlowData();
//       setNodes(newNodes);
//       setEdges(newEdges);
//     }
//   }, [generateFlowData, roadmapData, setNodes, setEdges]);

//   const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
//     setSelectedNode(node.data as NodeData);
//   }, []);

//   const onConnect = useCallback((params: any) => {
//     // if (roadmapData?.title) {
//     setEdges((eds) => addEdge(params, eds));
//     // }
//   }, []);

//   return (
//     <div className="w-full h-screen flex">
//       <div className="w-2/3 h-full">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           fitView
//           attributionPosition="bottom-left"
//         >
//           <Controls />
//           <Background color="#aaa" gap={16} />
//         </ReactFlow>
//       </div>
//       <div className="w-1/3 h-full p-4 bg-background border-l">
//         <Card className="h-full">
//           <CardHeader>
//             <CardTitle>{roadmapData?.title}</CardTitle>
//             <CardDescription>Click on a node to view details</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {selectedNode ? (
//               <Tabs defaultValue="info" className="w-full">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="info">Info</TabsTrigger>
//                   <TabsTrigger value="resources">Resources</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="info">
//                   <h3 className="text-lg font-semibold">
//                     {selectedNode.title}
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-2">
//                     {selectedNode.description}
//                   </p>
//                   {selectedNode.related_node.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="text-sm font-semibold">Related Topics:</h4>
//                       <ul className="list-disc list-inside mt-2">
//                         {selectedNode.related_node.map((related) => (
//                           <li key={related.nodeId} className="text-sm">
//                             {related.title}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </TabsContent>
//                 <TabsContent value="resources">
//                   <ScrollArea className="h-[calc(100vh-300px)]">
//                     {selectedNode.resources.map((resource, index) => (
//                       <Card key={index} className="mb-4">
//                         <CardHeader>
//                           <CardTitle className="text-base flex items-center gap-2">
//                             <ResourceIcon type={resource.type} />
//                             {resource.title}
//                           </CardTitle>
//                           <CardDescription className="text-xs">
//                             {resource.description}
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="flex justify-between items-center">
//                             <Badge variant="secondary">
//                               {resource.difficulty}
//                             </Badge>
//                             <Button asChild size="sm">
//                               <a
//                                 href={resource.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                               >
//                                 Open Resource
//                               </a>
//                             </Button>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </ScrollArea>
//                 </TabsContent>
//               </Tabs>
//             ) : (
//               <p className="text-center text-muted-foreground">
//                 Select a node to view details
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// =================================================

// const exampleRoadmapData = {
//   roadmap_id: "fullstack",
//   title: "Fullstack Development",
//   description: "A comprehensive roadmap for fullstack development",
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
//     },
//     {
//       nodeId: "fullstack_node103",
//       title: "Responsive Design & CSS Frameworks",
//       description:
//         "Learn to create responsive layouts and utilize CSS frameworks for efficient styling.",
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
//       ],
//     },
//     {
//       nodeId: "fullstack_node104",
//       title: "Version Control (Git & GitHub)",
//       description:
//         "Learn to manage and track changes in your code using Git and collaborate using GitHub.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn Git",
//           description: "Comprehensive guide to Git version control",
//           type: "docs",
//           url: "https://www.atlassian.com/git",
//           difficulty: "easy",
//         },
//       ],
//     },
//     {
//       nodeId: "fullstack_node105",
//       title: "JavaScript Advanced",
//       description:
//         "Dive deeper into JavaScript, exploring advanced concepts and modern features.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn ES6 JavaScript",
//           description: "Modern JavaScript features and syntax",
//           type: "video",
//           url: "https://youtu.be/nZ1DMMsyVyI?si=K-gu3hNrCMzXI1a9",
//           difficulty: "Intermediate",
//         },
//       ],
//     },
//     {
//       nodeId: "fullstack_node106",
//       title: "Frontend Frameworks",
//       description:
//         "Explore popular frontend frameworks like React, Vue, or Angular.",
//       type: "checkpoint",
//       resources: [
//         {
//           title: "Learn Reactjs",
//           description: "Comprehensive React.js course",
//           type: "video",
//           url: "https://youtu.be/bMknfKXIFA8?si=omYli50Utm-3lemC",
//           difficulty: "easy",
//         },
//       ],
//     },
//   ],
// };

// const nodeWidth = 250;
// const nodeHeight = 80;

// function getResourceIcon(type: string) {
//   switch (type) {
//     case "article":
//       return <Book className="w-4 h-4" />;
//     case "video":
//       return <FileVideo className="w-4 h-4" />;
//     case "docs":
//       return <Folder className="w-4 h-4" />;
//     default:
//       return <Code className="w-4 h-4" />;
//   }
// }

// const ResourceCard = ({ resource }: any) => (
//   <Card className="mb-2">
//     <CardHeader className="p-4">
//       <CardTitle className="text-sm flex items-center gap-2">
//         {getResourceIcon(resource.type)}
//         {resource.title}
//       </CardTitle>
//     </CardHeader>
//     <CardContent className="p-4 pt-0">
//       <CardDescription className="text-xs">
//         {resource.description}
//       </CardDescription>
//       <div className="flex justify-between items-center mt-2">
//         <Badge variant="secondary" className="text-xs">
//           {resource.difficulty}
//         </Badge>
//         <Button variant="outline" size="sm" className="h-8" asChild>
//           <a href={resource.url} target="_blank" rel="noopener noreferrer">
//             <LinkIcon className="w-4 h-4 mr-2" />
//             Open
//           </a>
//         </Button>
//       </div>
//     </CardContent>
//   </Card>
// );

// const CustomNode = ({ data }: any) => (
//   <motion.div
//     initial={{ scale: 0.5, opacity: 0 }}
//     animate={{ scale: 1, opacity: 1 }}
//     transition={{ duration: 0.3 }}
//     className="bg-card text-card-foreground rounded-full border shadow-sm p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow"
//     style={{ width: nodeWidth, height: nodeHeight }}
//   >
//     <h3 className="font-semibold text-sm">{data.title}</h3>
//   </motion.div>
// );

// export default function AnimatedRoadmap() {
//   const params = useParams();
//   // const { data: roadmapData, error } = useSWR(
//   //   params.roadmapId ? `/api/roadmaps/${params.roadmapId}` : null,
//   //   fetcher
//   // );

//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selectedNode, setSelectedNode] = useState<any>(null);

//   const onConnect = useCallback(
//     (params: any) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const onNodeClick = useCallback(({ _, node }: any) => {
//     setSelectedNode(node);
//   }, []);

//   const nodeTypes = useMemo(() => ({ checkpoint: CustomNode }), []);

//   useMemo(() => {
//     if (exampleRoadmapData) {
//       // const data = roadmapData || exampleRoadmapData;
//       const data = exampleRoadmapData;
//       const newNodes: Node[] = data.nodes.map(({ node, index }: any) => ({
//         id: node?.nodeId,
//         data: { ...node },
//         position: { x: index % 2 === 0 ? 100 : 400, y: index * 200 },
//         type: "checkpoint",
//       }));

//       const newEdges: Edge[] = data.nodes
//         .slice(0, -1)
//         .map(({ node, index }: any) => ({
//           id: `e${node?.nodeId}-${data.nodes[index + 1]?.nodeId}`,
//           source: node?.nodeId,
//           target: data.nodes[index + 1]?.nodeId,
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 3 },
//           type: "smoothstep",
//           markerEnd: {
//             type: MarkerType.ArrowClosed,
//             color: "#6366f1",
//           },
//         }));

//       setNodes(newNodes);
//       setEdges(newEdges);
//     }
//   }, [setNodes, setEdges]);

//   // if (error) return <div>Failed to load roadmap</div>;
//   // if (!roadmapData && !error) return <div>Loading...</div>;

//   // const data = roadmapData || exampleRoadmapData;
//   const data = exampleRoadmapData;

//   return (
//     <div className="w-full h-screen flex flex-col md:flex-row">
//       <div className="flex-1 h-[70vh] md:h-full relative">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           nodeTypes={nodeTypes}
//           fitView
//           minZoom={0.5}
//           maxZoom={1.5}
//           attributionPosition="bottom-left"
//         >
//           <Background color="#6366f1" gap={16} />
//           <Controls />
//         </ReactFlow>
//       </div>
//       <AnimatePresence>
//         {selectedNode && (
//           <motion.div
//             initial={{ x: 300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 300, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="w-full md:w-96 bg-background border-t md:border-l p-4 overflow-auto relative"
//           >
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute top-2 right-2"
//               onClick={() => setSelectedNode(null)}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//             <h3 className="text-lg font-semibold mb-2">
//               {selectedNode.data.title}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               {selectedNode.data.description}
//             </p>
//             <h4 className="text-md font-semibold mb-2">Resources:</h4>
//             <ScrollArea className="h-[calc(100vh-200px)]">
//               {selectedNode.data.resources.map(({ resource, index }: any) => (
//                 <ResourceCard key={index} resource={resource} />
//               ))}
//             </ScrollArea>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// ===================================================================================================

// "use client";

// import { useState, useCallback, useMemo, useEffect } from "react";
// import { useParams } from "next/navigation";
// // import useSWR from "swr";
// import ReactFlow, {
//   Node,
//   Edge,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MarkerType,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Book, Code, FileVideo, Folder, LinkIcon, X } from "lucide-react";
// import { getRoadmapById } from "@/lib/appwrite/api";
// import { Models } from "appwrite";
// import fullstack from "@/lib/data/fullstack.json";
// import frontend from "@/lib/data/frontend.json";
// import backend from "@/lib/data/backend.json";

// // const fetcher = (url) => fetch(url).then((res) => res.json())

// // const exampleRoadmapData = {
// //   roadmap_id: "fullstack",
// //   title: "Fullstack Development",
// //   description: "A comprehensive roadmap for fullstack development",
// //   nodes: [
// //     {
// //       nodeId: "fullstack_node101",
// //       title: "HTML & CSS",
// //       description:
// //         "HTML structures the webpage, and CSS styles it. These two are essential for building any web page.",
// //       type: "checkpoint",
// //       resources: [
// //         {
// //           title: "HTML Forms",
// //           description:
// //             "An HTML form is used to collect user input. The user input is most often sent to a server for processing.",
// //           type: "article",
// //           url: "https://www.w3schools.com/html/html_forms.asp",
// //           difficulty: "Intermediate",
// //         },
// //         {
// //           title: "HTML Basics Video",
// //           description: "HTML Basics Video",
// //           type: "video",
// //           url: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
// //           difficulty: "easy",
// //         },
// //       ],
// //     },
// //     {
// //       nodeId: "fullstack_node102",
// //       title: "JavaScript",
// //       description:
// //         "JavaScript is the core scripting language of the web, allowing you to make your webpages interactive.",
// //       type: "checkpoint",
// //       resources: [
// //         {
// //           title: "JavaScript Introduction",
// //           description: "JavaScript Introduction",
// //           type: "article",
// //           url: "https://www.w3schools.com/js/js_intro.asp",
// //           difficulty: "Intermediate",
// //         },
// //       ],
// //     },
// //     {
// //       nodeId: "fullstack_node103",
// //       title: "Responsive Design & CSS Frameworks",
// //       description:
// //         "Learn to create responsive layouts and utilize CSS frameworks for efficient styling.",
// //       type: "checkpoint",
// //       resources: [
// //         {
// //           title: "Responsive design & CSS Frameworks",
// //           description:
// //             "Responsive web design (RWD) is a web design approach that renders web pages well on all screen sizes and resolutions while ensuring good usability.",
// //           type: "article",
// //           url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design",
// //           difficulty: "Intermediate",
// //         },
// //       ],
// //     },
// //     {
// //       nodeId: "fullstack_node104",
// //       title: "Version Control (Git & GitHub)",
// //       description:
// //         "Learn to manage and track changes in your code using Git and collaborate using GitHub.",
// //       type: "checkpoint",
// //       resources: [
// //         {
// //           title: "Learn Git",
// //           description: "Comprehensive guide to Git version control",
// //           type: "docs",
// //           url: "https://www.atlassian.com/git",
// //           difficulty: "easy",
// //         },
// //       ],
// //     },
// //     {
// //       nodeId: "fullstack_node105",
// //       title: "JavaScript Advanced",
// //       description:
// //         "Dive deeper into JavaScript, exploring advanced concepts and modern features.",
// //       type: "checkpoint",
// //       resources: [
// //         {
// //           title: "Learn ES6 JavaScript",
// //           description: "Modern JavaScript features and syntax",
// //           type: "video",
// //           url: "https://youtu.be/nZ1DMMsyVyI?si=K-gu3hNrCMzXI1a9",
// //           difficulty: "Intermediate",
// //         },
// //       ],
// //     },
// //     {
// //       nodeId: "fullstack_node106",
// //       title: "Frontend Frameworks",
// //       description:
// //         "Explore popular frontend frameworks like React, Vue, or Angular.",
// //       type: "checkpoint",
// //       resources: [
// //         {
// //           title: "Learn Reactjs",
// //           description: "Comprehensive React.js course",
// //           type: "video",
// //           url: "https://youtu.be/bMknfKXIFA8?si=omYli50Utm-3lemC",
// //           difficulty: "easy",
// //         },
// //       ],
// //     },
// //   ],
// // };

// const nodeWidth = 250;
// const nodeHeight = 80;

// function getResourceIcon(type: string) {
//   switch (type) {
//     case "article":
//       return <Book className="w-4 h-4" />;
//     case "video":
//       return <FileVideo className="w-4 h-4" />;
//     case "docs":
//       return <Folder className="w-4 h-4" />;
//     default:
//       return <Code className="w-4 h-4" />;
//   }
// }

// const ResourceCard = ({ resource }: any) => (
//   <Card className="mb-2">
//     <CardHeader className="p-4">
//       <CardTitle className="text-sm flex items-center gap-2">
//         {getResourceIcon(resource.type)}
//         {resource.title}
//       </CardTitle>
//     </CardHeader>
//     <CardContent className="p-4 pt-0">
//       <CardDescription className="text-xs">
//         {resource.description}
//       </CardDescription>
//       <div className="flex justify-between items-center mt-2">
//         <Badge variant="secondary" className="text-xs">
//           {resource.difficulty}
//         </Badge>
//         <Button variant="outline" size="sm" className="h-8" asChild>
//           <a href={resource.url} target="_blank" rel="noopener noreferrer">
//             <LinkIcon className="w-4 h-4 mr-2" />
//             Open
//           </a>
//         </Button>
//       </div>
//     </CardContent>
//   </Card>
// );

// const CustomNode = ({ data }: any) => (
//   <motion.div
//     initial={{ scale: 0.5, opacity: 0 }}
//     animate={{ scale: 1, opacity: 1 }}
//     transition={{ duration: 0.3 }}
//     className="bg-card text-card-foreground rounded-full border shadow-sm p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow"
//     style={{ width: nodeWidth, height: nodeHeight }}
//   >
//     <h3 className="font-semibold text-sm">{data.title}</h3>
//   </motion.div>
// );

// export default function page() {
//   const params = useParams();
//   const { roadmapId } = params;
//   // const { data: roadmapData, error } = useSWR(
//   // params.roadmapId ? `/api/roadmaps/${params.roadmapId}` : null,
//   // fetcher
//   // )

//   console.log(roadmapId, typeof roadmapId);

//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [roadmapData, setRoadmapData] = useState<Models.Document | null>();
//   const [selectedNode, setSelectedNode] = useState<any | null>(null);
//   const [exampleRoadmapData, setExampleRoadmapData] =
//     useState<Models.Document | null>(frontend);

//   // const fetchRoadmap = async (id: string) => {
//   //   // setLoading(true);
//   //   try {
//   //     const fetchedRoadmap = await getRoadmapById(id);
//   //     setRoadmapData(fetchedRoadmap);
//   //   } catch (error) {
//   //     console.error("Error fetching roadmap:", error);
//   //   }
//   //   // finally {
//   //   //   setLoading(false);
//   //   // }
//   // };

//   // useEffect(() => {
//   //   fetchRoadmap(roadmapId as string);
//   // }, []);

//   const onConnect = useCallback(
//     (params: any) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const onNodeClick = useCallback(({ _, node }: any) => {
//     setSelectedNode(node);
//   }, []);

//   const nodeTypes = useMemo(() => ({ checkpoint: CustomNode }), []);

//   const setParamsData = () => {
//     if (roadmapId === "fullstack") {
//       setExampleRoadmapData(fullstack);
//     } else if (roadmapId === "backend") {
//       setExampleRoadmapData(backend);
//     } else {
//       setExampleRoadmapData(frontend);
//     }
//   };

//   useEffect(() => {
//     setParamsData();
//   }, [roadmapId]);

//   useMemo(() => {
//     if (exampleRoadmapData) {
//       const data = exampleRoadmapData;
//       const newNodes: Node[] = data.nodes.map(({ node, index }: any) => ({
//         id: node?.nodeId,
//         data: { ...node },
//         position: { x: index % 2 === 0 ? 100 : 400, y: index * 200 },
//         type: "checkpoint",
//       }));

//       const newEdges: Edge[] = data.nodes
//         .slice(0, -1)
//         .map(({ node, index }: any) => ({
//           id: `e${node?.nodeId}-${data.nodes[index + 1]?.nodeId}`,
//           source: node?.nodeId,
//           target: data.nodes[index + 1]?.nodeId,
//           animated: true,
//           style: { stroke: "#6366f1", strokeWidth: 3 },
//           type: "smoothstep",
//           markerEnd: {
//             type: MarkerType.ArrowClosed,
//             color: "#6366f1",
//           },
//         }));

//       setNodes(newNodes);
//       setEdges(newEdges);
//     }
//   }, [setNodes, setEdges]);

//   // if (error) return <div>Failed to load roadmap</div>
//   // if (!roadmapData && !error) return <div>Loading...</div>

//   const data = exampleRoadmapData;

//   return (
//     <div className="w-full h-screen flex flex-col md:flex-row">
//       <div className="flex-1 h-[70vh] md:h-full relative">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           nodeTypes={nodeTypes}
//           fitView
//           minZoom={0.5}
//           maxZoom={1.5}
//           attributionPosition="bottom-left"
//         >
//           <Background color="#6366f1" gap={16} />
//           <Controls />
//         </ReactFlow>
//       </div>
//       <AnimatePresence>
//         {selectedNode && (
//           <motion.div
//             initial={{ x: 300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 300, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="w-full md:w-96 bg-background border-t md:border-l p-4 overflow-auto relative"
//           >
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute top-2 right-2"
//               onClick={() => setSelectedNode(null)}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//             <h3 className="text-lg font-semibold mb-2">
//               {selectedNode.data.title}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               {selectedNode.data.description}
//             </p>
//             <h4 className="text-md font-semibold mb-2">Resources:</h4>
//             <ScrollArea className="h-[calc(100vh-200px)]">
//               {selectedNode.data.resources.map(({ resource, index }: any) => (
//                 <ResourceCard key={index} resource={resource} />
//               ))}
//             </ScrollArea>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// =======================================================================================

// "use client";

// import { useState, useCallback, useEffect, useMemo } from "react";
// import { useParams } from "next/navigation";
// import ReactFlow, {
//   Node,
//   Edge,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MarkerType,
//   Connection,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { motion, AnimatePresence, animate } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Book, Code, FileVideo, Folder, LinkIcon, X } from "lucide-react";
// import fullstack from "@/lib/data/fullstack.json";

// // const exampleRoadmapData = {
// //   roadmap_id: "fullstack",
// //   title: "Fullstack Development",
// //   description: "A comprehensive roadmap for fullstack development",
// //   nodes: [
// //     {
// //       nodeId: "fullstack_node101",
// //       title: "HTML & CSS",
// //       description: "HTML structures the webpage, and CSS styles it.",
// //       type: "checkpoint",
// //       resources: [
// //         {
// //           title: "HTML Forms",
// //           description: "An HTML form is used to collect user input.",
// //           type: "article",
// //           url: "https://www.w3schools.com/html/html_forms.asp",
// //           difficulty: "Intermediate",
// //         },
// //       ],
// //     },
// //     {
// //       nodeId: "fullstack_node102",
// //       title: "JavaScript",
// //       description: "JavaScript is the core scripting language of the web.",
// //       type: "checkpoint",
// //       resources: [
// //         {
// //           title: "JavaScript Introduction",
// //           description: "JavaScript Introduction",
// //           type: "article",
// //           url: "https://www.w3schools.com/js/js_intro.asp",
// //           difficulty: "Intermediate",
// //         },
// //       ],
// //     },
// //   ],
// // };

// const nodeWidth = 250;
// const nodeHeight = 80;

// function getResourceIcon(type: string) {
//   switch (type) {
//     case "article":
//       return <Book className="w-4 h-4" />;
//     case "video":
//       return <FileVideo className="w-4 h-4" />;
//     case "docs":
//       return <Folder className="w-4 h-4" />;
//     default:
//       return <Code className="w-4 h-4" />;
//   }
// }

// const ResourceCard = ({ resource }: { resource: any }) => (
//   <Card className="mb-2">
//     <CardHeader className="p-4">
//       <CardTitle className="text-sm flex items-center gap-2">
//         {getResourceIcon(resource.type)}
//         {resource.title}
//       </CardTitle>
//     </CardHeader>
//     <CardContent className="p-4 pt-0">
//       <CardDescription className="text-xs">
//         {resource.description}
//       </CardDescription>
//       <div className="flex justify-between items-center mt-2">
//         <Badge variant="secondary" className="text-xs">
//           {resource.difficulty}
//         </Badge>
//         <Button variant="outline" size="sm" className="h-8" asChild>
//           <a href={resource.url} target="_blank" rel="noopener noreferrer">
//             <LinkIcon className="w-4 h-4 mr-2" />
//             Open
//           </a>
//         </Button>
//       </div>
//     </CardContent>
//   </Card>
// );

// const CustomNode = ({ data }: any) => (
//   <motion.div
//     initial={{ scale: 0.5, opacity: 0 }}
//     animate={{ scale: 1, opacity: 1 }}
//     transition={{ duration: 0.3 }}
//     className="bg-card text-card-foreground rounded-full border shadow-sm p-4 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow"
//     style={{ width: nodeWidth, height: nodeHeight }}
//   >
//     <h3 className="font-semibold text-sm">{data.title}</h3>
//   </motion.div>
// );

// export default function AnimatedRoadmap() {
//   const params = useParams();
//   const [exampleRoadmapData, setExampleRoadmapData] = useState(fullstack);
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selectedNode, setSelectedNode] = useState<any>(null);

//   const onConnect = useCallback(
//     (connection: Connection) => {
//       setEdges((eds) =>
//         addEdge(
//           {
//             ...connection,
//             animated: true,
//             style: { stroke: "#6366f1", strokeWidth: 3 },
//           },
//           eds
//         )
//       );
//     },
//     [setEdges]
//   );

//   const onNodeClick = useCallback((_: any, node: any) => {
//     setSelectedNode(node);
//   }, []);

//   const nodeTypes = useMemo(() => ({ checkpoint: CustomNode }), []);

//   useEffect(() => {
//     if (exampleRoadmapData) {
//       const data = exampleRoadmapData;
//       const newNodes: Node[] = data.nodes.map((node, index) => ({
//         id: node.nodeId,
//         data: node,
//         position: { x: index % 2 === 0 ? 100 : 400, y: index * 200 },
//         type: "checkpoint",
//       }));

//       const newEdges: Edge[] = data.nodes.slice(0, -1).map((node, index) => ({
//         id: `e${node.nodeId}-${data.nodes[index + 1].nodeId}`,
//         source: node.nodeId,
//         target: data.nodes[index + 1].nodeId,
//         animated: true,
//         style: { stroke: "#6366f1", strokeWidth: 3 },
//         type: "smoothstep",
//         markerEnd: {
//           type: MarkerType.ArrowClosed,
//           color: "#6366f1",
//         },
//       }));

//       setNodes(newNodes);
//       setEdges(newEdges);
//     }
//   }, [setNodes, setEdges]);

//   return (
//     <div className="w-full h-screen flex flex-col md:flex-row">
//       <div className="flex-1 h-[70vh] md:h-full relative">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={onNodeClick}
//           nodeTypes={nodeTypes}
//           fitView
//           minZoom={0.5}
//           maxZoom={1.5}
//           attributionPosition="bottom-left"
//         >
//           <Background color="#6366f1" gap={16} />
//           <Controls />
//         </ReactFlow>
//       </div>
//       <AnimatePresence>
//         {selectedNode && (
//           <motion.div
//             initial={{ x: 300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 300, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="w-full md:w-96 bg-background border-t md:border-l p-4 overflow-auto relative"
//           >
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute top-2 right-2"
//               onClick={() => setSelectedNode(null)}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//             <h3 className="text-lg font-semibold mb-2">
//               {selectedNode.data.title}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-4">
//               {selectedNode.data.description}
//             </p>
//             <h4 className="text-md font-semibold mb-2">Resources:</h4>
//             <ScrollArea className="h-[calc(100vh-200px)]">
//               {selectedNode.data.resources.map(
//                 (resource: any, index: number) => (
//                   <ResourceCard key={index} resource={resource} />
//                 )
//               )}
//             </ScrollArea>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

//   const onConnect = useCallback(
//     (connection: Connection) => {
//       setEdges((eds) =>
//         addEdge(
//           {
//             ...connection,
//             animated: true,
//             style: { stroke: "#6366f1", strokeWidth: 3 },
//           },
//           eds
//         )
//       );
//     },
//     [setEdges]
//   );

//   useEffect(() => {
//     if (exampleRoadmapData) {
//       const data = exampleRoadmapData;
//       const newNodes: Node[] = data.nodes.map((node, index) => ({
//         id: node.nodeId,
//         data: node,
//         position: { x: index % 2 === 0 ? 100 : 400, y: index * 200 },
//         type: "checkpoint",
//       }));

//       const newEdges: Edge[] = data.nodes.slice(0, -1).map((node, index) => ({
//         id: `e${node.nodeId}-${data.nodes[index + 1].nodeId}`,
//         source: node.nodeId,
//         target: data.nodes[index + 1].nodeId,
//         animated: true,
//         style: { stroke: "#6366f1", strokeWidth: 3 },
//         type: "smoothstep",
//         markerEnd: {
//           type: MarkerType.ArrowClosed,
//           color: "#6366f1",
//         },
//       }));

//       setNodes(newNodes);
//       setEdges(newEdges);
//     }
//   }, [setNodes, setEdges]);

// ===============================================================================

// "use client";

// import { useState, useCallback, useMemo, useEffect } from "react";
// import { useParams } from "next/navigation";
// import ReactFlow, {
//   Node,
//   Edge,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   MarkerType,
//   Panel,
//   Connection,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// // import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Book,
//   Code,
//   FileVideo,
//   Folder,
//   LinkIcon,
//   X,
//   ZoomIn,
//   ZoomOut,
// } from "lucide-react";
// import { getRoadmapById } from "@/lib/appwrite/api"; // Adjust to the correct path of your api file
// import { Models } from "appwrite";

// // Define Types for TypeScript
// type Resource = {
//   title: string;
//   description?: string;
//   url: string;
//   type: "article" | "video" | "docs";
//   difficulty: "Beginner" | "Intermediate" | "Advanced";
// };

// type RoadmapNode = Node & {
//   data: {
//     title: string;
//     description?: string;
//     resources?: Resource[];
//     type: string;
//   };
// };

// type RoadmapEdge = Edge & {
//   markerEnd: {
//     type: MarkerType;
//     color: string;
//   };
// };

// // Define icon switcher based on resource type
// function getResourceIcon(type: string) {
//   switch (type) {
//     case "article":
//       return <Book className="w-4 h-4" />;
//     case "video":
//       return <FileVideo className="w-4 h-4" />;
//     case "docs":
//       return <Folder className="w-4 h-4" />;
//     default:
//       return <Code className="w-4 h-4" />;
//   }
// }

// // Resource card for each learning resource
// const ResourceCard = ({ resource }: { resource: Resource }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.3 }}
//   >
//     <Card className="mb-4 hover:shadow-lg transition-shadow">
//       <CardHeader className="p-4">
//         <CardTitle className="text-sm flex items-center gap-2">
//           {getResourceIcon(resource.type)}
//           {resource.title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-4 pt-0">
//         <CardDescription className="text-sm mb-3">
//           {resource.description}
//         </CardDescription>
//         <div className="flex justify-between items-center">
//           <Badge
//             variant={
//               resource.difficulty === "Beginner" ? "default" : "secondary"
//             }
//           >
//             {resource.difficulty}
//           </Badge>
//           <Button variant="outline" size="sm" asChild>
//             <a href={resource.url} target="_blank" rel="noopener noreferrer">
//               <LinkIcon className="w-4 h-4 mr-2" />
//               Open Resource
//             </a>
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   </motion.div>
// );

// // Custom node rendering component
// const CustomNode = ({ data }: { data: Models.Document }) => (
//   <motion.div
//     initial={{ scale: 0.5, opacity: 0 }}
//     animate={{ scale: 1, opacity: 1 }}
//     transition={{ duration: 0.5, type: "spring" }}
//     className={`p-4 rounded-full w-full shadow-lg backdrop-blur-sm ${
//       data.type === "group"
//         ? "bg-primary/10 border-primary"
//         : "bg-card/90 border-border"
//     }`}
//   >
//     <div className="flex flex-col gap-1 w-full">
//       <h3 className="font-semibold text-sm">{data.title}</h3>
//       {/* <p className="text-xs text-muted-foreground">{data.description}</p> */}
//       {data.type === "required" && (
//         <Badge variant="secondary" className="self-start mt-1">
//           Required
//         </Badge>
//       )}
//     </div>
//   </motion.div>
// );

// // Main page component
// function Page() {
//   const params = useParams();
//   const { roadmapId } = params;
//   const [nodes, setNodes, onNodesChange] = useNodesState<RoadmapNode[]>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<RoadmapEdge[]>([]);
//   const [selectedNode, setSelectedNode] = useState<Node | null>(null);
//   const [roadmapData, setRoadmapData] = useState<Models.Document | null>();

//   const onConnect = useCallback(
//     (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
//     [setEdges]
//   );

//   const nodeTypes = useMemo(
//     () => ({ default: CustomNode, group: CustomNode, required: CustomNode }),
//     []
//   );

//   useEffect(() => {
//     async function fetchData() {
//       const roadmapDataResponse = await getRoadmapById(roadmapId as string);
//       if (roadmapDataResponse) {
//         const newNodes = roadmapDataResponse.nodes.map(
//           (node: Models.Document, index: number) => ({
//             id: node.nodeId,
//             type: node.type || "default",
//             data: { ...node },
//             position: { x: index % 2 === 0 ? 100 : 400, y: index * 200 },
//           })
//         );

//         const newEdges = roadmapDataResponse.nodes
//           .slice(0, -1)
//           .map((edge: Models.Document) => ({
//             id: `e${edge.source}-${edge.target}`,
//             source: edge.source,
//             target: edge.target,
//             type: "smoothstep",
//             animated: true,
//             style: { stroke: "#1e40af", strokeWidth: 2 },
//             markerEnd: {
//               type: MarkerType.ArrowClosed,
//               color: "#1e40af",
//             },
//           }));

//         setNodes(newNodes);
//         setEdges(newEdges);
//         setRoadmapData(roadmapDataResponse);
//       }
//     }
//     fetchData();
//   }, [roadmapId, setNodes, setEdges]);

//   return (
//     <div className="w-full h-screen flex flex-col md:flex-row mt-12">
//       <div className="flex-1 h-[70vh] md:h-full relative bg-gradient-to-b from-background to-background/50 rounded-md">
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onNodeClick={(_, node) => setSelectedNode(node)}
//           nodeTypes={nodeTypes}
//           draggable={false}
//           fitView
//           minZoom={0.5}
//           maxZoom={1.5}
//           defaultEdgeOptions={{ type: "smoothstep", animated: true }}
//         >
//           <Background color="" gap={16} size={1} />
//           <Controls showInteractive={false} />
//           <Panel
//             position="top-left"
//             className="bg-background/95 p-4 rounded-lg border shadow-lg backdrop-blur-sm"
//           >
//             <h1 className="text-2xl font-bold mb-2 text-primaryBlue capitalize">
//               {roadmapData?.title}
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               {roadmapData?.description}
//             </p>
//           </Panel>
//           <Panel position="bottom-right" className="flex gap-2">
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => window.location.reload()}
//             >
//               <ZoomIn className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => window.location.reload()}
//             >
//               <ZoomOut className="h-4 w-4" />
//             </Button>
//           </Panel>
//         </ReactFlow>
//       </div>

//       <AnimatePresence mode="wait">
//         {selectedNode && (
//           <motion.div
//             initial={{ x: 300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 300, opacity: 0 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="w-full md:w-[400px] bg-background/95 border-t md:border-l p-6 overflow-hidden relative backdrop-blur-sm"
//           >
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute top-4 right-4"
//               onClick={() => setSelectedNode(null)}
//             >
//               <X className="h-4 w-4" />
//             </Button>

//             <div className="mb-6">
//               <h2 className="text-xl font-bold mb-2">
//                 {selectedNode.data.title}
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {selectedNode.data.description}
//               </p>
//             </div>

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Learning Resources</h3>
//               <ScrollArea className="h-[calc(100vh-250px)]">
//                 <div className="pr-4 space-y-4">
//                   {selectedNode.data.resources?.map(
//                     (resource: Resource, index: number) => (
//                       <ResourceCard key={index} resource={resource} />
//                     )
//                   )}
//                 </div>
//               </ScrollArea>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Page;

"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactFlow, {
  Node,
  Edge,
  // Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
  Connection,
  EdgeProps,
  getSmoothStepPath,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
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
// import { Skeleton } from "@/components/ui/skeleton";
import {
  Book,
  Code,
  FileVideo,
  Folder,
  LinkIcon,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { getRoadmapById } from "@/lib/appwrite/api";
import { Models } from "appwrite";

type Resource = {
  title: string;
  description: string;
  url: string;
  type: "article" | "video" | "docs";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

type RoadmapNode = Node & {
  data: {
    title: string;
    description: string;
    resources?: Resource[];
    type: string;
  };
};

type RoadmapEdge = Edge & {
  markerEnd: {
    type: MarkerType;
    color: string;
  };
};

// Define the AnimatedEdge as a custom edge with framer-motion for animation
const AnimatedEdge = (props: EdgeProps) => {
  const edgeColor = "#1D4ED8";
  const [edgePath] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  });

  return (
    <motion.path
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
      fill="none"
      stroke={edgeColor}
      strokeWidth={2}
      d={edgePath}
      markerEnd={`url(#react-flow__arrowclosed)`}
    />
  );
};

const edgeTypes = {
  animated: AnimatedEdge,
};

// CustomNode component for displaying each node's data
const CustomNode = ({ data }: { data: Models.Document }) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, type: "spring" }}
    className={`p-4 rounded-lg border w-full shadow-lg backdrop-blur-sm ${
      data.type === "group"
        ? "bg-primary/10 border-primary"
        : "bg-card/90 border-border"
    }`}
  >
    <div className="flex flex-col gap-1 w-full">
      <h3 className="font-semibold text-sm text-primaryBlue">{data.title}</h3>
      {data.type === "required" && (
        <Badge variant="secondary" className="self-start mt-1">
          Required
        </Badge>
      )}
    </div>
  </motion.div>
);

// Define all possible node types
const nodeTypes = {
  default: CustomNode,
  group: CustomNode,
  required: CustomNode,
  checkpoint: CustomNode, // Added to prevent the error for "checkpoint" type
};

function getResourceIcon(type: string) {
  switch (type) {
    case "article":
      return <Book className="w-4 h-4" />;
    case "video":
      return <FileVideo className="w-4 h-4" />;
    case "docs":
      return <Folder className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
}

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="text-sm flex items-center gap-2 text-primaryDark">
          {getResourceIcon(resource.type)}
          {resource.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="text-sm mb-3">
          {resource.description}
        </CardDescription>
        <div className="flex justify-between items-center">
          <Badge
            variant={
              resource.difficulty === "Beginner" ? "default" : "secondary"
            }
          >
            {resource.difficulty}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <LinkIcon className="w-4 h-4 mr-2" />
              Open Resource
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Page() {
  const params = useParams();
  const roadmapId = params.roadmapId as string;
  const [nodes, setNodes, onNodesChange] = useNodesState<RoadmapNode[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RoadmapEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [roadmapData, setRoadmapData] = useState<Models.Document | null>();

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge({ ...connection, type: "animated", animated: true }, eds)
      ),
    [setEdges]
  );

  useEffect(() => {
    async function fetchData() {
      const roadmapData = await getRoadmapById(roadmapId);
      if (roadmapData) {
        const newNodes = roadmapData.nodes.map(
          (node: Models.Document, index: number) => ({
            id: node.nodeId,
            type: node.type || "default",
            data: {
              ...node,
            },
            position: { x: index % 2 === 0 ? 100 : 400, y: index * 200 },
          })
        );

        const newEdges = roadmapData.nodes.flatMap((node: Models.Document) =>
          node.related_node?.map((relation: Models.Document) => ({
            id: `e${node.nodeId}-${relation.nodeId}`,
            source: node.nodeId,
            target: relation.nodeId,
            type: "animated",
            animated: true,
          }))
        );

        setNodes(newNodes);
        setEdges(newEdges);
        setRoadmapData(roadmapData);
      }
    }
    fetchData();
  }, [roadmapId, setNodes, setEdges]);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-transparent">
      <div className="flex-1 h-[70vh] md:h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNode(node)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          draggable={false}
          fitView
          // minZoom={0.5}
          // maxZoom={1.5}
          defaultEdgeOptions={{ type: "animated" }}
        >
          <Background color="#1D4ED8" gap={16} size={1} />
          {/* <Controls showInteractive={false} /> */}
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
          <Panel position="bottom-right" className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.reload()}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.reload()}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Node Detail Sidebar */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full md:w-[400px] bg-primaryWhite/20 border-t md:border-l p-6 overflow-hidden relative backdrop-blur-sm"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setSelectedNode(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2 text-primaryDark">
                {selectedNode.data.title}
              </h2>
              <p className="text-sm text-muted-foreground text-primaryDark">
                {selectedNode.data.description}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primaryDarkLight">
                Learning Resources
              </h3>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="pr-4 space-y-4">
                  {selectedNode.data.resources?.map(
                    (resource: Resource, index: number) => (
                      <ResourceCard key={index} resource={resource} />
                    )
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
