import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BookmarkIcon, Clock, Users, Heart, Award, TrendingUp, Zap } from "lucide-react";
import { CompactBookmarkButton } from "@/components/BookmarkButton";

interface RoadmapCardLazyProps {
  roadmapId: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
  viewCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
  isBookmarked?: boolean;
  isFeatured?: boolean;
  creator?: {
    name: string;
    username: string;
    avatar?: string;
  };
  className?: string;
}

const difficultyConfig = {
  beginner: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  advanced: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  expert: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
} as const;

const typeIcons: Record<string, React.ElementType> = {
  role: Users,
  skill: Award,
  topic: TrendingUp,
};

const fmtCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const RoadmapCardLazy = React.memo<RoadmapCardLazyProps>(
  ({
    roadmapId,
    title,
    description,
    type,
    difficulty,
    estimatedTime,
    viewCount = 0,
    likeCount = 0,
    bookmarkCount = 0,
    isBookmarked = false,
    isFeatured = false,
    creator,
    className = "",
  }) => {
    const badgeClass =
      difficultyConfig[difficulty.toLowerCase() as keyof typeof difficultyConfig] ??
      difficultyConfig.intermediate;

    const TypeIcon = typeIcons[type.toLowerCase()] ?? TrendingUp;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`group ${className}`}
      >
        <div className="relative h-full flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-border/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)] min-w-[320px]">
          {/* Featured top accent */}
          {isFeatured && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-blue-400 to-primary" />
          )}

          <div className="flex flex-col flex-1 p-5">
            {/* Badge row */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badgeClass}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                  {difficulty}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-border bg-muted/40 text-muted-foreground">
                  <TypeIcon size={11} />
                  {type}
                </span>
                {isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Zap size={10} className="fill-amber-500" />
                    Featured
                  </span>
                )}
              </div>
              <CompactBookmarkButton
                roadmapId={roadmapId}
                initialBookmarked={isBookmarked}
                initialCount={bookmarkCount}
              />
            </div>

            {/* Title & description */}
            <div className="flex-1 mb-4">
              <h3 className="text-base font-semibold text-foreground leading-snug tracking-tight mb-1.5 group-hover:text-primary transition-colors duration-150 line-clamp-2">
                {title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 py-3 border-t border-b border-border/60 mb-4 text-[12px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="shrink-0" />
                <span>{estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={12} className="shrink-0" />
                <span>{fmtCount(viewCount)} views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart size={12} className="shrink-0" />
                <span>{fmtCount(likeCount)}</span>
              </div>
            </div>

            {/* Creator & CTA */}
            <div className="flex items-center justify-between gap-3">
              {creator ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-border shrink-0">
                    <Image
                      src={
                        creator.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${creator.username}`
                      }
                      alt={creator.name}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${creator.username}`;
                      }}
                    />
                  </div>
                  <span className="text-[12px] text-muted-foreground truncate">
                    {creator.name}
                  </span>
                </div>
              ) : (
                <span />
              )}

              <Link
                href={`/roadmaps/${roadmapId}`}
                className="shrink-0 px-3 py-1.5 rounded-md text-[12px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

RoadmapCardLazy.displayName = "RoadmapCardLazy";

export default RoadmapCardLazy;
