"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/use-toast";

interface SettingsData {
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
  cache: {
    roadmapListTtl: number;
    roadmapDetailTtl: number;
  };
  points: {
    nodeCompleted: number;
    roadmapCompleted: number;
  };
  subscriptionTiers: Record<string, {
    maxCustomRoadmaps: number;
    maxTeamMembers: number;
    premiumResources: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
  }>;
  featureGates: Record<string, string>;
  featureDefinitions: {
    features: Record<string, string>;
    featureList: string[];
    subscriptionTierDefinitions: Record<string, unknown>;
    tierList: string[];
  };
  platformSnapshot: {
    usersByRole: Record<string, number>;
    subscriptions: { tier: string; status: string; count: number }[];
  };
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    fetchSettings();
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      } else {
        setError(data.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated" || !isAdmin) {
    return <Loader loading={true} />;
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              Platform Settings
            </h1>
            <p className="text-muted-foreground">
              View platform configuration and runtime values
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Pagination Defaults</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Default Page Size</span>
                <p className="text-lg font-semibold">{settings?.pagination.defaultPageSize}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Max Page Size</span>
                <p className="text-lg font-semibold">{settings?.pagination.maxPageSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Cache TTLs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Roadmap List TTL</span>
                <p className="text-lg font-semibold">{settings?.cache.roadmapListTtl}s</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Roadmap Detail TTL</span>
                <p className="text-lg font-semibold">{settings?.cache.roadmapDetailTtl}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Gamification Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Node Completed</span>
                <p className="text-lg font-semibold">{settings?.points.nodeCompleted} pts</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Roadmap Completed</span>
                <p className="text-lg font-semibold">{settings?.points.roadmapCompleted} pts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Subscription Tier Limits</CardTitle>
          </CardHeader>
          <CardContent>
            {settings?.subscriptionTiers && Object.entries(settings.subscriptionTiers).map(([tier, limits]) => (
              <div key={tier} className="mb-4 last:mb-0">
                <h4 className="font-semibold mb-2">{tier}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <span>Max Roadmaps: {limits.maxCustomRoadmaps}</span>
                  <span>Max Team Members: {limits.maxTeamMembers}</span>
                  <span>Premium Resources: {limits.premiumResources ? "Yes" : "No"}</span>
                  <span>Advanced Analytics: {limits.advancedAnalytics ? "Yes" : "No"}</span>
                  <span>Priority Support: {limits.prioritySupport ? "Yes" : "No"}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Feature Gates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {settings?.featureGates && Object.entries(settings.featureGates).map(([feature, tier]) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}: {tier}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Platform Snapshot</CardTitle>
            <CardDescription>Live database statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Users by Role</h4>
                <div className="flex flex-wrap gap-4">
                  {settings?.platformSnapshot.usersByRole && Object.entries(settings.platformSnapshot.usersByRole).map(([role, count]) => (
                    <div key={role} className="text-sm">
                      <span className="text-muted-foreground">{role}:</span>
                      <span className="font-medium ml-1">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Subscription Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Tier</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings?.platformSnapshot.subscriptions.map((sub, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2">{sub.tier}</td>
                          <td className="p-2">{sub.status}</td>
                          <td className="p-2">{sub.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}