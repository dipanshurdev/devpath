"use client";

import { Bookmark, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmark } from "@/lib/hooks/use-bookmark";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  roadmapId: string;
  initialBookmarked?: boolean;
  initialCount?: number;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showCount?: boolean;
  className?: string;
}

export function BookmarkButton({
  roadmapId,
  initialBookmarked = false,
  initialCount = 0,
  size = "default",
  variant = "outline",
  showCount = true,
  className,
}: BookmarkButtonProps) {
  const {
    isBookmarked,
    bookmarkCount,
    isLoading,
    toggleBookmark,
  } = useBookmark({
    roadmapId,
    initialBookmarked,
    initialCount,
  });

  const sizeClasses = {
    sm: "h-8 w-8 px-2 text-xs",
    default: "h-10 w-10 px-3 text-sm",
    lg: "h-12 w-12 px-4 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    default: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        "group transition-all duration-200 hover:scale-105",
        isBookmarked && "text-primary border-primary bg-primary/10 hover:bg-primary/20",
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {isBookmarked ? (
          <Bookmark className={cn("fill-current", iconSizes[size])} />
        ) : (
          <BookmarkIcon className={iconSizes[size]} />
        )}
        {showCount && (
          <span className="font-medium">
            {bookmarkCount > 0 ? bookmarkCount : ""}
          </span>
        )}
      </div>
    </Button>
  );
}

// Compact version for cards
export function CompactBookmarkButton({
  roadmapId,
  initialBookmarked = false,
  initialCount = 0,
  className,
}: {
  roadmapId: string;
  initialBookmarked?: boolean;
  initialCount?: number;
  className?: string;
}) {
  const {
    isBookmarked,
    bookmarkCount,
    isLoading,
    toggleBookmark,
  } = useBookmark({
    roadmapId,
    initialBookmarked,
    initialCount,
  });

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1.5 p-2 rounded-lg transition-all duration-200 hover:bg-secondary/80 group",
        isBookmarked && "text-primary",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isBookmarked ? (
        <Bookmark className="w-4 h-4 fill-current" />
      ) : (
        <BookmarkIcon className="w-4 h-4" />
      )}
      <span className="text-xs font-medium">
        {bookmarkCount > 0 ? bookmarkCount : ""}
      </span>
    </button>
  );
}

// Icon-only version for minimal UI
export function BookmarkIconButton({
  roadmapId,
  initialBookmarked = false,
  className,
}: {
  roadmapId: string;
  initialBookmarked?: boolean;
  className?: string;
}) {
  const {
    isBookmarked,
    isLoading,
    toggleBookmark,
  } = useBookmark({
    roadmapId,
    initialBookmarked,
  });

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-lg transition-all duration-200 hover:bg-secondary/80 group",
        isBookmarked && "text-primary",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
      title={isBookmarked ? "Remove bookmark" : "Bookmark roadmap"}
    >
      {isBookmarked ? (
        <Bookmark className="w-5 h-5 fill-current" />
      ) : (
        <BookmarkIcon className="w-5 h-5" />
      )}
    </button>
  );
}
