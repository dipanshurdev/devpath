"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Activity,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  Star,
  BookmarkIcon,
} from "lucide-react";
import { useDashboardData } from "@/lib/dashboard-fix";
import Loader from "@/components/Loader";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: dashboardData, loading } = useDashboardData(session?.user?.id || '');
  const [activeTab, setActiveTab] = useState("in-progress");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
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

  // Show skeleton loader while loading
  if (loading && !dashboardData) {
    return <DashboardSkeleton />;
  }

  // Show error state if dashboard data failed to load
  if (!dashboardData && !loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="premium-button">
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="container-xl page-content">
      {/* Welcome Header */}
      <div className="page-header">
        <div className="space-y-2">
          <h1 className="heading-2 text-foreground">
            Welcome back, <span className="text-gradient">{userName}</span>
          </h1>
          <p className="body-lg text-secondary-foreground max-w-2xl">
            Your learning journey is evolving. You&apos;ve completed <span className="text-primary font-bold">{stats.completedNodes}</span> milestones this month.
          </p>
        </div>
        <Button asChild className="premium-button px-8 py-6 text-base group">
          <Link href="/roadmaps" className="flex items-center gap-2">
            Explore New Paths
            <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Current Streak", value: `${dashboardData?.user?.streak ?? 0} Days`, icon: Activity, color: "text-primary", bg: "bg-primary/10" },
          { label: "In Progress", value: stats.inProgressRoadmaps, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Completed", value: stats.completedNodes, icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "My Library", value: stats.savedCount, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex flex-col gap-4 border-border/40 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2 glass-card p-8 border-border/40 overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
           
           <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Weekly Engagement</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">Activity over the last 7 days</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-lg text-[10px] font-black uppercase tracking-widest text-primary">
                Live Data
              </div>
           </div>

           <div className="h-[240px] flex items-end justify-between gap-4">
            {weeklyActivity ? (
              // Real activity data
              Object.entries(weeklyActivity.dailyActivity).slice(-7).map(([day, activities], i) => {
                const dayName = new Date(day).toLocaleDateString('en', { weekday: 'short' }).charAt(0);
                const height = Math.min(100, (activities.length / Math.max(1, weeklyActivity.totalActivities)) * 100);
                return (
                  <div key={i} className="flex flex-col items-center gap-4 flex-1 group/bar">
                    <div className="relative w-full max-w-[40px] flex flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                        className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-xl relative overflow-hidden shadow-lg shadow-primary/10 group-hover/bar:shadow-primary/30 transition-all border border-white/10"
                      >
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground group-hover/bar:text-primary transition-colors">{dayName}</span>
                  </div>
                );
              })
            ) : (
              // Fallback mock data
              ["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                const height = [45, 65, 35, 85, 55, 25, 15][i];
                return (
                  <div key={i} className="flex flex-col items-center gap-4 flex-1 group/bar">
                    <div className="relative w-full max-w-[40px] flex flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                        className="w-full bg-gradient-to-t from-primary to-blue-400 rounded-xl relative overflow-hidden shadow-lg shadow-primary/10 group-hover/bar:shadow-primary/30 transition-all border border-white/10"
                      >
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground group-hover/bar:text-primary transition-colors">{day}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions / Achievements */}
        <div className="glass-card p-8 border-border/40 bg-primary/5">
          <h3 className="text-xl font-black text-foreground mb-6">Learning Goals</h3>
          <div className="space-y-6">
             {[
               { title: "Watch 3 tutorials", progress: 66, icon: Star },
               { title: "Complete 1 Roadmap", progress: 20, icon: TrendingUp },
               { title: "Master 5 resources", progress: 80, icon: Award },
             ].map((goal, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex items-center justify-between text-xs font-bold">
                   <span className="text-foreground">{goal.title}</span>
                   <span className="text-primary">{goal.progress}%</span>
                 </div>
                 <div className="h-2 bg-secondary rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                   />
                 </div>
               </div>
             ))}
          </div>
          <Button variant="outline" className="w-full mt-10 rounded-xl border-primary/20 hover:bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
            View All Achievements
          </Button>
        </div>
      </div>

      {/* Roadmaps Management */}
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h3 className="text-3xl font-black text-foreground tracking-tight">My Collections</h3>
            <TabsList className="bg-card/50 p-1 rounded-2xl border border-border/40 h-14">
              <TabsTrigger value="in-progress" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">Finished</TabsTrigger>
              <TabsTrigger value="saved" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">Library</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="in-progress">
            {inProgress.length === 0 ? (
              <div className="glass-card p-16 text-center border-dashed border-2 border-border/50">
                <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold mb-6 text-lg">You haven&apos;t joined any learning paths yet.</p>
                <Button asChild className="premium-button px-10">
                  <Link href="/roadmaps">Start Your Journey</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
             <div className="glass-card p-16 text-center border-dashed border-2 border-border/50">
                <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold text-lg">Finish your first roadmap to earn a certificate.</p>
             </div>
          </TabsContent>

          <TabsContent value="saved">
            {saved.length === 0 ? (
              <div className="glass-card p-16 text-center border-dashed border-2 border-border/50">
                <BookmarkIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold text-lg">Your wishlist is empty. Save some roadmaps to see them here.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="glass-card p-6 flex flex-col gap-6 border-border/40 hover:bg-card/80 transition-colors group">
      <div className="space-y-1">
        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{title}</h4>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
           <Clock className="w-3 h-3" />
           <span>Active Now</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
           <span className="text-muted-foreground">Overall Mastery</span>
           <span className="text-primary">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
           <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary rounded-full" 
           />
        </div>
      </div>

      <Button asChild className="w-full premium-button h-12">
        <Link href={`/roadmaps/${id}`}>Resume Learning</Link>
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
    <div className="glass-card p-6 flex flex-col gap-6 border-border/40 hover:bg-card/80 transition-colors group">
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">{description}</p>
      </div>

      <div className="flex items-center justify-between border-y border-border/40 py-4">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span>{likes} Likes</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground">
          <BookmarkIcon className="w-3.5 h-3.5 text-primary" />
          <span>{saves} Saves</span>
        </div>
      </div>

      <Button asChild variant="secondary" className="w-full h-12 rounded-xl border border-border/60 font-bold text-sm hover:border-primary/40 transition-all">
        <Link href={`/roadmaps/${id}`}>View Content</Link>
      </Button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Welcome Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-12 w-40" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Chart Skeleton */}
        <div className="lg:col-span-2 glass-card p-8 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="h-[240px] flex items-end justify-between gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4 flex-1">
                <Skeleton className="w-full max-w-[40px] h-32 rounded-xl" />
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Goals Skeleton */}
        <div className="glass-card p-8 space-y-6">
          <Skeleton className="h-6 w-32" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Roadmaps Skeleton */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-24 rounded-xl" />
            ))}
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
