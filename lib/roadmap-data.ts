export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: "video" | "article" | "documentation" | "course" | "game";
  url: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export interface NodeData {
  id: string;
  title: string;
  description?: string;
  type?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  position: { x: number; y: number };
  resources?: Resource[];
  prerequisites?: string[];
  nextSteps?: string[];
  resourceCount?: number;
}

export interface Connection {
  from: string;
  to: string;
}

export interface RoadmapData {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  learners: string;
  nodes: NodeData[];
  connections: Connection[];
}

export const frontendRoadmapData: RoadmapData = {
  id: "frontend",
  title: "Frontend Developer",
  description:
    "Step by step guide to becoming a modern frontend developer in 2024",
  category: "Role-based",
  duration: "3-6 months",
  learners: "125K+",
  nodes: [
    {
      id: "start",
      title: "Start Here",
      description: "Begin your frontend development journey",
      type: "Starting Point",
      position: { x: 600, y: 50 },
      resources: [
        {
          id: "1",
          title: "What is Frontend Development?",
          description: "Introduction to frontend development",
          type: "article",
          url: "https://example.com",
          difficulty: "Beginner",
        },
      ],
      resourceCount: 1,
    },
    {
      id: "html-basics",
      title: "HTML Basics",
      description: "Learn the structure of web pages",
      type: "Fundamental",
      difficulty: "Beginner",
      position: { x: 250, y: 300 },
      resources: [
        {
          id: "2",
          title: "HTML Crash Course",
          description: "Complete HTML tutorial for beginners",
          type: "video",
          url: "https://example.com",
          difficulty: "Beginner",
        },
        {
          id: "3",
          title: "HTML Documentation",
          description: "Official HTML documentation",
          type: "documentation",
          url: "https://example.com",
          difficulty: "Beginner",
        },
      ],
      prerequisites: ["Basic computer knowledge"],
      nextSteps: [
        "Learn CSS for styling",
        "Practice building simple web pages",
      ],
      resourceCount: 2,
    },
    {
      id: "css-basics",
      title: "CSS Basics",
      description: "Style your web pages with CSS",
      type: "Fundamental",
      difficulty: "Beginner",
      position: { x: 700, y: 300 },
      resources: [
        {
          id: "4",
          title: "CSS Complete Course",
          description: "Learn CSS from scratch",
          type: "video",
          url: "https://example.com",
          difficulty: "Beginner",
        },
        {
          id: "5",
          title: "Flexbox Froggy",
          description: "Learn CSS Flexbox through games",
          type: "game",
          url: "https://flexboxfroggy.com",
          difficulty: "Beginner",
        },
      ],
      prerequisites: ["HTML Basics"],
      nextSteps: ["Learn CSS Grid", "Practice responsive design"],
      resourceCount: 2,
    },
    {
      id: "javascript-basics",
      title: "JavaScript Basics",
      description: "Add interactivity to your websites",
      type: "Programming Language",
      difficulty: "Intermediate",
      position: { x: 500, y: 400 },
      resources: [
        {
          id: "6",
          title: "JavaScript Fundamentals",
          description: "Complete JavaScript course",
          type: "video",
          url: "https://example.com",
          difficulty: "Intermediate",
        },
        {
          id: "7",
          title: "JavaScript.info",
          description: "Modern JavaScript tutorial",
          type: "documentation",
          url: "https://javascript.info",
          difficulty: "Intermediate",
        },
      ],
      prerequisites: ["HTML Basics", "CSS Basics"],
      nextSteps: ["Learn DOM manipulation", "Practice with projects"],
      resourceCount: 2,
    },
    {
      id: "responsive-design",
      title: "Responsive Design",
      description: "Make websites work on all devices",
      type: "Design Concept",
      difficulty: "Intermediate",
      position: { x: 250, y: 700 },
      resources: [
        {
          id: "8",
          title: "Responsive Web Design",
          description: "Learn responsive design principles",
          type: "article",
          url: "https://example.com",
          difficulty: "Intermediate",
        },
      ],
      prerequisites: ["CSS Basics"],
      nextSteps: ["Learn CSS Grid", "Practice mobile-first design"],
      resourceCount: 1,
    },
    {
      id: "version-control",
      title: "Version Control (Git)",
      description: "Track changes in your code",
      type: "Tool",
      difficulty: "Beginner",
      position: { x: 750, y: 600 },
      resources: [
        {
          id: "9",
          title: "Git Crash Course",
          description: "Learn Git and GitHub",
          type: "video",
          url: "https://example.com",
          difficulty: "Beginner",
        },
      ],
      prerequisites: ["Basic programming knowledge"],
      nextSteps: ["Learn GitHub", "Practice with repositories"],
      resourceCount: 1,
    },
    {
      id: "react-basics",
      title: "React Basics",
      description: "Learn the popular JavaScript library",
      type: "Framework",
      difficulty: "Intermediate",
      position: { x: 500, y: 750 },
      resources: [
        {
          id: "10",
          title: "React Official Tutorial",
          description: "Learn React from the official docs",
          type: "documentation",
          url: "https://react.dev",
          difficulty: "Intermediate",
        },
        {
          id: "11",
          title: "React Crash Course",
          description: "Complete React tutorial",
          type: "video",
          url: "https://example.com",
          difficulty: "Intermediate",
        },
      ],
      prerequisites: ["JavaScript Basics", "ES6+ features"],
      nextSteps: ["Learn React Hooks", "Build React projects"],
      resourceCount: 2,
    },
    {
      id: "build-tools",
      title: "Build Tools",
      description: "Webpack, Vite, and other build tools",
      type: "Tooling",
      difficulty: "Advanced",
      position: { x: 300, y: 900 },
      resources: [
        {
          id: "12",
          title: "Webpack Guide",
          description: "Learn module bundling",
          type: "documentation",
          url: "https://example.com",
          difficulty: "Advanced",
        },
      ],
      prerequisites: ["JavaScript Basics", "Node.js basics"],
      nextSteps: ["Learn Vite", "Configure build pipelines"],
      resourceCount: 1,
    },
    {
      id: "testing",
      title: "Testing",
      description: "Test your applications",
      type: "Quality Assurance",
      difficulty: "Advanced",
      position: { x: 700, y: 900 },
      resources: [
        {
          id: "13",
          title: "Jest Testing Framework",
          description: "Learn JavaScript testing",
          type: "documentation",
          url: "https://example.com",
          difficulty: "Advanced",
        },
      ],
      prerequisites: ["JavaScript Basics", "React Basics"],
      nextSteps: ["Learn React Testing Library", "Write integration tests"],
      resourceCount: 1,
    },
  ],
  connections: [
    { from: "start", to: "html-basics" },
    { from: "start", to: "css-basics" },
    { from: "html-basics", to: "javascript-basics" },
    { from: "css-basics", to: "javascript-basics" },
    { from: "css-basics", to: "responsive-design" },
    { from: "javascript-basics", to: "version-control" },
    { from: "javascript-basics", to: "react-basics" },
    { from: "responsive-design", to: "react-basics" },
    { from: "version-control", to: "react-basics" },
    { from: "react-basics", to: "build-tools" },
    { from: "react-basics", to: "testing" },
  ],
};

