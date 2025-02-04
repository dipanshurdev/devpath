"use client";

import { Models } from "appwrite";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Book,
  ChevronDown,
  ChevronUp,
  Code,
  FileVideo,
  Folder,
  Gamepad,
  LinkIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Progress } from "../ui/progress";

const getResourceIcon = (type: string) => {
  switch (type) {
    case "article":
      return <Book className="w-4 h-4" />;
    case "video":
      return <FileVideo className="w-4 h-4" />;
    case "docs":
      return <Folder className="w-4 h-4" />;
    case "game":
      return <Gamepad className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
};

export default function NodeDetails({
  node,
  isCompleted,
  onComplete,
}: {
  node: Models.Document;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  console.log({ isCompleted, onComplete });

  const [expandedResources, setExpandedResources] = useState<Set<number>>(
    new Set()
  );
  const [completedResources, setCompletedResources] = useState<Set<number>>(
    new Set()
  );
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleResourceExpansion = (index: number) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleResourceCompletion = (index: number) => {
    setCompletedResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const completionPercentage =
    (completedResources.size / node.resources.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-primaryWhite">
        {node.title}
      </h2>

      <p className="text-light text-justify">
        {!node.description || expanded || node?.description?.length <= 150
          ? node?.description
          : `${node?.description?.slice(0, 150)}...`}
      </p>
      {node?.description?.length > 100 && node?.title && (
        <Button
          variant="dropDown"
          className="px-0  text-sm font-medium text-primaryBlue  hover:text-blue-600 "
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <span className="flex w-full items-center justify-between gap-2 text-base">
              Show Less <ChevronUp />
            </span>
          ) : (
            <span className="flex w-full items-center justify-between gap-2 text-base">
              Show More <ChevronDown />
            </span>
          )}
        </Button>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2 text-primaryWhite">
          Resources
        </h3>
        <Progress value={completionPercentage} className="mb-4" />
        <p className="text-sm text-light dark:text-gray-400 mb-4">
          {completedResources.size} of {node.resources.length} resources
          completed
        </p>
        {node.resources.length > 0 ? (
          <ul className="space-y-4">
            {node.resources.map((resource: Models.Document, index: number) => (
              <ResourceCard
                key={index}
                resource={resource}
                index={index}
                isExpanded={expandedResources.has(index)}
                isCompleted={completedResources.has(index)}
                onToggleExpand={() => toggleResourceExpansion(index)}
                onToggleComplete={() => toggleResourceCompletion(index)}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No resources available for this topic.
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ResourceCard({
  resource,
  index,
  isExpanded,
  isCompleted,
  onToggleExpand,
  onToggleComplete,
}: {
  resource: Models.Document;
  index: number;
  isExpanded: boolean;
  isCompleted: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
}) {
  const shouldShowToggle = resource?.description?.length > 150;
  const displayDescription =
    isExpanded || !shouldShowToggle
      ? resource?.description
      : `${resource?.description?.slice(0, 150)}...`;

  return (
    <Card
      className={`mb-2 ${
        isCompleted ? "bg-darkLight text-primaryWhite" : "bg-primaryWhite "
      }`}
    >
      <CardHeader className="p-4 flex flex-row justify-between items-start w-full">
        <CardTitle className="text-sm py-2 flex items-center justify-center gap-2">
          {getResourceIcon(resource.type)}
          {resource.title}
        </CardTitle>
        <Button
          variant="secondary"
          size="sm"
          className="bg-none"
          onClick={onToggleComplete}
        >
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="text-xs">
          {displayDescription}
        </CardDescription>
        {shouldShowToggle && (
          <Button
            variant="ghost"
            className="px-0 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <span className="flex items-center gap-2">
                Show Less <ChevronUp className="w-4 h-4" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Show More <ChevronDown className="w-4 h-4" />
              </span>
            )}
          </Button>
        )}
        <div className="flex justify-between items-center mt-2">
          <Badge
            variant="secondary"
            className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {resource.difficulty}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Open
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
