"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Plus,
  FileText,
  GitBranch,
  BookOpen,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { useToast } from "@/components/use-toast";

interface AdminStats {
  roadmapCount: number;
  publishedRoadmapCount: number;
  nodeCount: number;
  resourceCount: number;
  userCount: number;
  commentCount: number;
  activeUsers: {
    last7Days: number;
    last30Days: number;
  };
  subscriptions: { tier: string; status: string; count: number }[];
  timeSeries: {
    signups: {
      last7Days: { total: number; daily: { date: string; count: number }[] };
      last30Days: { total: number; daily: { date: string; count: number }[] };
    };
    roadmapCompletions: {
      last7Days: { total: number; daily: { date: string; count: number }[] };
      last30Days: { total: number; daily: { date: string; count: number }[] };
    };
  };
  generatedAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/");
    }
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setStats(json.data as AdminStats);
        } else {
          setStatsError(json.error ?? "Failed to load stats");
          toast({
            variant: "destructive",
            title: "Error",
            description: json.error,
          });
        }
      })
      .catch((err) => {
        setStatsError("Could not reach the server. Please refresh the page.");
        toast({
          variant: "destructive",
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load stats",
        });
      });
  }, [isAdmin, toast]);

  if (status === "loading" || status === "unauthenticated" || !isAdmin) {
    return <Loader loading={true} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
            System Admin
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Control <span className="text-gradient">Center</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xl">
            Monitor activity, manage architecture, and curate the learning experience.
          </p>
        </div>
        <Button
          asChild
          className="premium-button h-14 px-8 rounded-2xl shrink-0"
        >
          <Link href="/admin/roadmaps/new" className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Roadmap
          </Link>
        </Button>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        {statsError && (
          <div className="col-span-full rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-4 text-sm font-medium text-destructive">
            {statsError}
          </div>
        )}
        {[
          { label: "Roadmaps", value: stats?.roadmapCount ?? "—", sub: "5 Live, 2 Draft", icon: FileText, color: "text-primary", bg: "bg-primary/5" },
          { label: "Published", value: stats?.publishedRoadmapCount ?? "—", sub: "Live", icon: FileText, color: "text-green-500", bg: "bg-green-500/5" },
          { label: "Nodes", value: stats?.nodeCount ?? "—", sub: "Checkpoints", icon: GitBranch, color: "text-amber-500", bg: "bg-amber-500/5" },
          { label: "Resources", value: stats?.resourceCount ?? "—", sub: "Learning Materials", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/5" },
          { label: "Users", value: stats?.userCount ?? "—", sub: "Total Learner Base", icon: Users, color: "text-blue-500", bg: "bg-blue-500/5" },
          { label: "Comments", value: stats?.commentCount ?? "—", sub: "Total", icon: Users, color: "text-purple-500", bg: "bg-purple-500/5" },
          { label: "Active (7d)", value: stats?.activeUsers?.last7Days ?? "—", sub: "Users active", icon: Users, color: "text-sky-500", bg: "bg-sky-500/5" },
          { label: "Active (30d)", value: stats?.activeUsers?.last30Days ?? "—", sub: "Users active", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/5" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card p-6 border-white/5 relative overflow-hidden group hover:bg-card/60 transition-all">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </span>
                <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-black text-foreground tabular-nums">
                  {stat.value}
                </div>
                <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                   {stat.sub}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Time Series Charts */}
      {stats?.timeSeries && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Signups (Last 7 Days)</CardTitle>
              <CardDescription>
                Total: {stats.timeSeries.signups.last7Days.total}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.timeSeries.signups.last7Days.daily.map((day) => (
                  <div key={day.date} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{day.date}</span>
                    <span className="font-medium">{day.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Roadmap Completions (Last 7 Days)</CardTitle>
              <CardDescription>
                Total: {stats.timeSeries.roadmapCompletions.last7Days.total}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.timeSeries.roadmapCompletions.last7Days.daily.map((day) => (
                  <div key={day.date} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{day.date}</span>
                    <span className="font-medium">{day.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="hover-lift glass-card gradient-border cursor-pointer">
          <Link href="/admin/roadmaps">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Manage Roadmaps</CardTitle>
                  <CardDescription>
                    View, edit, and publish roadmaps
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover-lift glass-card gradient-border cursor-pointer">
          <Link href="/admin/roadmaps/new">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Plus className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle>Create Roadmap</CardTitle>
                  <CardDescription>
                    Add a new learning roadmap
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover-lift glass-card gradient-border cursor-pointer">
          <Link href="/admin/analytics">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    View platform statistics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover-lift glass-card gradient-border cursor-pointer">
          <Link href="/admin/users">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover-lift glass-card gradient-border cursor-pointer">
          <Link href="/admin/settings">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Settings className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Platform configuration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest changes and updates to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Plus className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Database seeded successfully</p>
                <p className="text-xs text-muted-foreground">
                  7 roadmaps, 53 nodes, 121 resources imported
                </p>
                <p className="text-xs text-muted-foreground mt-1">Just now</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">MongoDB schema created</p>
                <p className="text-xs text-muted-foreground">
                  21 collections with production-ready structure
                </p>
                <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Settings className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">API routes configured</p>
                <p className="text-xs text-muted-foreground">
                  RESTful endpoints for roadmaps, nodes, and resources
                </p>
                <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
