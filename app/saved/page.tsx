"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, Search, BookOpen, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import RoadmapCardLazy from "@/components/roadmaps/RoadmapCardLazy";
import { useSavedRoadmaps } from "@/lib/hooks/use-bookmark";

interface SavedRoadmap {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
  viewCount?: number;
  isFeatured?: boolean;
  creator?: {
    name: string;
    username: string;
    avatar?: string;
  };
  _count?: {
    likes?: number;
    bookmarks?: number;
  };
}

export default function SavedRoadmapsPage() {
  const { data: _session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");

  const { data: savedRoadmaps = [], isLoading, error } = useSavedRoadmaps();

  React.useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/saved");
  }, [status, router]);

  const filteredRoadmaps = React.useMemo(() => {
    if (!savedRoadmaps) return [];
    return (savedRoadmaps as SavedRoadmap[]).filter((roadmap) => {
      const matchesSearch =
        !searchTerm ||
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all" || roadmap.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [savedRoadmaps, searchTerm, filterType]);

  const uniqueTypes = React.useMemo(() => {
    if (!savedRoadmaps) return [];
    const types = (savedRoadmaps as SavedRoadmap[]).map((r) => r.type);
    return Array.from(new Set(types));
  }, [savedRoadmaps]);

  if (status === "loading") {
    return (
      <div className="container-xl py-10 space-y-8">
        <div className="pb-6 border-b border-border/60 dark:border-zinc-800 space-y-2">
          <Skeleton className="h-3 w-16 rounded-none" />
          <Skeleton className="h-8 w-48 rounded-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-none" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl py-20 flex flex-col items-center gap-4 text-center">
        <Bookmark className="w-8 h-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Could not load your saved roadmaps.
        </p>
        <Button
          size="sm"
          className="premium-button px-6"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background pb-20">
      {/* Page header */}
      <div className="border-b border-border/60 dark:border-zinc-800 bg-background pt-24 pb-10">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Library
            </p>
            <div className="flex items-baseline gap-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground dark:text-white">
                Saved Roadmaps
              </h1>
              {savedRoadmaps.length > 0 && (
                <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                  {savedRoadmaps.length}
                </span>
              )}
            </div>
          </motion.div>

          {/* Toolbar */}
          {savedRoadmaps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-6 flex flex-col sm:flex-row gap-3"
            >
              {/* Search */}
              <div className="relative flex-1 max-w-sm border border-border/80 dark:border-zinc-700 bg-card focus-within:border-primary/60 transition-colors">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search saved…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 rounded-none border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Type filters */}
              {uniqueTypes.length > 0 && (
                <div className="flex items-center gap-0 border border-border/60 dark:border-zinc-800">
                  <span className="px-3 flex items-center border-r border-border/60 dark:border-zinc-800 self-stretch">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  </span>
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-4 h-9 text-xs font-semibold uppercase tracking-wider transition-colors border-r border-border/60 dark:border-zinc-800 ${
                      filterType === "all"
                        ? "bg-foreground text-background dark:bg-white dark:text-neutral-950"
                        : "text-muted-foreground hover:text-foreground dark:hover:text-white bg-card"
                    }`}
                  >
                    All
                  </button>
                  {uniqueTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 h-9 text-xs font-semibold capitalize tracking-wider transition-colors border-r last:border-r-0 border-border/60 dark:border-zinc-800 ${
                        filterType === type
                          ? "bg-foreground text-background dark:bg-white dark:text-neutral-950"
                          : "text-muted-foreground hover:text-foreground dark:hover:text-white bg-card"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container-xl pt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-none" />
            ))}
          </div>
        ) : filteredRoadmaps.length === 0 ? (
          <div className="border border-dashed border-border/60 dark:border-zinc-700 py-24 flex flex-col items-center gap-4 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground/30" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground dark:text-white">
                {savedRoadmaps.length === 0
                  ? "Your library is empty"
                  : "No matches found"}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                {savedRoadmaps.length === 0
                  ? "Browse roadmaps and save the ones you want to follow."
                  : "Try a different search term or filter."}
              </p>
            </div>
            {savedRoadmaps.length === 0 && (
              <Button
                asChild
                size="sm"
                className="premium-button mt-2 px-6 py-2.5 text-xs group"
              >
                <a href="/roadmaps" className="flex items-center gap-2">
                  Explore Roadmaps
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
            {filteredRoadmaps.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
              >
                <RoadmapCardLazy
                  roadmapId={roadmap.roadmapId}
                  title={roadmap.title}
                  description={roadmap.description}
                  type={roadmap.type}
                  difficulty={roadmap.difficulty}
                  estimatedTime={roadmap.estimatedTime}
                  viewCount={roadmap.viewCount}
                  likeCount={roadmap._count?.likes || 0}
                  bookmarkCount={roadmap._count?.bookmarks || 0}
                  isBookmarked={true}
                  isFeatured={roadmap.isFeatured}
                  creator={roadmap.creator}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
