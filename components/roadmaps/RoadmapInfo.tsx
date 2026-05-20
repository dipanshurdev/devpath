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
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 w-full border border-gray-700/50 shadow-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-2">
            {roadmap?.title}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            {roadmap?.difficulty && (
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/30">
                {roadmap.difficulty}
              </span>
            )}
            {roadmap?.type && (
              <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">
                {roadmap.type}
              </span>
            )}
            {roadmap?.estimatedTime && (
              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {roadmap.estimatedTime}
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={shareRoadmap}
          variant="default"
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Description */}
      {roadmap?.description && (
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : "auto" }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-300 leading-relaxed">
            {displayDescription}
          </p>
          {shouldShowToggle && (
            <Button
              variant="ghost"
              className="mt-3 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              onClick={toggleExpand}
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
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Steps</p>
              <p className="text-2xl font-bold text-white">{totalNodes}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-white">{completedNodes}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Progress</p>
              <p className="text-2xl font-bold text-white">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-400">
            Your Learning Progress
          </p>
          <p className="text-sm font-bold text-white">
            {completedNodes} / {totalNodes} steps
          </p>
        </div>
        <div className="relative">
          <Progress 
            value={progress} 
            className="h-3 bg-gray-700/50"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
