"use client";

import React, { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/roadmaps/SearchBar";
import { useRoadmaps } from "@/lib/hooks/use-roadmaps";
import { useSearchRoadmaps } from "@/lib/hooks/use-roadmaps";
import RoleBased from "@/components/roadmaps/RoleBased";
import SkillBased from "@/components/skills/SkillsBased";
import ProjectBased from "@/components/roadmaps/ProjectBased";
import RoadmapCard from "@/components/roadmaps/RoadmapCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function RoadmapCardSkeleton() {
  return (
    <div className="border border-border/60 dark:border-zinc-800 bg-card p-5 space-y-3 rounded-none">
      <Skeleton className="h-4 w-24 rounded-none" />
      <Skeleton className="h-5 w-3/4 rounded-none" />
      <Skeleton className="h-4 w-full rounded-none" />
      <Skeleton className="h-4 w-2/3 rounded-none" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-3 w-14 rounded-none" />
        <Skeleton className="h-3 w-14 rounded-none" />
      </div>
    </div>
  );
}

function RoadmapGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
      {[...Array(8)].map((_, i) => (
        <RoadmapCardSkeleton key={i} />
      ))}
    </div>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-8 pb-4 border-b border-border/60 dark:border-zinc-800">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <h2 className="text-lg font-semibold text-foreground dark:text-white">
        {title}
      </h2>
    </div>
  );
}

function BrowseContent() {
  const { data: roadmaps, isLoading } = useRoadmaps();

  if (isLoading) {
    return (
      <div className="space-y-16">
        <section>
          <div className="h-px w-full bg-border/60 dark:bg-zinc-800 mb-8" />
          <RoadmapGridSkeleton />
        </section>
      </div>
    );
  }

  const filteredRoadmaps = roadmaps ?? [];

  return (
    <div className="space-y-20">
      <section>
        <SectionHeading label="Career Tracks" title="Role-based Roadmaps" />
        <RoleBased filteredRoadmaps={filteredRoadmaps} />
      </section>
      <section>
        <SectionHeading label="Skills" title="Skill Roadmaps" />
        <SkillBased />
      </section>
      <section>
        <SectionHeading label="Build" title="Project-based Paths" />
        <ProjectBased />
      </section>
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useSearchRoadmaps(query, page);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const roadmaps = data?.roadmaps ?? [];
  const pagination = data?.pagination;

  if (isLoading || isFetching) {
    return <RoadmapGridSkeleton />;
  }

  if (roadmaps.length === 0) {
    return (
      <div className="border border-border/60 dark:border-zinc-800 py-20 text-center">
        <p className="text-sm text-muted-foreground">
          No roadmaps found for &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Results
        </span>
        <span className="text-sm text-foreground dark:text-white font-medium">
          {pagination?.total ?? roadmaps.length} for &ldquo;{query}&rdquo;
        </span>
      </div>

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

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 dark:border-zinc-800 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-none h-9 text-xs font-semibold uppercase tracking-wider"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1.5" />
            Previous
          </Button>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pagination.totalPages}
            className="rounded-none h-9 text-xs font-semibold uppercase tracking-wider"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function RoadmapsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const isSearchMode = debouncedQuery.trim().length > 0;

  return (
    <div className="relative w-full min-h-screen bg-background pb-20">
      {/* subtle grid texture matching Hero */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Page header — matches Hero's first-fold pattern */}
      <div className="relative border-b border-border/60 dark:border-zinc-800 bg-background pt-28 pb-12">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-border text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Technical Curricula
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground dark:text-white mb-4 leading-tight">
              Developer Roadmaps
            </h1>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              Structured learning paths for modern engineering stacks, frameworks, and career tracks. No more tutorial hell.
            </p>
          </motion.div>

          {/* Search — below headline, left-aligned */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl border border-border/80 dark:border-zinc-700 bg-card focus-within:border-primary/60 transition-colors"
          >
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-xl pt-12">
        <Suspense
          fallback={
            <div className="pt-4">
              <RoadmapGridSkeleton />
            </div>
          }
        >
          {isSearchMode ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <SearchResults query={debouncedQuery} />
            </motion.div>
          ) : (
            <BrowseContent />
          )}
        </Suspense>
      </div>

      <div className="border-t border-border/60 dark:border-zinc-800 mt-20">
        <div className="container-xl py-8">
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a
              href="https://dipanshurdev.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground dark:text-white hover:text-primary transition-colors"
            >
              Dipanshu Rawat
            </a>{" "}
            · © {new Date().getFullYear()} DevPath
          </p>
        </div>
      </div>
    </div>
  );
}
