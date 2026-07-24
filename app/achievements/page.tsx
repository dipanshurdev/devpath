"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  Lock,
  Flame,
  BookOpen,
  Star,
  Zap,
  Target,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

interface Achievement {
  key: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  points: number;
  rarity: Rarity;
  unlocked: boolean;
}

// ─── Static placeholder data ──────────────────────────────────────────────────
// These will be replaced with real API data once the achievements backend is live.

const ACHIEVEMENTS: Achievement[] = [
  {
    key: "first_step",
    name: "First Step",
    description: "Complete your first roadmap node.",
    icon: CheckCircle2,
    category: "Progress",
    points: 10,
    rarity: "COMMON",
    unlocked: false,
  },
  {
    key: "on_fire",
    name: "On Fire",
    description: "Maintain a 7-day learning streak.",
    icon: Flame,
    category: "Streak",
    points: 50,
    rarity: "RARE",
    unlocked: false,
  },
  {
    key: "bookworm",
    name: "Bookworm",
    description: "Save 10 roadmaps to your library.",
    icon: BookOpen,
    category: "Library",
    points: 20,
    rarity: "COMMON",
    unlocked: false,
  },
  {
    key: "rising_star",
    name: "Rising Star",
    description: "Earn 100 total points.",
    icon: Star,
    category: "Points",
    points: 30,
    rarity: "RARE",
    unlocked: false,
  },
  {
    key: "speed_runner",
    name: "Speed Runner",
    description: "Complete a roadmap in under 30 days.",
    icon: Zap,
    category: "Progress",
    points: 75,
    rarity: "EPIC",
    unlocked: false,
  },
  {
    key: "sharpshooter",
    name: "Sharpshooter",
    description: "Complete 5 roadmaps back-to-back.",
    icon: Target,
    category: "Progress",
    points: 100,
    rarity: "EPIC",
    unlocked: false,
  },
  {
    key: "social_learner",
    name: "Social Learner",
    description: "Like 20 roadmaps shared by the community.",
    icon: Users,
    category: "Community",
    points: 25,
    rarity: "COMMON",
    unlocked: false,
  },
  {
    key: "legend",
    name: "Legend",
    description: "Complete every official roadmap.",
    icon: Trophy,
    category: "Progress",
    points: 500,
    rarity: "LEGENDARY",
    unlocked: false,
  },
];

// ─── Rarity config ─────────────────────────────────────────────────────────────

const RARITY_CONFIG: Record<
  Rarity,
  { label: string; bg: string; text: string; ring: string }
> = {
  COMMON: {
    label: "Common",
    bg: "bg-neutral-100 dark:bg-zinc-800",
    text: "text-neutral-500 dark:text-zinc-400",
    ring: "ring-neutral-200 dark:ring-zinc-700",
  },
  RARE: {
    label: "Rare",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-500 dark:text-blue-400",
    ring: "ring-blue-200 dark:ring-blue-800",
  },
  EPIC: {
    label: "Epic",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-500 dark:text-violet-400",
    ring: "ring-violet-200 dark:ring-violet-800",
  },
  LEGENDARY: {
    label: "Legendary",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-500 dark:text-amber-400",
    ring: "ring-amber-200 dark:ring-amber-800",
  },
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const categories = Array.from(new Set(ACHIEVEMENTS.map((a) => a.category)));

  return (
    <div className="container-xl py-10 mt-20 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 pb-6 border-b border-border/60 dark:border-zinc-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Achievements
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white">
            Your Milestones
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Earn badges as you learn, streak, and explore.
          </p>
        </div>

        {/* Coming-soon pill */}
        <div className="flex items-center gap-2 border border-amber-300/60 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 self-start sm:self-auto">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Stat bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-border/60 dark:border-zinc-800 divide-x divide-y lg:divide-y-0 divide-border/60 dark:divide-zinc-800">
        {[
          { label: "Unlocked", value: "0 / 8", icon: Trophy, accent: "text-amber-500" },
          { label: "Points Earned", value: "0", icon: Star, accent: "text-primary" },
          { label: "Categories", value: categories.length, icon: Target, accent: "text-violet-500" },
          { label: "Rarest", value: "—", icon: Flame, accent: "text-rose-500" },
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

      {/* "Feature in progress" notice */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border border-dashed border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/10 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground dark:text-white">
              Achievement tracking is being built
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed max-w-md">
              Your progress will be tracked automatically once this feature
              ships. The badges below are a preview of what you&apos;ll be able
              to unlock.
            </p>
          </div>
        </div>
        <Button
          asChild
          className="premium-button px-5 py-2.5 text-xs shrink-0 group"
        >
          <Link href="/roadmaps" className="flex items-center gap-2">
            Keep learning
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </motion.div>

      {/* Achievement grid — grouped by category */}
      {categories.map((cat, ci) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === cat);
        return (
          <div key={cat} className="space-y-4">
            {/* Category heading */}
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {cat}
              </p>
              <div className="flex-1 h-px bg-border/60 dark:bg-zinc-800" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
              {items.map((achievement, i) => (
                <AchievementCard
                  key={achievement.key}
                  achievement={achievement}
                  index={ci * 10 + i}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Achievement card ──────────────────────────────────────────────────────────

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const { icon: Icon, name, description, rarity, points, unlocked } = achievement;
  const cfg = RARITY_CONFIG[rarity];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`bg-card p-5 flex flex-col gap-4 ${
        unlocked
          ? "hover:bg-neutral-50 dark:hover:bg-zinc-900/60"
          : "opacity-60"
      } transition-colors`}
    >
      {/* Icon + rarity ring */}
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 flex items-center justify-center ring-1 ${cfg.bg} ${cfg.ring}`}
        >
          {unlocked ? (
            <Icon className={`w-5 h-5 ${cfg.text}`} />
          ) : (
            <Lock className="w-4 h-4 text-muted-foreground/40" />
          )}
        </div>
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${cfg.bg} ${cfg.text}`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Text */}
      <div>
        <h4 className="text-sm font-semibold text-foreground dark:text-white leading-snug">
          {name}
        </h4>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Points */}
      <div className="flex items-center gap-1.5 mt-auto">
        <Star className="w-3 h-3 text-amber-500" />
        <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
          {points} pts
        </span>
      </div>
    </motion.div>
  );
}
