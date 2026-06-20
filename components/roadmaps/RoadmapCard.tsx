"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Clock,
  TrendingUp,
  Users,
  BookmarkIcon,
  Heart,
  ArrowRight,
  CheckCircle2,
  Award,
  Loader2,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useLikeRoadmap } from "@/lib/hooks/use-roadmaps";
import { useBookmark } from "@/lib/hooks/use-bookmark";
import { toast } from "sonner";
import axios from "axios";

interface RoadmapCardProps {
  id: string;
  roadmapId: string;
  title: string;
  description?: string;
  difficulty: string;
  estimatedTime: string;
  type: string;
  viewCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
  _count?: {
    nodes?: number;
    likes?: number;
    bookmarks?: number;
  };
}

const difficultyConfig = {
  Beginner: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  Intermediate: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dot: "bg-blue-500",
  },
  Advanced: {
    badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    dot: "bg-orange-500",
  },
  Expert: {
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    dot: "bg-purple-500",
  },
} as const;

const typeConfig: Record<string, { icon: React.ElementType; label: string }> = {
  role: { icon: Users, label: "Role" },
  skill: { icon: Award, label: "Skill" },
  topic: { icon: TrendingUp, label: "Topic" },
};

export default function RoadmapCard({
  id,
  roadmapId,
  title,
  description,
  difficulty,
  estimatedTime,
  type,
  viewCount = 0,
  likeCount = 0,
  bookmarkCount = 0,
  isFeatured = false,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  _count,
}: RoadmapCardProps) {
  const { data: session } = useSession();

  const config =
    difficultyConfig[difficulty as keyof typeof difficultyConfig] ??
    difficultyConfig.Intermediate;
  const typeInfo = typeConfig[type] ?? typeConfig.topic;
  const TypeIcon = typeInfo.icon;
  const nodeCount = _count?.nodes ?? 0;

  const likeMutation = useLikeRoadmap();
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const {
    isBookmarked,
    bookmarkCount: currentBookmarkCount,
    isLoading: bookmarkLoading,
    toggleBookmark,
  } = useBookmark({
    roadmapId,
    initialBookmarked: initialIsBookmarked,
    initialCount: bookmarkCount,
  });

  const handleLike = async () => {
    if (!session) {
      toast.error("Please login to like roadmaps");
      return;
    }
    try {
      if (isLiked) {
        await axios.delete(`/api/roadmaps/${roadmapId}/like`);
        setIsLiked(false);
      } else {
        await axios.post(`/api/roadmaps/${roadmapId}/like`);
        setIsLiked(true);
      }
    } catch {
      toast.error("Failed to update like status");
    }
  };

  const handleBookmark = () => {
    if (!session) {
      toast.error("Please login to bookmark roadmaps");
      return;
    }
    toggleBookmark();
  };

  const fmtCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <div className="relative h-full flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1">

        {/* Featured indicator — gradient top accent bar */}
        {isFeatured && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex flex-col flex-1 p-6 relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Difficulty badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${config.badge} backdrop-blur-sm`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
                {difficulty}
              </span>

              {/* Type badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-border/60 bg-muted/40 text-muted-foreground backdrop-blur-sm">
                <TypeIcon size={11} />
                {typeInfo.label}
              </span>

              {isFeatured && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 backdrop-blur-sm">
                  <Zap size={10} className="fill-amber-500" />
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Title & description */}
          <div className="flex-1 mb-4">
            <h3 className="text-lg font-bold text-foreground leading-snug tracking-tight mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-6 py-3 border-t border-b border-border/60 mb-4 text-[12px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock size={13} className="shrink-0 text-primary" />
              <span className="font-medium">{estimatedTime || "Self-paced"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
              <span className="font-medium">{nodeCount} steps</span>
            </div>
          </div>

          {/* Footer — actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Like */}
              <button
                onClick={handleLike}
                disabled={likeMutation.isPending}
                title={session ? (isLiked ? "Unlike" : "Like") : "Login to like"}
                className={`flex items-center gap-1.5 text-[12px] font-medium transition-all duration-200 disabled:opacity-40 hover:scale-105 ${
                  isLiked
                    ? "text-rose-500"
                    : "text-muted-foreground hover:text-rose-500"
                }`}
              >
                {likeMutation.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Heart
                    size={13}
                    className={isLiked ? "fill-rose-500" : ""}
                  />
                )}
                <span className="font-semibold">{fmtCount(likeCount)}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                title={
                  session
                    ? isBookmarked
                      ? "Remove bookmark"
                      : "Bookmark"
                    : "Login to bookmark"
                }
                className={`flex items-center gap-1.5 text-[12px] font-medium transition-all duration-200 disabled:opacity-40 hover:scale-105 ${
                  isBookmarked
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {bookmarkLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <BookmarkIcon
                    size={13}
                    className={isBookmarked ? "fill-primary" : ""}
                  />
                )}
                <span className="font-semibold">{fmtCount(currentBookmarkCount)}</span>
              </button>
            </div>

            <Link
              href={`/roadmaps/${roadmapId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-[12px] font-semibold transition-all duration-300 group/link hover:shadow-lg hover:shadow-primary/25"
            >
              Start
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover/link:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
