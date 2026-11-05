"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

interface ApiAchievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  rarity: Rarity;
  requirement: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

interface Achievement {
  key: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  points: number;
  rarity: Rarity;
  unlocked: boolean;
  unlockedAt: string | null;
}

interface AchievementStats {
  total: number;
  unlocked: number;
  totalPoints: number;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Trophy,
  Flame,
  BookOpen,
  Star,
  Zap,
  Target,
  Users,
  CheckCircle2,
};

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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-card p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-muted rounded" />
        <div className="w-16 h-4 bg-muted rounded" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-3 bg-muted rounded" />
        <div className="w-full h-3 bg-muted rounded" />
        <div className="w-2/3 h-3 bg-muted rounded" />
      </div>
      <div className="w-16 h-3 bg-muted rounded mt-auto" />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const { status } = useSession();
  const router = useRouter();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({ total: 0, unlocked: 0, totalPoints: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function loadAchievements() {
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) throw new Error("Failed to fetch achievements");
        const json = await res.json();
        const data = json.data ?? json;

        const mapped: Achievement[] = (data.achievements as ApiAchievement[]).map((a) => ({
          key: a.key,
          name: a.name,
          description: a.description,
          icon: ICON_MAP[a.icon] ?? Trophy,
          category: a.category,
          points: a.points,
          rarity: a.rarity,
          unlocked: a.unlocked,
          unlockedAt: a.unlockedAt,
        }));

        setAchievements(mapped);
        setStats(data.stats);
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, [status]);

  const categories = Array.from(new Set(achievements.map((a) => a.category)));

  // Rarest unlocked achievement
  const RARITY_ORDER: Rarity[] = ["LEGENDARY", "EPIC", "RARE", "COMMON"];
  const rarestUnlocked = RARITY_ORDER.find((r) =>
    achievements.some((a) => a.unlocked && a.rarity === r)
  );

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

        {/* Stats pill */}
        {!loading && (
          <div className="flex items-center gap-2 border border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/10 px-4 py-2 self-start sm:self-auto">
            <Trophy className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              {stats.unlocked} / {stats.total} Achievements &bull; {stats.totalPoints} pts earned
            </span>
          </div>
        )}
      </div>

      {/* Stat bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-border/60 dark:border-zinc-800 divide-x divide-y lg:divide-y-0 divide-border/60 dark:divide-zinc-800">
        {[
          {
            label: "Unlocked",
            value: loading ? "—" : `${stats.unlocked} / ${stats.total}`,
            icon: Trophy,
            accent: "text-amber-500",
          },
          {
            label: "Points Earned",
            value: loading ? "—" : stats.totalPoints.toLocaleString(),
            icon: Star,
            accent: "text-primary",
          },
          {
            label: "Categories",
            value: loading ? "—" : categories.length,
            icon: Target,
            accent: "text-violet-500",
          },
          {
            label: "Rarest",
            value: loading ? "—" : rarestUnlocked
              ? RARITY_CONFIG[rarestUnlocked].label
              : "—",
            icon: Flame,
            accent: "text-rose-500",
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

      {/* Achievement grid — grouped by category */}
      {loading ? (
        // Skeleton state
        <div className="space-y-8">
          {["Progress", "Streak", "Points"].map((cat) => (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {cat}
                </p>
                <div className="flex-1 h-px bg-border/60 dark:bg-zinc-800" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        categories.map((cat, ci) => {
          const items = achievements.filter((a) => a.category === cat);
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
        })
      )}

      {/* Keep learning CTA */}
      {!loading && (
        <div className="flex justify-center pt-4">
          <Button asChild className="premium-button px-5 py-2.5 text-xs group">
            <Link href="/roadmaps" className="flex items-center gap-2">
              Keep learning
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      )}
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
  const { icon: Icon, name, description, rarity, points, unlocked, unlockedAt } = achievement;
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
        {unlocked && unlockedAt && (
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            Unlocked {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}
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
