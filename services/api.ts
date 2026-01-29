// import type { Roadmap } from "@/types/index"

// // This would be replaced with actual API calls to your backend
// export async function fetchRoadmap(id: string): Promise<Roadmap> {
//   // For now, we'll simulate an API call with a delay
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(mockRoadmapData)
//     }, 500)
//   })
// }

// export async function saveRoadmap(roadmapId: string, userId: string): Promise<boolean> {
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true)
//     }, 500)
//   })
// }

// export async function likeRoadmap(roadmapId: string, userId: string): Promise<boolean> {
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true)
//     }, 500)
//   })
// }

// export async function markNodeAsCompleted(roadmapId: string, nodeId: string, userId: string): Promise<boolean> {
//   // Simulate API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true)
//     }, 500)
//   })
// }

// // Mock data based on the provided JSON structure
// const mockRoadmapData: Roadmap = {
//   $id: "671fd87d0002abbed856",
//   roadmap_id: "frontend",
//   title: "Frontend",
//   description: "Roadmap for Frontend Developers",
//   difficulty: "Intermediate",
//   estimated_time_to_finish: "3-6 months",
//   type: "role",
//   inConstruction: false,
//   $createdAt: "2024-10-28T18:31:25.270+00:00",
//   $updatedAt: "2025-04-10T14:21:46.185+00:00",
//   $permissions: [],
//   creator: null,
//   savedBy: [
//     {
//       $id: "67f57125001764d1d869",
//       $createdAt: "2025-04-08T18:55:33.895+00:00",
//       $updatedAt: "2025-04-08T18:55:33.895+00:00",
//       $permissions: [
//         'read("user:67e4d5ed00159896e1f0")',
//         'update("user:67e4d5ed00159896e1f0")',
//         'delete("user:67e4d5ed00159896e1f0")',
//       ],
//       user: {
//         $id: "67e4d5ee001ad4ac4347",
//         accountId: "67e4d5ed00159896e1f0",
//         name: "User_Name",
//         email: "user@gmail.com",
//         username: "user_name",
//         imageId: null,
//         bio: null,
//         imageUrl:
//           "https://cloud.appwrite.io/v1/avatars/initials?name=User_Name&project=6713db6600030e21eb99&name=User_Name&project=6713db6600030e21eb99",
//         $createdAt: "2025-03-27T04:37:05.796+00:00",
//         $updatedAt: "2025-04-02T17:27:50.257+00:00",
//         $permissions: [],
//       },
//     },
//   ],
//   nodes: [
//     {
//       $id: "671fd8e60025a1405a9c",
//       nodeId: "node_101",
//       title: "HTML Basics",
//       description: "Introduction to HTML structure and tags.",
//       type: "checkpoint",
//       resources: [
//         {
//           $id: "671fe2d900305f450cd1",
//           title: "HTML Beginner Guide",
//           description: "HTML Beginner Guide",
//           type: "article",
//           url: "https://blog.hubspot.com/website/html",
//           difficulty: "Intermediate",
//           tag: "article",
//         },
//         {
//           $id: "671fe3370018128d74b1",
//           title: "HTML Basics Video",
//           description: "HTML Basics Video",
//           type: "video",
//           url: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
//           difficulty: "easy",
//           tag: "video",
//         },
//       ],
//       related_node: [],
//     },
//     {
//       $id: "6720af4e00120d7609aa",
//       nodeId: "node_102",
//       title: "CSS Basics",
//       description: "Learn the basics of CSS and how to style HTML.",
//       type: "checkpoint",
//       resources: [
//         {
//           $id: "6720b0870000d80b1bc3",
//           title: "CSS Basics Tutorial",
//           description: "CSS Basics Tutorial",
//           type: "article",
//           url: "https://www.w3schools.com/css/css_intro.asp",
//           difficulty: "Intermediate",
//           tag: "article",
//         },
//         {
//           $id: "6727bb7e002749508d08",
//           title: "Learn Flexbox by Game",
//           description: null,
//           type: "game",
//           url: "https://flexboxfroggy.com",
//           difficulty: "easy",
//           tag: "game",
//         },
//       ],
//       related_node: [],
//     },
//     {
//       $id: "6720af9b0028ec1096d4",
//       nodeId: "node_103",
//       title: "JavaScript Basics",
//       description: "Get started with JavaScript programming.",
//       type: "checkpoint",
//       resources: [
//         {
//           $id: "6720b0d3002642d663bb",
//           title: "JavaScript Introduction",
//           description: "JavaScript Introduction",
//           type: "article",
//           url: "https://www.w3schools.com/js/js_intro.asp",
//           difficulty: "Intermediate",
//           tag: "article",
//         },
//         {
//           $id: "6727c63f000ec07639c0",
//           title: "Advance JavaScript",
//           description: null,
//           type: "video",
//           url: "https://youtu.be/R9I85RhI7Cg?si=ajHDSsUYfopSbCVP",
//           difficulty: "Advanced",
//           tag: "video",
//         },
//       ],
//       related_node: [],
//     },
//   ],
//   comments: [],
//   liked_users: [
//     {
//       $id: "67e4d5ee001ad4ac4347",
//       accountId: "67e4d5ed00159896e1f0",
//       name: "User_Name",
//       email: "user@gmail.com",
//       username: "user_name",
//       imageId: null,
//       bio: null,
//       imageUrl:
//         "https://cloud.appwrite.io/v1/avatars/initials?name=User_Name&project=6713db6600030e21eb99&name=User_Name&project=6713db6600030e21eb99",
//       $createdAt: "2025-03-27T04:37:05.796+00:00",
//       $updatedAt: "2025-04-02T17:27:50.257+00:00",
//       $permissions: [],
//     },
//   ],
// }
