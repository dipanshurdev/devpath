import Link from "next/link";
import { AppendRoadmap } from "../AppendRoadmap";

const skillBasedRoadmaps = [
  { id: "react", title: "React", description: "Everything you need to know about React and its ecosystem", difficulty: "Intermediate", duration: "2–4 months", category: "Frontend Framework", learners: "156K+", rating: 4.9 },
  { id: "nodejs", title: "Node.js", description: "Complete guide to Node.js for backend development", difficulty: "Intermediate", duration: "3–5 months", category: "Backend Runtime", learners: "0", rating: 4.7 },
  { id: "typescript", title: "TypeScript", description: "Learn TypeScript to write better JavaScript applications", difficulty: "Intermediate", duration: "1–3 months", category: "Programming Language", learners: "0", rating: 4.8 },
  { id: "docker", title: "Docker", description: "Containerization with Docker for modern applications", difficulty: "Intermediate", duration: "2–3 months", category: "DevOps Tool", learners: "0", rating: 4.6 },
  { id: "kubernetes", title: "Kubernetes", description: "Container orchestration with Kubernetes", difficulty: "Advanced", duration: "4–6 months", category: "DevOps Tool", learners: "0", rating: 4.5 },
  { id: "aws", title: "AWS", description: "Amazon Web Services cloud platform essentials", difficulty: "Intermediate", duration: "3–6 months", category: "Cloud Platform", learners: "0", rating: 4.7 },
  { id: "python", title: "Python", description: "Complete Python programming language guide", difficulty: "Beginner", duration: "2–4 months", category: "Programming Language", learners: "0", rating: 4.8 },
  { id: "sql", title: "SQL", description: "Database querying and management with SQL", difficulty: "Beginner", duration: "1–2 months", category: "Database", learners: "0", rating: 4.6 },
  { id: "mongodb", title: "MongoDB", description: "NoSQL database development with MongoDB", difficulty: "Intermediate", duration: "2–3 months", category: "Database", learners: "0", rating: 4.5 },
];

export default function SkillBased() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
        {skillBasedRoadmaps.map((roadmap) => (
          <AppendRoadmap roadmap={roadmap} key={roadmap.id} />
        ))}
      </div>
      <div className="mt-5 border-t border-border/60 dark:border-zinc-800 pt-4">
        <p className="text-xs text-muted-foreground">
          Don&apos;t see what you need?{" "}
          <Link href="/suggest" className="text-primary hover:underline underline-offset-2">
            Suggest a roadmap
          </Link>
        </p>
      </div>
    </div>
  );
}
