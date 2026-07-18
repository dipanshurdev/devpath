"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Activity,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Star,
  BookmarkIcon,
  CheckCircle2,
} from "lucide-react";
import { useDashboardData } from "@/lib/dashboard-fix";
import Loader from "@/components/Loader";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: dashboardData, loading } = useDashboardData(
    session?.user?.id || ""
  );
  const [activeTab, setActiveTab] = useState("in-progress");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <Loader loading={true} />;
  }

  const userName =
    dashboardData?.user?.name?.split(" ")[0] ||
    session?.user?.name?.split(" ")[0] ||
    "Learner";

  const stats = dashboardData?.stats ?? {
    inProgressRoadmaps: 0,
    completedNodes: 0,
    savedCount: 0,
    totalActivities: 0,
  };

  const inProgress = dashboardData?.inProgress ?? [];
  const saved = dashboardData?.saved ?? [];
  const weeklyActivity = dashboardData?.weeklyActivity;

  if (loading && !dashboardData) return <DashboardSkeleton />;

  if (!dashboardData && !loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please refresh the page.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => window.location.reload()}
          className="premium-button"
        >
          Refresh
        </Button>
      </div>
    );
  }

  // Build day labels + heights for chart
  const chartDays: { label: string; height: number }[] = weeklyActivity
    ? Object.entries(weeklyActivity.dailyActivity)
        .slice(-7)
        .map(([day, activities]: [string, any]) => ({
          label: new Date(day).toLocaleDateString("en", { weekday: "short" }).slice(0, 1),
          height: Math.max(
            8,
            Math.min(
              100,
              (activities.length /
                Math.max(1, weeklyActivity.totalActivities)) *
                100
            )
          ),
        }))
    : ["M", "T", "W", "T", "F", "S", "S"].map((label, i) => ({
        label,
        height: [40, 62, 30, 80, 52, 22, 14][i],
      }));

  return (
    <div className="container-xl py-10 space-y-10">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 pb-6 border-b border-border/60 dark:border-zinc-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.completedNodes} milestones completed this month.
          </p>
        </div>
        <Button
          asChild
          className="premium-button px-6 py-3 text-sm group shrink-0"
        >
          <Link href="/roadmaps" className="flex items-center gap-2">
            Explore Paths
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* Stats row — 4 compact metric cells */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-border/60 dark:border-zinc-800 divide-x divide-y lg:divide-y-0 divide-border/60 dark:divide-zinc-800">
        {[
          {
            label: "Streak",
            value: `${dashboardData?.user?.streak ?? 0}d`,
            icon: Activity,
            accent: "text-primary",
          },
          {
            label: "In Progress",
            value: stats.inProgressRoadmaps,
            icon: Clock,
            accent: "text-amber-500",
          },
          {
            label: "Completed",
            value: stats.completedNodes,
            icon: CheckCircle2,
            accent: "text-emerald-500",
          },
          {
            label: "Saved",
            value: stats.savedCount,
            icon: BookOpen,
            accent: "text-blue-500",
          },
        ].map((s, i) => (
          <div key={i} className="px-5 py-5 bg-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </span>
              <s.icon className={`w-4 h-4 ${s.accent}`} />
            </div>
            <span className="text-2xl font-bold text-foreground dark:text-white tabular-nums">
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Activity + goals row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px border border-border/60 dark:border-zinc-800 bg-border/90 dark:bg-zinc-100">
        {/* Weekly bar chart */}
        <div className="lg:col-span-2 bg-card px-7 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Activity
              </p>
              <h3 className="text-base font-semibold text-foreground dark:text-white">
                Weekly Engagement
              </h3>
            </div>
            {weeklyActivity && (
              <span className="text-xs text-muted-foreground">
                {weeklyActivity.totalActivities} events
              </span>
            )}
          </div>
          <div className="h-44 flex items-end gap-2">
            {chartDays.map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.height}%` }}
                  transition={{ duration: 0.8, delay: i * 0.07, ease: "circOut" }}
                  className="w-full bg-neutral-200 dark:bg-zinc-700 group-hover:bg-primary dark:group-hover:bg-blue-500 transition-colors"
                />
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground dark:group-hover:text-white transition-colors">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning goals */}
        <div className="bg-card px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Goals
          </p>
          <h3 className="text-base font-semibold text-foreground dark:text-white mb-6">
            This Week
          </h3>
          <div className="space-y-5">
            {[
              { title: "Watch 3 tutorials", progress: 66 },
              { title: "Complete 1 roadmap", progress: 20 },
              { title: "Master 5 resources", progress: 80 },
            ].map((goal, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground dark:text-neutral-300 font-medium">
                    {goal.title}
                  </span>
                  <span className="font-semibold text-muted-foreground tabular-nums">
                    {goal.progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-100 dark:bg-zinc-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: "circOut" }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-8 h-9 rounded-none text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground dark:hover:text-white border border-border/60 dark:border-zinc-700 hover:border-border dark:hover:border-zinc-600 transition-colors"
          >
            All Achievements
          </Button>
        </div>
      </div>

      {/* Roadmap collections */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-border/60 dark:border-zinc-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              My Learning
            </p>
            <h3 className="text-lg font-semibold text-foreground dark:text-white">
              Collections
            </h3>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-neutral-100 dark:bg-zinc-900 h-9 p-0.5 rounded-none border border-border/60 dark:border-zinc-800 gap-0">
              {["in-progress", "completed", "saved"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none h-8 px-4 text-xs font-semibold capitalize data-[state=active]:bg-background dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-foreground dark:data-[state=active]:text-white data-[state=active]:shadow-none transition-none"
                >
                  {tab === "in-progress" ? "In Progress" : tab === "completed" ? "Done" : "Library"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="in-progress">
            {inProgress.length === 0 ? (
              <EmptyState
                icon={Clock}
                message="No active paths yet."
                action={{ label: "Start learning", href: "/roadmaps" }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
                {inProgress.map((item: any) => (
                  <RoadmapProgressCard
                    key={item.roadmapId}
                    title={item.title}
                    progress={item.progress}
                    id={item.roadmapId}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            <EmptyState
              icon={Award}
              message="Finish your first roadmap to see it here."
            />
          </TabsContent>

          <TabsContent value="saved">
            {saved.length === 0 ? (
              <EmptyState
                icon={BookmarkIcon}
                message="Your library is empty."
                action={{ label: "Browse roadmaps", href: "/roadmaps" }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
                {saved.map((item: any) => (
                  <SavedRoadmapCard
                    key={item.roadmapId}
                    title={item.title}
                    description={item.description ?? ""}
                    likes={item.likeCount ?? 0}
                    saves={item.bookmarkCount ?? 0}
                    id={item.roadmapId}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  message,
  action,
}: {
  icon: React.ElementType;
  message: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="border border-dashed border-border/60 dark:border-zinc-700 py-16 flex flex-col items-center gap-4 text-center">
      <Icon className="w-8 h-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {action && (
        <Button
          asChild
          size="sm"
          className="premium-button mt-2 px-6 py-2.5 text-xs"
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

function RoadmapProgressCard({
  title,
  progress,
  id,
}: {
  title: string;
  progress: number;
  id: string;
}) {
  return (
    <div className="bg-card p-5 flex flex-col gap-5 hover:bg-neutral-50 dark:hover:bg-zinc-900/60 transition-colors">
      <div>
        <h4 className="text-sm font-semibold text-foreground dark:text-white line-clamp-1 mb-1">
          {title}
        </h4>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Active
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground dark:text-white tabular-nums">
            {progress}%
          </span>
        </div>
        <div className="h-1 bg-neutral-100 dark:bg-zinc-800">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Button
        asChild
        size="sm"
        className="premium-button w-full h-9 text-xs font-semibold"
      >
        <Link href={`/roadmaps/${id}`}>Resume</Link>
      </Button>
    </div>
  );
}

function SavedRoadmapCard({
  title,
  description,
  likes,
  saves,
  id,
}: {
  title: string;
  description: string;
  likes: number;
  saves: number;
  id: string;
}) {
  return (
    <div className="bg-card p-5 flex flex-col gap-5 hover:bg-neutral-50 dark:hover:bg-zinc-900/60 transition-colors">
      <div>
        <h4 className="text-sm font-semibold text-foreground dark:text-white line-clamp-1 mb-1">
          {title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-500" />
          {likes}
        </span>
        <span className="flex items-center gap-1">
          <BookmarkIcon className="w-3 h-3 text-primary" />
          {saves}
        </span>
      </div>

      <Button
        asChild
        variant="outline"
        size="sm"
        className="w-full h-9 rounded-none text-xs font-semibold border-border/60 dark:border-zinc-700 hover:border-border dark:hover:border-zinc-600 hover:bg-transparent transition-colors"
      >
        <Link href={`/roadmaps/${id}`}>View</Link>
      </Button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container-xl py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-border/60 dark:border-zinc-800">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-none" />
          <Skeleton className="h-8 w-64 rounded-none" />
          <Skeleton className="h-4 w-48 rounded-none" />
        </div>
        <Skeleton className="h-10 w-36 rounded-none" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-border/60 dark:border-zinc-800 divide-x divide-y lg:divide-y-0 divide-border/60 dark:divide-zinc-800">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="px-5 py-5 bg-card space-y-3">
            <Skeleton className="h-3 w-16 rounded-none" />
            <Skeleton className="h-7 w-12 rounded-none" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
        <div className="lg:col-span-2 bg-card px-7 py-6 space-y-6">
          <Skeleton className="h-5 w-40 rounded-none" />
          <div className="h-44 flex items-end gap-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="flex-1 rounded-none" style={{ height: `${[40, 62, 30, 80, 52, 22, 14][i]}%` }} />
            ))}
          </div>
        </div>
        <div className="bg-card px-6 py-6 space-y-5">
          <Skeleton className="h-5 w-24 rounded-none" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-28 rounded-none" />
                <Skeleton className="h-3 w-8 rounded-none" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
