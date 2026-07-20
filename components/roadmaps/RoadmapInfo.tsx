"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp, Share2, Clock, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "../ui/progress";
import toast from "react-hot-toast";

interface RoadmapInfoProps {
  roadmap: {
    title: string;
    description?: string;
    difficulty?: string;
    estimatedTime?: string;
    type?: string;
    viewCount?: number;
    _count?: {
      nodes?: number;
    };
  };
  completedNodeIds: string[];
  progress: number;
}

export default function RoadmapInfo({
  roadmap,
  progress,
  completedNodeIds,
}: RoadmapInfoProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const shouldShowToggle = (roadmap?.description?.length || 0) > 200;
  const displayDescription =
    isExpanded || !shouldShowToggle
      ? roadmap?.description
      : `${roadmap?.description?.slice(0, 200)}...`;

  const shareRoadmap = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: roadmap?.title,
          text: roadmap?.description,
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const totalNodes = roadmap?._count?.nodes || 0;
  const completedNodes = completedNodeIds.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/60 dark:border-zinc-800 rounded-none p-8 mb-8 w-full"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-4 leading-tight">
            {roadmap?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {roadmap?.difficulty && (
              <span className="px-3 py-1.5 bg-secondary text-muted-foreground text-xs font-semibold uppercase tracking-wider border border-border/60 dark:border-zinc-700">
                {roadmap.difficulty}
              </span>
            )}
            {roadmap?.type && (
              <span className="px-3 py-1.5 bg-secondary text-muted-foreground text-xs font-semibold uppercase tracking-wider border border-border/60 dark:border-zinc-700">
                {roadmap.type}
              </span>
            )}
            {roadmap?.estimatedTime && (
              <span className="px-3 py-1.5 bg-secondary text-muted-foreground text-xs font-semibold uppercase tracking-wider border border-border/60 dark:border-zinc-700 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {roadmap.estimatedTime}
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={shareRoadmap}
          variant="outline"
          size="sm"
          className="rounded-none h-9 text-xs font-semibold uppercase tracking-wider"
        >
          <Share2 className="w-3.5 h-3.5 mr-2" />
          Share
        </Button>
      </div>

      {/* Description */}
      {roadmap?.description && (
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : "auto" }}
          transition={{ duration: 0.3 }}
          className="mb-6 pb-6 border-b border-border/60 dark:border-zinc-800"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {displayDescription}
          </p>
          {shouldShowToggle && (
            <button
              className="mt-3 text-xs font-semibold text-primary hover:underline transition-colors flex items-center gap-1.5"
              onClick={toggleExpand}
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Read full overview <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </motion.div>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-8 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Steps
          </span>
          <span className="text-sm font-bold text-foreground dark:text-white">
            {totalNodes}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Completed
          </span>
          <span className="text-sm font-bold text-foreground dark:text-white">
            {completedNodes}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Progress
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Learning Progress
          </span>
          <span className="text-xs font-bold text-foreground dark:text-white">
            {completedNodes} / {totalNodes} steps
          </span>
        </div>
        <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
