"use client";

import { useTrendingRoadmaps } from "@/lib/hooks/use-roadmaps";
import RoadmapCard from "./RoadmapCard";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function TrendingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-none" />
          </div>
          <Skeleton className="h-4 w-3/4 rounded-none" />
          <Skeleton className="h-3 w-full rounded-none" />
          <Skeleton className="h-3 w-2/3 rounded-none" />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-3 w-16 rounded-none" />
            <Skeleton className="h-3 w-12 rounded-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrendingRoadmaps() {
  const { data: roadmaps, isLoading } = useTrendingRoadmaps(8);

  if (isLoading) {
    return (
      <section className="border-b border-border/60 dark:border-zinc-800 bg-background">
        <div className="container-xl py-14">
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-border/60 dark:border-zinc-800">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-none" />
              <Skeleton className="h-6 w-48 rounded-none" />
            </div>
            <Skeleton className="h-4 w-16 rounded-none" />
          </div>
          <TrendingGridSkeleton />
        </div>
      </section>
    );
  }

  if (!roadmaps || roadmaps.length === 0) return null;

  return (
    <section className="border-b border-border/60 dark:border-zinc-800 bg-background">
      <div className="container-xl py-14">
        {/* Section header — same pattern as all redesigned sections */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-border/60 dark:border-zinc-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Trending
            </p>
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              Popular this week
            </h2>
          </div>
          <Link
            href="/roadmaps"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors group"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Card grid — gap-px shared-border pattern */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
          {roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              id={roadmap.id}
              roadmapId={roadmap.roadmapId || roadmap.id}
              title={roadmap.title}
              description={roadmap.description}
              difficulty={roadmap.difficulty}
              estimatedTime={roadmap.estimatedTime}
              type={roadmap.type}
              viewCount={roadmap.viewCount}
              likeCount={roadmap.likeCount}
              bookmarkCount={roadmap.bookmarkCount}
              isFeatured={roadmap.isFeatured}
              isLiked={(roadmap as any).isLiked}
              isBookmarked={(roadmap as any).isBookmarked}
              _count={roadmap._count}
            />
          ))}
        </div>

        {/* Mobile "view all" */}
        <div className="mt-6 md:hidden">
          <Link
            href="/roadmaps"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors group"
          >
            All roadmaps
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
