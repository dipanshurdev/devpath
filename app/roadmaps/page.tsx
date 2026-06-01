"use client";

import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/roadmaps/SearchBar";
import { useRoadmaps } from "@/lib/hooks/use-roadmaps";
import RoleBased from "@/components/roadmaps/RoleBased";
import SkillBased from "@/components/skills/SkillsBased";
import ProjectBased from "@/components/roadmaps/ProjectBased";
import { Skeleton } from "@/components/ui/skeleton";

function RoadmapCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4 rounded-xl border border-border/40">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

function RoadmapGridSkeleton() {
  return (
    <div className="card-grid">
      {[...Array(6)].map((_, i) => (
        <RoadmapCardSkeleton key={i} />
      ))}
    </div>
  );
}

function RoadmapContent({ searchTerm }: { searchTerm: string }) {
  const { data: roadmaps, isLoading } = useRoadmaps();

  const filteredRoadmaps =
    (searchTerm
      ? roadmaps?.filter(
          (roadmap) =>
            roadmap?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            roadmap?.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
      : roadmaps) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-24">
        <section>
          <Skeleton className="h-8 w-48 mb-8" />
          <RoadmapGridSkeleton />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      <section className="animate-fade-in relative">
        <RoleBased filteredRoadmaps={filteredRoadmaps} />
      </section>

      <section className="animate-fade-in-delay relative">
        <SkillBased />
      </section>

      <section className="animate-fade-in-delay relative">
        <ProjectBased />
      </section>
    </div>
  );
}

export default function RoadmapsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="relative w-full min-h-screen bg-background border-b border-border/40 pb-16">
      {/* Decorative Grid Line Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:16px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="relative z-10 container-xl section-lg pt-28">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-border text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider mb-8 w-fit">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 dark:bg-blue-800" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary dark:bg-blue-500" />
            </span>
            TECHNICAL CURRICULA
          </div>

          <h1 className="heading-1 mb-6 tracking-tight text-foreground dark:text-white">
            Developer <span className="text-gradient">Roadmaps</span>
          </h1>

          <p className="body-lg text-muted max-w-2xl mx-auto mb-10 dark:text-neutral-300">
            Explore structured, interactive learning paths for modern software engineering stacks, frameworks, and career tracks.
          </p>

          <div className="max-w-2xl mx-auto glass-card p-1.5 rounded-xl border border-neutral-200 dark:border-zinc-800/80 shadow-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/45 transition-all">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </motion.div>

        <Suspense fallback={<RoadmapGridSkeleton />}>
          <RoadmapContent searchTerm={searchTerm} />
        </Suspense>
      </div>

      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-border/40 mt-16">
        <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
         Built with care by <span className="capitalize text-foreground">
          <a href="https://dipanshurdev.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            dipanshu rawat
          </a>
          </span> © {new Date().getFullYear()} DevPath. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
