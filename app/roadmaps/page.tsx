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
    <div className="glass-card p-6 space-y-4 rounded-2xl border border-border/40">
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
      <Skeleton className="h-10 w-full rounded-xl" />
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
      <div className="space-y-32">
        <section>
          <Skeleton className="h-8 w-48 mb-8" />
          <RoadmapGridSkeleton />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-32">
      <section className="animate-fade-in relative">
        <div className="absolute top-[-111px] right-0 -translate-x-12 translate-y-12 text-[120px] font-black text-primary/5 pointer-events-none select-none -z-10">
          ROLES
        </div>
        <RoleBased filteredRoadmaps={filteredRoadmaps} />
      </section>

      <section className="animate-fade-in-delay relative">
        <div className="absolute top-[-45px] right-0 -translate-x-12 translate-y-12 text-[120px] font-black text-primary/5 pointer-events-none select-none -z-10">
          SKILLS
        </div>
        <SkillBased />
      </section>

      <section className="animate-fade-in-delay relative">
        <div className="absolute top-[-45px] right-0 -translate-x-12 translate-y-12 text-[120px] font-black text-primary/5 pointer-events-none select-none -z-10">
          PROJECTS
        </div>
        <ProjectBased />
      </section>
    </div>
  );
}

export default function RoadmapsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-background via-background to-card/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900/50 selection:bg-primary/20 mb-8">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full animate-float dark:bg-blue-900/10" />
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full dark:bg-purple-900/10" />
      </div>

      <div className="relative z-10 container-xl section-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm dark:bg-blue-900/30 dark:border-blue-500/40 dark:text-blue-100 dark:shadow-blue-500/20 backdrop-blur-sm"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 dark:bg-blue-800" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary dark:bg-blue-500" />
            </div>
            Curated Knowledge paths
          </motion.div>

          <h1 className="heading-1 mb-8 tracking-widest leading-[0.9] text-foreground dark:text-white dark:drop-shadow-lg">
            Architect your <br />
            <span className="text-gradient dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-200 dark:to-white">Future Self</span>
          </h1>

          <p className="body-lg text-muted max-w-2xl mx-auto mb-12 dark:text-blue-100 dark:text-gray-200">
            Join 100k+ developers mastering high-demand skills through our
            expert-curated technical roadmaps.
          </p>

          <div className="max-w-2xl mx-auto glass-card !p-2 !rounded-[2rem] border-border/40 shadow-2xl shadow-primary/5 group transition-all focus-within:ring-2 focus-within:ring-primary/20 dark:bg-neutral-800/40 dark:border-blue-500/30 dark:shadow-blue-500/20 dark:focus-within:ring-blue-500/30">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </motion.div>

        <Suspense fallback={<RoadmapGridSkeleton />}>
          <RoadmapContent searchTerm={searchTerm} />
        </Suspense>
      </div>

      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-muted-foreground">
         Built with ❤️ by <span className="capitalize">
          <a href="https://dipanshurdev.xyz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            dipanshu rawat
          </a>
          </span> © {new Date().getFullYear()} DevPath. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
