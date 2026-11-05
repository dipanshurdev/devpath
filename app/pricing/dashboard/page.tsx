"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Sparkles,
  Shield,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";
import { toast } from "sonner";

type SubscriptionData = {
  id: string;
  tier: "FREE" | "PRO" | "TEAM";
  status: "ACTIVE" | "CANCELLED" | "PAST_DUE";
  currentPeriodStart: string;
  currentPeriodEnd: string | null;
  externalId: string | null;
};

export default function PricingDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/pricing/dashboard");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/subscriptions/me")
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to load subscription");
          const data = await res.json();
          setSubscription(data.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.error(data.error || "Unable to open billing portal. Please subscribe first.");
      }
    } catch {
      toast.error("Network error opening billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <Loader loading={true} />;
  }

  const tier = subscription?.tier || "FREE";
  const isPaid = tier === "PRO" || tier === "TEAM";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="relative border-b border-border/60 dark:border-zinc-800 pt-28 pb-12">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-border text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider mb-6">
              Billing & Subscriptions
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground dark:text-white mb-2">
              Manage your plan
            </h1>
            <p className="text-sm text-muted-foreground">
              Review your current subscription, payment details, and billing preferences.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-xl pt-10 space-y-8">
        {/* Current Plan Card */}
        <div className="border border-border/60 dark:border-zinc-800 bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Current Tier
              </span>
              <Badge
                variant="outline"
                className={`text-xs px-2.5 py-0.5 font-bold ${
                  tier === "FREE"
                    ? "border-border text-muted-foreground"
                    : "border-primary/50 text-primary bg-primary/10"
                }`}
              >
                {tier}
              </Badge>
              {subscription?.status && (
                <span className="text-xs text-muted-foreground">
                  Status: <strong className="text-foreground dark:text-white capitalize">{subscription.status.toLowerCase()}</strong>
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-white">
              {tier === "FREE"
                ? "DevPath Free Plan"
                : tier === "PRO"
                ? "DevPath Pro Plan"
                : "DevPath Team Plan"}
            </h2>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              {tier === "FREE"
                ? "You have access to all public community roadmaps and essential progress tracking."
                : tier === "PRO"
                ? "You have full access to custom roadmaps, premium resources, and advanced analytics."
                : "You have unlimited custom roadmaps, team collaboration features, and shared progress."}
            </p>

            {subscription?.currentPeriodEnd && (
              <p className="text-xs text-muted-foreground">
                Renews on{" "}
                <span className="font-medium text-foreground dark:text-white">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {isPaid ? (
              <Button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="premium-button text-xs font-semibold h-10 px-6 gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {portalLoading ? "Opening..." : "Manage in Stripe Portal"}
              </Button>
            ) : (
              <Button
                asChild
                className="premium-button text-xs font-semibold h-10 px-6 gap-2 group"
              >
                <Link href="/pricing">
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Plan comparison / feature reminder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
          <div className="bg-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white">Custom Roadmaps</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Build and customize private learning paths tailored to your career milestones.
            </p>
          </div>

          <div className="bg-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white">Curated Resources</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Handpicked videos, tutorials, and deep-dive documentation for each node.
            </p>
          </div>

          <div className="bg-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white">Zero Lock-in</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cancel anytime with one click in the Stripe customer portal. Keep all your progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
