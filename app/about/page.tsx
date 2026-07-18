"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, Coffee, Target, Zap, Users, BookOpen, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Structured learning paths",
    description:
      "Carefully curated roadmaps that guide you from beginner to professional, eliminating the confusion of what to learn next.",
  },
  {
    icon: Zap,
    title: "Free quality resources",
    description:
      "Access premium learning materials without the cost. Every resource is handpicked for its quality and effectiveness.",
  },
  {
    icon: BookOpen,
    title: "Interactive progress tracking",
    description:
      "Monitor your journey with visual checkpoints, celebrate milestones, and stay motivated throughout your learning process.",
  },
  {
    icon: Users,
    title: "Community-driven growth",
    description:
      "Join a thriving community of learners, contribute to roadmaps, and help shape the future of tech education.",
  },
];

const stats = [
  { value: "50+", label: "Learning Paths" },
  { value: "1000+", label: "Free Resources" },
  { value: "5000+", label: "Active Learners" },
  { value: "24/7", label: "Always Available" },
];

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background pb-20">
      {/* subtle grid texture */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero */}
      <div className="relative border-b border-border/60 dark:border-zinc-800 pt-28 pb-16">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-border text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
              Open Source Education Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground dark:text-white mb-5 leading-tight">
              About DevPath
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mb-8">
              Empowering the next generation of developers with free, structured, and community-driven learning paths. Your journey from curious beginner to confident professional starts here.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="premium-button px-7 py-3 text-sm group"
              >
                <Link href="/roadmaps" className="flex items-center gap-2">
                  Explore Roadmaps
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none px-7 py-3 text-sm border-border/80 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Link
                  href="https://github.com/dipanshurdev/devpath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Contribute
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats row */}
      <div className="border-b border-border/60 dark:border-zinc-800">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/60 dark:divide-zinc-800">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="px-6 py-8"
              >
                <div className="text-3xl font-bold text-foreground dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="border-b border-border/60 dark:border-zinc-800">
        <div className="container-xl py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Mission
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white">
                Quality education should be free and accessible to everyone.
              </h2>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevPath was born from a simple belief. As a solo developer passionate about making tech education more approachable, I created this platform to eliminate the confusion and overwhelm that often accompanies learning to code.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every roadmap is carefully crafted with free, high-quality resources, guiding you step-by-step through your learning journey. Whether you&apos;re starting from scratch or looking to expand your skills, DevPath is here to illuminate your path to becoming a proficient developer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-b border-border/60 dark:border-zinc-800">
        <div className="container-xl py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Platform
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white">
              Why DevPath?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-card px-7 py-8 group hover:bg-neutral-50 dark:hover:bg-zinc-900/60 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 p-2 border border-border/60 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-900 shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Community CTA */}
      <div className="container-xl py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-border/60 dark:border-zinc-800 bg-card px-8 md:px-14 py-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Community
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white mb-3">
                Join the project
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DevPath is community-driven. Whether you&apos;re suggesting resources, improving roadmaps, or contributing code — your input shapes the platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button
                asChild
                className="premium-button px-6 py-3 text-sm group"
              >
                <Link
                  href="https://github.com/dipanshurdev/devpath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none px-6 py-3 text-sm border-border/80 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Link
                  href="https://x.com/dipanshurdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Follow updates
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none px-6 py-3 text-sm border-border/80 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Link href="#" className="flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Support
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
