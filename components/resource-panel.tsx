"use client";

import React from "react";
import { ExternalLink, FileText, Play, BookOpen, Gamepad2 } from "lucide-react";
import type { Resource } from "@/lib/roadmap-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResourcePanelProps {
  node: any;
}

export function ResourcePanel({ node }: ResourcePanelProps) {
  const resourceTypeIcons = {
    video: Play,
    article: FileText,
    documentation: BookOpen,
    course: BookOpen,
    game: Gamepad2,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "intermediate":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case "advanced":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 fade-in">
        <h3 className="text-2xl font-bold">{node?.title}</h3>
        <p className="text-muted-foreground mt-2">{node?.description}</p>

        <div className="flex items-center gap-2 mt-4">
          <Badge
            variant={node?.status === "completed" ? "default" : "outline"}
            className={
              node?.status === "completed" ? "bg-green-500 text-white" : ""
            }
          >
            {node?.status === "completed"
              ? "Completed"
              : node?.status === "current"
              ? "Current"
              : "Not Started"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {node?.type}
          </Badge>
        </div>

        {node?.status !== "completed" && (
          <Button className="mt-4 gradient-bg hover:opacity-90 transition-opacity">
            Mark as Completed
          </Button>
        )}

        {node?.resources && node?.resources.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold">Learning Resources</h4>
            <div className="grid gap-4 stagger-fade-in">
              {node?.resources.map((resource: Resource) => (
                <Card
                  key={"randomID"}
                  className="hover-lift glass-card gradient-border"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {resourceTypeIcons[resource.type] && (
                          <div className="rounded-full bg-primary/10 p-1 border border-primary/20">
                            {React.createElement(
                              resourceTypeIcons[resource.type],
                              {
                                className: "h-4 w-4 text-primary",
                              }
                            )}
                          </div>
                        )}
                        <CardTitle className="text-base">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className={getDifficultyColor("easy")}
                      >
                        {resource.difficulty}
                      </Badge>
                    </div>
                    {resource.description && (
                      <CardDescription>{resource?.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{"Dev"}</Badge>
                      <Button
                        asChild
                        size="sm"
                        className="gap-1 gradient-bg hover:opacity-90 transition-opacity"
                      >
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-muted-foreground text-center">
              No resources available for this topic yet.
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
