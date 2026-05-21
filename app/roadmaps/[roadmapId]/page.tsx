"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useRoadmap,
  useRoadmapProgress,
  useToggleNodeProgress,
} from "@/lib/hooks/use-roadmaps";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import NodeDetails from "@/components/roadmaps/NodeDetails";
import { ArrowLeft, Award, Clock, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import with ssr:false to avoid SSR issues with ReactFlow
// and reduce the initial JS bundle size
const RoadmapFlow = dynamic(
  () => import("@/components/roadmaps/RoadmapFlow"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[680px] flex items-center justify-center">
        <div className="space-y-4 w-full px-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const roadmapId = params.roadmapId as string;

  const { data: roadmap, isLoading, error } = useRoadmap(roadmapId);
  const { data: completedNodeIds = [], isLoading: progressLoading } =
    useRoadmapProgress(roadmapId);
  const toggleProgress = useToggleNodeProgress(roadmapId);
  const [selectedNode, setSelectedNode] = useState<Record<
    string,
    unknown
  > | null>(null);

  const progress = Math.round(
    (completedNodeIds.length / (roadmap?.nodes?.length || 1)) * 100,
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login to view roadmaps");
      router.push("/login");
    }
  }, [status, router]);

  // Show loader while checking auth
  if (status === "loading") {
    return <Loader loading={true} />;
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Roadmap
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message || "Failed to load roadmap"}
          </p>
          <button
            onClick={() => router.push("/roadmaps")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmaps
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || progressLoading) {
    return <Loader loading={true} />;
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Roadmap Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The roadmap you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/roadmaps")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmaps
          </button>
        </div>
      </div>
    );
  }

  const handleNodeCompletion = (node: Record<string, unknown>) => {
    const nodeId = (node.id as string) ?? (node.nodeId as string);
    if (!nodeId) return;
    const isCompleted = completedNodeIds.includes(nodeId);
    toggleProgress.mutate(
      { nodeId, completed: !isCompleted },
      {
        onSuccess: () => {
          toast.success(
            isCompleted ? "Marked as not completed" : "Node completed!",
          );
        },
        onError: () => {
          toast.error("Failed to update progress");
        },
      },
    );
  };

  const handleNodeClick = (node: Record<string, unknown>) => {
    setSelectedNode(node);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Decorative Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <Link
            href="/roadmaps"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-12 bg-card/40 px-5 py-2.5 rounded-xl border border-border/40 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 space-y-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {roadmap.type}
                </span>
                <span
                  className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    roadmap.difficulty === "Beginner"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                      : roadmap.difficulty === "Intermediate"
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                  }`}
                >
                  {roadmap.difficulty}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] lg:max-w-4xl">
                   Explore the <span className="text-gradient">{roadmap.title}</span> Universe
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
                  {roadmap.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pb-0.5">
                      Journey Length
                    </p>
                    <p className="text-base font-black text-foreground">
                      {roadmap.estimatedTime || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pb-0.5">
                      Checkpoints
                    </p>
                    <p className="text-base font-black text-foreground">
                      {roadmap.nodes?.length || 0} Milestones
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 lg:mb-4"
            >
              <div className="glass-card p-8 border-border/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Current mastery
                      </h3>
                      <div className="text-5xl font-black text-foreground tracking-tighter tabular-nums">
                        {progress}<span className="text-primary text-2xl">%</span>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary animate-pulse">
                       <TrendingUp size={24} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-full bg-secondary rounded-2xl h-4 relative overflow-hidden p-0.5 border border-border/20 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-primary via-blue-400 to-primary rounded-[10px] relative"
                      >
                         <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[length:200%_100%] animate-[dash_2s_linear_infinite]" />
                      </motion.div>
                    </div>
                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">
                      <span className="text-primary font-black">{completedNodeIds.length}</span> nodes conquered out of <span className="text-foreground">{roadmap.nodes?.length || 0}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roadmap Flow - 2 columns */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Learning Path
                </h2>
                <span className="text-sm text-muted-foreground font-medium">
                  {roadmap.nodes?.length ?? 0} checkpoints
                </span>
              </div>
              {roadmap.nodes && roadmap.nodes.length > 0 ? (
                <div className="h-[680px] -mx-2">
                  <RoadmapFlow
                    nodes={roadmap.nodes}
                    completedNodeIds={completedNodeIds}
                    onNodeClick={handleNodeClick}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-muted/30 border border-dashed border-border">
                  <p className="text-muted-foreground font-medium">
                    No checkpoints yet
                  </p>
                  <p className="text-sm text-muted-foreground/80 mt-1">
                    This roadmap will be populated soon.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Node Details Panel - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-lg overflow-hidden min-h-[320px]">
              {selectedNode ? (
                <NodeDetails
                  node={selectedNode}
                  isCompleted={completedNodeIds.includes(
                    (selectedNode.id as string) ??
                      (selectedNode.nodeId as string),
                  )}
                  onComplete={() => handleNodeCompletion(selectedNode)}
                  roadmapId={roadmapId}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center min-h-[320px]">
                  <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <svg
                      className="w-7 h-7 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Select a checkpoint
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[220px]">
                    Click any node in the path to see details and resources
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
