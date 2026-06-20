import Link from "next/link";
import { AppendRoadmap } from "../AppendRoadmap";
import { TrendingUp } from "lucide-react";

const skillBasedRoadmaps = [
  {
    id: "react",
    title: "React",
    description: "Everything you need to know about React and its ecosystem",
    difficulty: "Intermediate",
    duration: "2–4 months",
    category: "Frontend Framework",
    learners: "156K+",
    rating: 4.9,
  },
  {
    id: "nodejs",
    title: "Node.js",
    description: "Complete guide to Node.js for backend development",
    difficulty: "Intermediate",
    duration: "3–5 months",
    category: "Backend Runtime",
    learners: "0",
    rating: 4.7,
  },
  {
    id: "typescript",
    title: "TypeScript",
    description: "Learn TypeScript to write better JavaScript applications",
    difficulty: "Intermediate",
    duration: "1–3 months",
    category: "Programming Language",
    learners: "0",
    rating: 4.8,
  },
  {
    id: "docker",
    title: "Docker",
    description: "Containerization with Docker for modern applications",
    difficulty: "Intermediate",
    duration: "2–3 months",
    category: "DevOps Tool",
    learners: "0",
    rating: 4.6,
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    description: "Container orchestration with Kubernetes",
    difficulty: "Advanced",
    duration: "4–6 months",
    category: "DevOps Tool",
    learners: "0",
    rating: 4.5,
  },
  {
    id: "aws",
    title: "AWS",
    description: "Amazon Web Services cloud platform essentials",
    difficulty: "Intermediate",
    duration: "3–6 months",
    category: "Cloud Platform",
    learners: "0",
    rating: 4.7,
  },
  {
    id: "python",
    title: "Python",
    description: "Complete Python programming language guide",
    difficulty: "Beginner",
    duration: "2–4 months",
    category: "Programming Language",
    learners: "0",
    rating: 4.8,
  },
  {
    id: "sql",
    title: "SQL",
    description: "Database querying and management with SQL",
    difficulty: "Beginner",
    duration: "1–2 months",
    category: "Database",
    learners: "0",
    rating: 4.6,
  },
  {
    id: "mongodb",
    title: "MongoDB",
    description: "NoSQL database development with MongoDB",
    difficulty: "Intermediate",
    duration: "2–3 months",
    category: "Database",
    learners: "0",
    rating: 4.5,
  },
];

export default function SkillBased() {
  return (
    <div className="py-10">
      {/* Section header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Skill-Based Roadmaps
          </h2>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed ml-0.5">
          Deep dive into specific technologies and level up your expertise.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillBasedRoadmaps.map((roadmap) => (
          <AppendRoadmap roadmap={roadmap} key={roadmap.id} />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border/40">
        <p className="text-[13px] text-muted-foreground">
          Don&apos;t see the skill you&apos;re looking for?{" "}
          <Link href="/suggest" className="text-primary hover:underline font-medium">
            Suggest a new roadmap
          </Link>
        </p>
      </div>
    </div>
  );
}
