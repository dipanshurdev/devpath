"use client";

import { motion } from "framer-motion";
import { Code, BookOpen, Map } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Map,
    title: "Dynamic learning trees",
    description:
      "Interactive dependency graphs that illustrate prerequisites and skill progression paths in precise, step-by-step detail.",
  },
  {
    icon: BookOpen,
    title: "Production-ready materials",
    description:
      "Carefully validated open-source docs, labs, and interactive environments matched to current industry demands.",
  },
  {
    icon: Code,
    title: "Engineering sandboxes",
    description:
      "Step-by-step challenges, quizzes, and code review check-ins built to verify practical mastery at every stage.",
  },
];

export default function Features() {
  return (
    <section className="border-b border-border/60 dark:border-zinc-800 bg-background">
      <div className="container-xl py-16">
        {/* Header row — left-aligned, same as other redesigned sections */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20 mb-10 pb-8 border-b border-border/60 dark:border-zinc-800">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Engineering Platform
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white">
              Systematic learning, engineered for depth.
            </h2>
          </div>
          <div className="lg:col-span-3 flex flex-col justify-end">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              No simplified overviews. We structure career paths and tech stacks into rigorous, actionable modules designed to turn software builders into domain experts.
            </p>
          </div>
        </div>

        {/* Feature cells — borderless flat grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border/60 dark:border-zinc-800 bg-border/60 dark:bg-zinc-800">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group bg-card px-7 py-8 hover:bg-neutral-50 dark:hover:bg-zinc-900/60 transition-colors"
            >
              {/* Icon box — neutral fill, inverts on hover */}
              <div className="inline-flex items-center justify-center w-10 h-10 mb-6 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-neutral-950 transition-colors duration-200">
                <feature.icon className="w-5 h-5" />
              </div>

              <h3 className="text-sm font-semibold text-foreground dark:text-white mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-7 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground dark:group-hover:text-white transition-colors">
                Explore
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
