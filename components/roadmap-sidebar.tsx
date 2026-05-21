"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ExternalLink,
  CheckCircle,
  Circle,
  Play,
  FileText,
  BookOpen,
  Gamepad2,
} from "lucide-react";
import type { NodeData, Resource } from "@/lib/roadmap-data";

interface RoadmapSidebarProps {
  selectedNode: NodeData | null | undefined;
  onNodeComplete: (nodeId: string) => void;
  isCompleted: boolean;
}

export function RoadmapSidebar({
  selectedNode,
  onNodeComplete,
  isCompleted,
}: RoadmapSidebarProps) {
  if (!selectedNode) {
    return (
      <div className="w-80 border-l bg-card p-6 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a topic to view resources</p>
        </div>
      </div>
    );
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play;
      case "article":
        return FileText;
      case "documentation":
        return BookOpen;
      case "game":
        return Gamepad2;
      default:
        return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "border-green-500 text-green-500 bg-green-50 dark:bg-green-950";
      case "Intermediate":
        return "border-yellow-500 text-yellow-500 bg-yellow-50 dark:bg-yellow-950";
      case "Advanced":
        return "border-red-500 text-red-500 bg-red-50 dark:bg-red-950";
      default:
        return "border-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-80 border-l bg-card flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{selectedNode.title}</h2>
            {selectedNode.description && (
              <p className="text-muted-foreground mt-2 text-sm">
                {selectedNode.description}
              </p>
            )}
          </div>
          <Button
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            onClick={() => onNodeComplete(selectedNode.id)}
            className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 mr-2" />
                Mark Complete
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedNode.type && (
            <Badge variant="outline">{selectedNode.type}</Badge>
          )}
          {selectedNode.difficulty && (
            <Badge className={getDifficultyColor(selectedNode.difficulty)}>
              {selectedNode.difficulty}
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {selectedNode.resources && selectedNode.resources.length > 0 ? (
            <>
              <div>
                <h3 className="font-semibold mb-4">Learning Resources</h3>
                <div className="space-y-4">
                  {selectedNode.resources.map((resource: Resource) => {
                    const IconComponent = getResourceIcon(resource.type);
                    return (
                      <Card
                        key={resource.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-primary/10">
                                <IconComponent className="h-4 w-4 text-primary" />
                              </div>
                              <CardTitle className="text-base">
                                {resource.title}
                              </CardTitle>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {resource.type}
                            </Badge>
                          </div>
                          {resource.description && (
                            <CardDescription className="text-sm">
                              {resource.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            {resource.difficulty && (
                              <Badge
                                className={getDifficultyColor(
                                  resource.difficulty
                                )}
                              >
                                {resource.difficulty}
                              </Badge>
                            )}
                            <Button size="sm" asChild>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                Open
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                No resources available yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Resources for this topic are coming soon
              </p>
            </div>
          )}

          {selectedNode.prerequisites &&
            selectedNode.prerequisites.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Prerequisites</h3>
                <div className="space-y-2">
                  {selectedNode.prerequisites.map((prereq, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {prereq}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {selectedNode.nextSteps && selectedNode.nextSteps.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">What&apos;s Next?</h3>
              <div className="space-y-2">
                {selectedNode.nextSteps.map((step, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
