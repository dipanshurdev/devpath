"use client";

import { BsArrowRight, BsCode, BsLightningCharge } from "react-icons/bs";
import { PiPath } from "react-icons/pi";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroRoadmap from "./HeroAnimation/HeroRoadmap";

const stats = [
  {
    icon: BsCode,
    label: "Technologies Covered",
    value: "15+",
  },
  {
    icon: PiPath,
    label: "Interactive Paths",
    value: "10+",
  },
  {
    icon: BsLightningCharge,
    label: "Active Engineers",
    value: "50+",
  },
];

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden pt-24 pb-20 lg:pt-36 lg:pb-32 bg-background border-b border-border/40">
      {/* Refined Grid Line Accents (instead of giant blobs) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-border text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider mb-8 w-fit">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Engineered Developer Curricula
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05] dark:text-white">
              Map your engineering <br />
              <span className="text-gradient">career with precision.</span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground mb-10 leading-relaxed font-normal">
              DevPath structures complex software engineering disciplines into clear, step-by-step interactive roadmaps. Skip the tutorial hell and build real technical expertise.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="premium-button group px-8 py-4 text-sm font-semibold flex items-center gap-2"
              >
                Get Started Free
                <BsArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/roadmaps"
                className="px-8 py-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm font-semibold hover:bg-card/90 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 text-sm"
              >
                Explore Roadmaps
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/40 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <dd className="text-2xl font-bold text-foreground dark:text-white">
                    {stat.value}
                  </dd>
                  <dt className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                    {stat.label}
                  </dt>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative z-20 glass-card p-2 border border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
              <HeroRoadmap />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
