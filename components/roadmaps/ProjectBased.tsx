import { AppendRoadmap } from "../AppendRoadmap";

const projectBasedRoadmaps = [
  { id: "ecommerce-app", title: "E-commerce Application", description: "Build a full-stack e-commerce platform with modern technologies", difficulty: "Advanced", duration: "8–12 weeks", technologies: ["React", "Node.js", "MongoDB", "Stripe"], learners: "45K+", rating: 4.8, projects: 5 },
  { id: "social-media-app", title: "Social Media Platform", description: "Create a social media application with real-time features", difficulty: "Advanced", duration: "10–14 weeks", technologies: ["Next.js", "PostgreSQL", "Socket.io", "AWS"], learners: "38K+", rating: 4.7, projects: 6 },
  { id: "task-management", title: "Task Management Tool", description: "Build a collaborative task management application", difficulty: "Intermediate", duration: "6–8 weeks", technologies: ["Vue.js", "Express", "MySQL", "Docker"], learners: "52K+", rating: 4.6, projects: 4 },
  { id: "blog-platform", title: "Blog Publishing Platform", description: "Create a modern blog platform with CMS capabilities", difficulty: "Intermediate", duration: "4–6 weeks", technologies: ["React", "Strapi", "GraphQL", "Vercel"], learners: "67K+", rating: 4.5 },
  { id: "chat-application", title: "Real-time Chat App", description: "Build a real-time messaging application", difficulty: "Intermediate", duration: "3–5 weeks", technologies: ["React", "Socket.io", "Node.js", "Redis"], learners: "78K+", rating: 4.7, projects: 3 },
  { id: "portfolio-website", title: "Developer Portfolio", description: "Create a professional developer portfolio website", difficulty: "Beginner", duration: "2–3 weeks", technologies: ["HTML", "CSS", "JavaScript", "Netlify"], learners: "123K+", rating: 4.4, projects: 2 },
];

export default function ProjectBased() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
        {projectBasedRoadmaps.map((roadmap) => (
          <AppendRoadmap roadmap={roadmap} key={roadmap.id} />
        ))}
      </div>
      <div className="mt-5 border-t border-border/60 dark:border-zinc-800 pt-4">
        <p className="text-xs text-muted-foreground">
          Have a project idea?{" "}
          <a href="mailto:dipanshurdev@gmail.com" className="text-primary hover:underline underline-offset-2">
            Suggest a project
          </a>
        </p>
      </div>
    </div>
  );
}
