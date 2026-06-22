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
  Loader2
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

const difficultyColors = {
  Beginner: "from-green-500 to-emerald-600",
  Intermediate: "from-blue-500 to-cyan-600",
  Advanced: "from-orange-500 to-red-600",
  Expert: "from-purple-500 to-pink-600",
};

const difficultyBadgeColors = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Advanced: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Expert: "bg-purple-500/20 text-purple-400 border-purple-500/30",
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
  const badgeClass =
    difficultyBadgeColors[difficulty as keyof typeof difficultyBadgeColors] ||
    difficultyBadgeColors.Intermediate;
  const nodeCount = _count?.nodes || 0;

  // Like functionality
  const likeMutation = useLikeRoadmap();
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  // Bookmark functionality
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
        // Unlike - use DELETE
        await axios.delete(`/api/roadmaps/${roadmapId}/like`);
        setIsLiked(false);
        toast.success("Roadmap unliked");
      } else {
        // Like - use POST
        await axios.post(`/api/roadmaps/${roadmapId}/like`);
        setIsLiked(true);
        toast.success("Roadmap liked");
      }
    } catch (error) {
      console.error('Error toggling like:', error);
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full"
    >
      {/* Dynamic Glow Layer */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/40 via-blue-500/20 to-emerald-500/40 rounded-[2.5rem] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      <div className="relative h-full glass-card !bg-card/40 hover:!bg-card/60 backdrop-blur-xl rounded-[2.5rem] border-white/5 overflow-hidden transition-all duration-500 flex flex-col p-8">
        {/* Featured Badge Overlay */}
        {isFeatured && (
          <div className="absolute top-0 right-10 z-20">
            <div className="px-2 py-4 bg-primary text-white text-[9px] font-black uppercase tracking-tighter rounded-b-lg shadow-lg flex flex-col items-center gap-1">
              <TrendingUp className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="flex items-center justify-between mb-8">
          <span
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${badgeClass}`}
          >
            {difficulty}
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {type === "role" ? (
              <Users size={12} />
            ) : type === "skill" ? (
              <Award size={12} />
            ) : (
              <TrendingUp size={12} />
            )}
            {type}
          </div>
        </div>

        {/* Core Content */}
        <div className="flex-1 space-y-4 mb-8">
          <h3 className="text-3xl font-black text-foreground tracking-tighter leading-[1.1] group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          {description && (
            <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">
              {description}
            </p>
          )}
        </div>

        {/* Enhanced Stats Board */}
        <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={14} className="text-primary/60" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Timeline
              </span>
            </div>
            <p className="text-sm font-black text-foreground">
              {estimatedTime || "Self-paced"}
            </p>
          </div>
          <div className="space-y-1 pl-4 border-l border-white/5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 size={14} className="text-emerald-500/60" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Checkpoints
              </span>
            </div>
            <p className="text-sm font-black text-foreground">
              {nodeCount} Steps
            </p>
          </div>
        </div>

        {/* Social Metrics & CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className={`flex items-center gap-1.5 group/stat transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isLiked 
                  ? "text-rose-500" 
                  : "text-muted-foreground hover:text-rose-500"
              }`}
              title={session ? (isLiked ? "Unlike this roadmap" : "Like this roadmap") : "Login to like"}
            >
              {likeMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Heart
                  size={14}
                  className={isLiked ? "fill-rose-500" : "group-hover/stat:fill-rose-500 transition-all"}
                />
              )}
              <span className="text-xs font-bold text-foreground/80">
                {likeCount > 999
                  ? `${(likeCount / 1000).toFixed(1)}k`
                  : likeCount}
              </span>
            </button>
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center gap-1.5 group/stat transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isBookmarked 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              title={session ? (isBookmarked ? "Remove bookmark" : "Bookmark this roadmap") : "Login to bookmark"}
            >
              {bookmarkLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <BookmarkIcon
                  size={14}
                  className={isBookmarked ? "fill-primary" : ""}
                />
              )}
              <span className="text-xs font-bold text-foreground/80">
                {currentBookmarkCount > 999
                  ? `${(currentBookmarkCount / 1000).toFixed(1)}k`
                  : currentBookmarkCount}
              </span>
            </button>
          </div>

          <Link
            href={`/roadmaps/${roadmapId}`}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white group/btn"
          >
            <span className="relative">
              Start Path
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover/btn:w-full transition-all duration-300"></span>
            </span>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
