"use client";

import Link from "next/link";
import { Clock, CheckCircle2, Heart, BookmarkIcon, Loader2, ArrowRight, Users, Award, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLikeRoadmap } from "@/lib/hooks/use-roadmaps";
import { useBookmark } from "@/lib/hooks/use-bookmark";
import { toast } from "sonner";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

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

const difficultyDot: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-blue-500",
  Advanced: "bg-orange-500",
  Expert: "bg-purple-500",
};

const difficultyText: Record<string, string> = {
  Beginner: "text-emerald-600 dark:text-emerald-400",
  Intermediate: "text-blue-600 dark:text-blue-400",
  Advanced: "text-orange-600 dark:text-orange-400",
  Expert: "text-purple-600 dark:text-purple-400",
};

const fmtCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

export default function RoadmapCard({
  id,
  roadmapId,
  title,
  description,
  difficulty,
  estimatedTime,
  type,
  likeCount = 0,
  bookmarkCount = 0,
  isFeatured = false,
  isLiked: initialIsLiked = false,
  isBookmarked: initialIsBookmarked = false,
  _count,
}: RoadmapCardProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const likeMutation = useLikeRoadmap();
  const nodeCount = _count?.nodes || 0;

  const {
    isBookmarked,
    isLiked,
    bookmarkCount: currentBookmarkCount,
    isLoading: bookmarkLoading,
    toggleBookmark,
  } = useBookmark({
    roadmapId,
    initialBookmarked: initialIsBookmarked,
    initialLiked: initialIsLiked,
    initialCount: bookmarkCount,
  });

  const handleLike = async () => {
    if (!session) { toast.error("Please sign in to like roadmaps"); return; }
    try {
      if (isLiked) {
        await axios.delete(`/api/roadmaps/${roadmapId}/like`);
        queryClient.setQueryData(["bookmark", roadmapId], (old: any) => ({ ...old, isLiked: false }));
      } else {
        await axios.post(`/api/roadmaps/${roadmapId}/like`);
        queryClient.setQueryData(["bookmark", roadmapId], (old: any) => ({ ...old, isLiked: true }));
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  const handleBookmark = () => {
    if (!session) { toast.error("Please sign in to bookmark roadmaps"); return; }
    toggleBookmark();
  };

  const TypeIcon = type === "role" ? Users : type === "skill" ? Award : TrendingUp;
  const dotClass = difficultyDot[difficulty] ?? "bg-blue-500";
  const textClass = difficultyText[difficulty] ?? "text-blue-600 dark:text-blue-400";

  return (
    <div className="group relative flex flex-col bg-card border-b border-r border-border/60 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors">
      {/* Featured strip */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-px bg-primary" />
      )}

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Badge row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Difficulty dot + label */}
            <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${textClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
              {difficulty}
            </div>
            <span className="text-border/60 dark:text-zinc-700 select-none">·</span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <TypeIcon size={10} />
              {type}
            </div>
          </div>
          {isFeatured && (
            <span className="text-[9px] font-semibold uppercase tracking-widest text-primary">
              Trending
            </span>
          )}
        </div>

        {/* Title & description */}
        <div className="flex-1 space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground dark:text-white leading-snug tracking-tight group-hover:text-primary transition-colors duration-150 line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 border-t border-border/60 dark:border-zinc-800 pt-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {estimatedTime || "Self-paced"}
          </span>
          {nodeCount > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle2 size={11} />
              {nodeCount} steps
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className={`flex items-center gap-1 text-[11px] font-medium transition-colors disabled:opacity-40 ${
                isLiked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
              }`}
            >
              {likeMutation.isPending ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Heart size={12} className={isLiked ? "fill-rose-500" : ""} />
              )}
              {fmtCount(likeCount)}
            </button>

            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center gap-1 text-[11px] font-medium transition-colors disabled:opacity-40 ${
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {bookmarkLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <BookmarkIcon size={12} className={isBookmarked ? "fill-primary" : ""} />
              )}
              {fmtCount(currentBookmarkCount)}
            </button>
          </div>

          <Link
            href={`/roadmaps/${roadmapId}`}
            className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-foreground dark:text-white hover:text-primary dark:hover:text-primary transition-colors group/cta"
          >
            Start
            <ArrowRight size={11} className="group-hover/cta:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
