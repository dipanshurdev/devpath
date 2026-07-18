"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { config, type SubscriptionTier } from "@/lib/config";
import { motion } from "framer-motion";

// ── Data ──────────────────────────────────────────────────────────────────

const FEATURE_LABELS: Record<string, string> = {
  custom_roadmaps: "Create custom roadmaps",
  team_collaboration: "Team collaboration",
  premium_resources: "Premium resources",
  advanced_analytics: "Advanced analytics",
  priority_support: "Priority support",
};

function buildFeatures(tier: SubscriptionTier) {
  const tierOrder: SubscriptionTier[] = ["FREE", "PRO", "TEAM"];
  const tierIndex = tierOrder.indexOf(tier);
  const base = [
    { name: "Access to public roadmaps", included: true },
    { name: "Progress tracking", included: true },
  ];
  const gates = Object.entries(config.featureGates).map(([key, required]) => ({
    name: FEATURE_LABELS[key] ?? key.replace(/_/g, " "),
    included: tierIndex >= tierOrder.indexOf(required as SubscriptionTier),
  }));
  return [...base, ...gates];
}

const plans = [
  {
    id: "FREE" as SubscriptionTier,
    name: "Free",
    tagline: "For anyone getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: buildFeatures("FREE"),
    highlight: false,
  },
  {
    id: "PRO" as SubscriptionTier,
    name: "Pro",
    tagline: "For serious learners",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: buildFeatures("PRO"),
    highlight: true,
  },
  {
    id: "TEAM" as SubscriptionTier,
    name: "Team",
    tagline: "For teams and organizations",
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    features: buildFeatures("TEAM"),
    highlight: false,
  },
];

const faq = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, cancel at any time. Your access continues until the end of your billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit cards, PayPal, and Apple Pay. All payments are processed securely.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, try Pro free for 14 days. No credit card required during the trial.",
  },
  {
    q: "Can I switch plans later?",
    a: "You can upgrade or downgrade at any time. Changes apply immediately.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="w-full min-h-screen bg-background pb-20">
      {/* subtle grid texture */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <div className="relative border-b border-border/60 dark:border-zinc-800 pt-28 pb-12">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-border text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
              Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground dark:text-white mb-4 leading-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Start for free. Upgrade when you need more. No hidden fees.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center gap-3">
            <Label
              htmlFor="billing-toggle"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                !yearly ? "text-foreground dark:text-white" : "text-muted-foreground"
              }`}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={yearly}
              onCheckedChange={setYearly}
            />
            <Label
              htmlFor="billing-toggle"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                yearly ? "text-foreground dark:text-white" : "text-muted-foreground"
              }`}
            >
              Yearly
            </Label>
            {yearly && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Plans grid */}
      <div className="container-xl pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`flex flex-col bg-card ${
                plan.highlight
                  ? "ring-1 ring-inset ring-primary dark:ring-blue-500"
                  : ""
              }`}
            >
              {/* Plan header */}
              <div
                className={`px-7 pt-8 pb-6 border-b border-border/60 dark:border-zinc-800 ${
                  plan.highlight ? "bg-primary/[0.03] dark:bg-blue-500/[0.05]" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary text-white text-[10px] font-semibold uppercase tracking-widest mb-4">
                    Most popular
                  </div>
                )}
                <h2 className="text-lg font-bold text-foreground dark:text-white mb-1">
                  {plan.name}
                </h2>
                <p className="text-xs text-muted-foreground mb-5">
                  {plan.tagline}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground dark:text-white tabular-nums">
                    ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{yearly ? "yr" : "mo"}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="px-7 py-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      {f.included ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-neutral-300 dark:text-zinc-600 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm leading-snug ${
                          f.included
                            ? "text-foreground dark:text-neutral-200"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {f.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-7 pb-8">
                <Button
                  className={`w-full h-10 rounded-none text-sm font-semibold group ${
                    plan.highlight
                      ? "premium-button"
                      : plan.id === "FREE"
                      ? "border border-border/80 dark:border-zinc-700 bg-transparent text-foreground dark:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                      : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors"
                  }`}
                  variant="ghost"
                  onClick={() => console.log(`Subscribe: ${plan.id}`)}
                >
                  {plan.id === "FREE" ? "Get started free" : "Subscribe"}
                  {plan.id !== "FREE" && (
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="container-xl pt-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            FAQ
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-white mb-8">
            Common questions
          </h2>

          <div className="border border-border/60 dark:border-zinc-800 divide-y divide-border/60 dark:divide-zinc-800">
            {faq.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="px-6 py-5 hover:bg-neutral-50 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2">
                  {item.q}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 border border-border/60 dark:border-zinc-800 bg-card px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-foreground dark:text-white">
              Still have questions?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              All public roadmaps are free forever. No credit card needed.
            </p>
          </div>
          <Button
            asChild
            className="premium-button px-7 py-3 text-sm group shrink-0"
          >
            <Link href="/roadmaps" className="flex items-center gap-2">
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
