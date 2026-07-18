"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="border-b border-border/60 dark:border-zinc-800 bg-background">
      <div className="container-xl py-16">
        {/* Dark panel — full-width, sharp corners, grid texture */}
        <div className="relative overflow-hidden bg-neutral-950 dark:bg-zinc-950 border border-neutral-800 dark:border-zinc-800">
          {/* Subtle grid overlay — same pattern as Hero */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 px-8 md:px-14 py-14">
            {/* Left — headline + body */}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
                Get started
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight mb-4">
                Begin crafting your <br className="hidden sm:block" />
                engineering path.
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
                DevPath gives you a structured, step-by-step framework to skip the tutorial loop and build real technical expertise — entirely free.
              </p>
            </div>

            {/* Right — CTAs + stat strip */}
            <div className="flex flex-col justify-center gap-6">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-neutral-950 text-sm font-semibold hover:bg-neutral-100 transition-colors group"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-7 py-3.5 border border-neutral-700 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
                >
                  View plans
                </Link>
              </div>

              {/* Three quick facts — no fake metrics, keeps it honest */}
              <div className="grid grid-cols-3 border-t border-neutral-800 pt-6 gap-4">
                {[
                  { value: "50+", label: "Roadmaps" },
                  { value: "Free", label: "Always" },
                  { value: "10+", label: "Career tracks" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xl font-bold text-white tabular-nums">
                      {item.value}
                    </div>
                    <div className="text-[11px] font-medium text-neutral-500 mt-0.5 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
