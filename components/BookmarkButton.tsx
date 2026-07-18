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
  const { isBookmarked, bookmarkCount, isLoading, toggleBookmark } = useBookmark({
    roadmapId,
    initialBookmarked,
    initialCount,
  });

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        "rounded-none transition-colors",
        isBookmarked && "text-primary border-primary/40 bg-primary/5 hover:bg-primary/10",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {isBookmarked ? (
          <Bookmark className="w-4 h-4 fill-current" />
        ) : (
          <BookmarkIcon className="w-4 h-4" />
        )}
        {showCount && bookmarkCount > 0 && (
          <span className="text-xs font-medium tabular-nums">{bookmarkCount}</span>
        )}
      </div>
    </Button>
  );
}

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
  const { isBookmarked, bookmarkCount, isLoading, toggleBookmark } = useBookmark({
    roadmapId,
    initialBookmarked,
    initialCount,
  });

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1 text-[11px] font-medium transition-colors disabled:opacity-40",
        isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary",
        className
      )}
    >
      {isBookmarked ? (
        <Bookmark className="w-3.5 h-3.5 fill-current" />
      ) : (
        <BookmarkIcon className="w-3.5 h-3.5" />
      )}
      {bookmarkCount > 0 && (
        <span className="tabular-nums">{bookmarkCount}</span>
      )}
    </button>
  );
}

export function BookmarkIconButton({
  roadmapId,
  initialBookmarked = false,
  className,
}: {
  roadmapId: string;
  initialBookmarked?: boolean;
  className?: string;
}) {
  const { isBookmarked, isLoading, toggleBookmark } = useBookmark({
    roadmapId,
    initialBookmarked,
  });

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        "transition-colors disabled:opacity-40",
        isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary",
        className
      )}
      title={isBookmarked ? "Remove bookmark" : "Bookmark"}
    >
      {isBookmarked ? (
        <Bookmark className="w-4 h-4 fill-current" />
      ) : (
        <BookmarkIcon className="w-4 h-4" />
      )}
    </button>
  );
}
