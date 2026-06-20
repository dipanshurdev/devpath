import Link from "next/link";
import { AppendRoadmap } from "../AppendRoadmap";
import { Sparkles } from "lucide-react";

const projectBasedRoadmaps = [
  {
    id: "ecommerce-app",
    title: "E-commerce Application",
    description: "Build a full-stack e-commerce platform with modern technologies",
    difficulty: "Advanced",
    duration: "8–12 weeks",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    learners: "45K+",
    rating: 4.8,
    projects: 5,
  },
  {
    id: "social-media-app",
    title: "Social Media Platform",
    description: "Create a social media application with real-time features",
    difficulty: "Advanced",
    duration: "10–14 weeks",
    technologies: ["Next.js", "PostgreSQL", "Socket.io", "AWS"],
    learners: "38K+",
    rating: 4.7,
    projects: 6,
  },
  {
    id: "task-management",
    title: "Task Management Tool",
    description: "Build a collaborative task management application",
    difficulty: "Intermediate",
    duration: "6–8 weeks",
    technologies: ["Vue.js", "Express", "MySQL", "Docker"],
    learners: "52K+",
    rating: 4.6,
    projects: 4,
  },
  {
    id: "blog-platform",
    title: "Blog Publishing Platform",
    description: "Create a modern blog platform with CMS capabilities",
    difficulty: "Intermediate",
    duration: "4–6 weeks",
    technologies: ["React", "Strapi", "GraphQL", "Vercel"],
    learners: "67K+",
    rating: 4.5,
  },
  {
    id: "chat-application",
    title: "Real-time Chat App",
    description: "Build a real-time messaging application",
    difficulty: "Intermediate",
    duration: "3–5 weeks",
    technologies: ["React", "Socket.io", "Node.js", "Redis"],
    learners: "78K+",
    rating: 4.7,
    projects: 3,
  },
  {
    id: "portfolio-website",
    title: "Developer Portfolio",
    description: "Create a professional developer portfolio website",
    difficulty: "Beginner",
    duration: "2–3 weeks",
    technologies: ["HTML", "CSS", "JavaScript", "Netlify"],
    learners: "123K+",
    rating: 4.4,
    projects: 2,
  },
];

export default function ProjectBased() {
  return (
    <div className="py-10">
      {/* Section header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Project-Based Roadmaps
          </h2>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed ml-0.5">
          Learn by building real-world applications from scratch.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projectBasedRoadmaps.map((roadmap) => (
          <AppendRoadmap roadmap={roadmap} key={roadmap.id} />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border/40">
        <p className="text-[13px] text-muted-foreground">
          Have an idea for a project roadmap?{" "}
          <a
            href="mailto:dipanshurdev@gmail.com"
            className="text-primary hover:underline font-medium"
          >
            Suggest a new project
          </a>
        </p>
      </div>
    </div>
  );
}
