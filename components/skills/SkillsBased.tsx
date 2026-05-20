import Link from "next/link";
import { AppendRoadmap } from "../AppendRoadmap";
import { TrendingUp } from "lucide-react";

const skillBasedRoadmaps = [
  {
    id: "react",
    title: "React",
    description: "Everything you need to know about React and its ecosystem",
    difficulty: "Intermediate",
    duration: "2-4 months",
    category: "Frontend Framework",
    learners: "156K+",
    rating: 4.9,
  },
  {
    id: "nodejs",
    title: "Node.js",
    description: "Complete guide to Node.js for backend development",
    difficulty: "Intermediate",
    duration: "3-5 months",
    category: "Backend Runtime",
    learners: "0",
    rating: 4.7,
  },
  {
    id: "typescript",
    title: "TypeScript",
    description: "Learn TypeScript to write better JavaScript applications",
    difficulty: "Intermediate",
    duration: "1-3 months",
    category: "Programming Language",
    learners: "0",
    rating: 4.8,
  },
  {
    id: "docker",
    title: "Docker",
    description: "Containerization with Docker for modern applications",
    difficulty: "Intermediate",
    duration: "2-3 months",
    category: "DevOps Tool",
    learners: "0",
    rating: 4.6,
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    description: "Container orchestration with Kubernetes",
    difficulty: "Advanced",
    duration: "4-6 months",
    category: "DevOps Tool",
    learners: "0",
    rating: 4.5,
  },
  {
    id: "aws",
    title: "AWS",
    description: "Amazon Web Services cloud platform essentials",
    difficulty: "Intermediate",
    duration: "3-6 months",
    category: "Cloud Platform",
    learners: "0",
    rating: 4.7,
  },
  {
    id: "python",
    title: "Python",
    description: "Complete Python programming language guide",
    difficulty: "Beginner",
    duration: "2-4 months",
    category: "Programming Language",
    learners: "0",
    rating: 4.8,
  },
  {
    id: "sql",
    title: "SQL",
    description: "Database querying and management with SQL",
    difficulty: "Beginner",
    duration: "1-2 months",
    category: "Database",
    learners: "0",
    rating: 4.6,
  },
  {
    id: "mongodb",
    title: "MongoDB",
    description: "NoSQL database development with MongoDB",
    difficulty: "Intermediate",
    duration: "2-3 months",
    category: "Database",
    learners: "0",
    rating: 4.5,
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

export default function SkillBased() {
  return (
    <div className="py-12 relative overflow-hidden">
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <TrendingUp className="w-6 h-6 text-primary dark:text-blue-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Skill-Based Roadmaps</h2>
        </div>
        <p className="text-muted-foreground text-lg ml-1 leading-relaxed">
          Deep dive into specific technologies and level up your expertise.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillBasedRoadmaps.map(
          (roadmap) => (
            <AppendRoadmap
              roadmap={roadmap}
              getDifficultyColor={getDifficultyColor}
              key={roadmap.id}
            />
          )
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
          //     <div>
          //       <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
          //         {roadmap.category}
          //       </span>
          //     </div>

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
          //         Start Learning
          //         <ArrowRight className="ml-2 h-4 w-4" />
          //       </Link>
          //     </Button>
          //   </CardContent>
          // </Card>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Don't see the skill you're looking for?{" "}
          <Link href="/suggest" className="text-primary hover:underline">
            Suggest a new roadmap
          </Link>
        </p>
      </div>
    </div>
  );
}
