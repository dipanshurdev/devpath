import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Heart, Award, TrendingUp, ArrowRight } from "lucide-react";
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

const difficultyDot: Record<string, string> = {
  beginner: "bg-emerald-500",
  intermediate: "bg-blue-500",
  advanced: "bg-orange-500",
  expert: "bg-purple-500",
};

const difficultyText: Record<string, string> = {
  beginner: "text-emerald-600 dark:text-emerald-400",
  intermediate: "text-blue-600 dark:text-blue-400",
  advanced: "text-orange-600 dark:text-orange-400",
  expert: "text-purple-600 dark:text-purple-400",
};

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
    likeCount = 0,
    bookmarkCount = 0,
    isBookmarked = false,
    isFeatured = false,
    creator,
    className = "",
  }) => {
    const key = difficulty.toLowerCase();
    const dotClass = difficultyDot[key] ?? "bg-blue-500";
    const textClass = difficultyText[key] ?? "text-blue-600 dark:text-blue-400";
    const TypeIcon = typeIcons[type.toLowerCase()] ?? TrendingUp;

    return (
      <div
        className={`group flex flex-col bg-card border-b border-r border-border/60 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors ${className}`}
      >
        {/* Featured strip */}
        {isFeatured && (
          <div className="h-px bg-primary" />
        )}

        <div className="flex flex-col flex-1 p-5 gap-4">
          {/* Badge row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${textClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                {difficulty}
              </div>
              <span className="text-border/60 dark:text-zinc-700 select-none">·</span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <TypeIcon size={10} />
                {type}
              </span>
            </div>
            <CompactBookmarkButton
              roadmapId={roadmapId}
              initialBookmarked={isBookmarked}
              initialCount={bookmarkCount}
            />
          </div>

          {/* Title & description */}
          <div className="flex-1 space-y-1.5">
            <h3 className="text-sm font-semibold text-foreground dark:text-white leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 border-t border-border/60 dark:border-zinc-800 pt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {estimatedTime}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={11} />
              {fmtCount(likeCount)}
            </span>
          </div>

          {/* Creator + CTA */}
          <div className="flex items-center justify-between gap-3">
            {creator ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-border/60 dark:border-zinc-700 shrink-0 bg-muted">
                  <Image
                    src={creator.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${creator.username}`}
                    alt={creator.name}
                    width={20}
                    height={20}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${creator.username}`;
                    }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground truncate">{creator.name}</span>
              </div>
            ) : (
              <span />
            )}
            <Link
              href={`/roadmaps/${roadmapId}`}
              className="shrink-0 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-foreground dark:text-white hover:text-primary dark:hover:text-primary transition-colors group/cta"
            >
              View
              <ArrowRight size={11} className="group-hover/cta:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

RoadmapCardLazy.displayName = "RoadmapCardLazy";
export default RoadmapCardLazy;