const reactRoadmapData: RoadmapData = {
  id: "react",
  title: "React",
  description: "Everything you need to know about React and its ecosystem",
  category: "Skill-based",
  duration: "2-4 months",
  learners: "156K+",
  nodes: [
    {
      id: "prerequisites",
      title: "Prerequisites",
      description: "What you need to know before React",
      type: "Starting Point",
      position: { x: 500, y: 150 },
      resources: [
        {
          id: "1",
          title: "JavaScript ES6+ Features",
          description: "Modern JavaScript features for React",
          type: "article",
          url: "https://example.com",
          difficulty: "Intermediate",
        },
      ],
      resourceCount: 1,
    },
    {
      id: "react-fundamentals",
      title: "React Fundamentals",
      description: "Core React concepts",
      type: "Core Concept",
      difficulty: "Beginner",
      position: { x: 500, y: 300 },
      resources: [
        {
          id: "2",
          title: "React Official Tutorial",
          description: "Learn React basics",
          type: "documentation",
          url: "https://react.dev",
          difficulty: "Beginner",
        },
      ],
      resourceCount: 1,
    },
    {
      id: "jsx",
      title: "JSX",
      description: "JavaScript XML syntax",
      type: "Syntax",
      difficulty: "Beginner",
      position: { x: 300, y: 550 },
      resources: [
        {
          id: "3",
          title: "JSX Introduction",
          description: "Learn JSX syntax",
          type: "documentation",
          url: "https://example.com",
          difficulty: "Beginner",
        },
      ],
      resourceCount: 1,
    },
    {
      id: "components",
      title: "Components",
      description: "Building blocks of React",
      type: "Core Concept",
      difficulty: "Beginner",
      position: { x: 700, y: 450 },
      resources: [
        {
          id: "4",
          title: "React Components Guide",
          description: "Learn about React components",
          type: "documentation",
          url: "https://example.com",
          difficulty: "Beginner",
        },
      ],
      resourceCount: 1,
    },
    {
      id: "hooks",
      title: "React Hooks",
      description: "useState, useEffect, and more",
      type: "Core Concept",
      difficulty: "Intermediate",
      position: { x: 500, y: 600 },
      resources: [
        {
          id: "5",
          title: "React Hooks Guide",
          description: "Complete guide to React Hooks",
          type: "documentation",
          url: "https://example.com",
          difficulty: "Intermediate",
        },
      ],
      resourceCount: 1,
    },
  ],
  connections: [
    { from: "prerequisites", to: "react-fundamentals" },
    { from: "react-fundamentals", to: "jsx" },
    { from: "react-fundamentals", to: "components" },
    { from: "jsx", to: "hooks" },
    { from: "components", to: "hooks" },
  ],
};

const roadmapDatabase: Record<string, RoadmapData> = {
  frontend: frontendRoadmapData,
  react: reactRoadmapData,
  // Add more roadmaps here
};

export function getRoadmapData(id: string): RoadmapData | null {
  return roadmapDatabase[id] || null;
}
