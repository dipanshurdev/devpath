import { Clock, Users, Star, Link, ArrowRight, Construction } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";

type Props = {
  getDifficultyColor?: (difficulty: string) => string;
  roadmap: any;
};

export const AppendRoadmap = ({ roadmap, getDifficultyColor }: Props) => {
  return (
    <Card
      key={roadmap.id}
      className="roadmap-card group  outline-none border-none text-primaryWhite hover:text-primaryBlue bg-foregroundDark"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="group-hover:text-primaryBlue transition-colors">
              {roadmap.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {getDifficultyColor && (
                <Badge className={getDifficultyColor(roadmap.difficulty)}>
                  {roadmap.difficulty}
                </Badge>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {roadmap.duration}
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-2 text-primaryWhite">
          {roadmap.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
            {roadmap.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            {roadmap.learners} learners
          </div>
          <div className="flex items-center">
            <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            {roadmap.rating}
          </div>
        </div>

        <Button className="w-full cursor-wait" >
          {/* <Link href={`/roadmap/${roadmap.id}`}>
            Start Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link> */}
          <Construction className="mr-2 h-4 w-4" />
          <span>Coming Soon</span>
        </Button>
      </CardContent>
    </Card>
  );
};
