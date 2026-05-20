import Link from "next/link";
import { AppendRoadmap } from "../AppendRoadmap";
import { Sparkles } from "lucide-react";

const projectBasedRoadmaps = [
  {
    id: "ecommerce-app",
    title: "E-commerce Application",
    description:
      "Build a full-stack e-commerce platform with modern technologies",
    difficulty: "Advanced",
    duration: "8-12 weeks",
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
    duration: "10-14 weeks",
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
    duration: "6-8 weeks",
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
    duration: "4-6 weeks",
    technologies: ["React", "Strapi", "GraphQL", "Vercel"],
    learners: "67K+",
    rating: 4.5,
  },
  {
    id: "chat-application",
    title: "Real-time Chat App",
    description: "Build a real-time messaging application",
    difficulty: "Intermediate",
    duration: "3-5 weeks",
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
    duration: "2-3 weeks",
    technologies: ["HTML", "CSS", "JavaScript", "Netlify"],
    learners: "123K+",
    rating: 4.4,
    projects: 2,
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function ProjectBased() {
  return (
    <div className="py-12 relative overflow-hidden">
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <Sparkles className="w-6 h-6 text-primary dark:text-blue-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Project-Based Roadmaps</h2>
        </div>
        <p className="text-muted-foreground text-lg ml-1 leading-relaxed">
          Learn by building real-world applications from scratch.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectBasedRoadmaps.map((roadmap) => (
          <AppendRoadmap
            roadmap={roadmap}
            getDifficultyColor={getDifficultyColor}
            key={roadmap.id}
          />
          // <Card key={roadmap.id} className="roadmap-card group">
          //   <CardHeader>
          //     <div className="flex items-start justify-between">
          //       <div className="space-y-1">
          //         <CardTitle className="group-hover:text-primary transition-colors">
          //           {roadmap.title}
          //         </CardTitle>
          //         <div className="flex items-center space-x-2">
          //           <Badge className={getDifficultyColor(roadmap.difficulty)}>
          //             {roadmap.difficulty}
          //           </Badge>
          //           <div className="flex items-center text-sm text-muted-foreground">
          //             <Clock className="mr-1 h-3 w-3" />
          //             {roadmap.duration}
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //     <CardDescription className="line-clamp-2">
          //       {roadmap.description}
          //     </CardDescription>
          //   </CardHeader>

          //   <CardContent className="space-y-4">
          //     <div className="flex flex-wrap gap-1">
          //       {roadmap.technologies.slice(0, 3).map((tech) => (
          //         <span
          //           key={tech}
          //           className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
          //         >
          //           {tech}
          //         </span>
          //       ))}
          //       {roadmap.technologies.length > 3 && (
          //         <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
          //           +{roadmap.technologies.length - 3} more
          //         </span>
          //       )}
          //     </div>

          //     {roadmap.projects && (
          //       <div className="flex items-center text-sm text-muted-foreground">
          //         <Code className="mr-1 h-3 w-3" />
          //         {roadmap.projects} projects included
          //       </div>
          //     )}

          //     <div className="flex items-center justify-between text-sm text-muted-foreground">
          //       <div className="flex items-center">
          //         <Users className="mr-1 h-3 w-3" />
          //         {roadmap.learners} learners
          //       </div>
          //       <div className="flex items-center">
          //         <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
          //         {roadmap.rating}
          //       </div>
          //     </div>

          //     <Button className="w-full" asChild>
          //       <Link href={`/roadmap/${roadmap.id}`}>
          //         Start Building
          //         <ArrowRight className="ml-2 h-4 w-4" />
          //       </Link>
          //     </Button>
          //   </CardContent>
          // </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Have an idea for a project roadmap?{" "}
          <Link href="/suggest" className="text-primary hover:underline">
            Suggest a new project
          </Link>
        </p>
      </div>
    </div>
  );
}
