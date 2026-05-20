"use client";

import { BsArrowRight, BsCode, BsLightningCharge } from "react-icons/bs";
import { PiPath } from "react-icons/pi";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroRoadmap from "./HeroAnimation/HeroRoadmap";

const stats = [
  {
    icon: BsCode,
    label: "Technologies",
    value: "15+",
    color: "#1e40af",
  },
  {
    icon: PiPath,
    label: "Learning Paths",
    value: "10+",
    color: "#1e40af",
  },
  {
    icon: BsLightningCharge,
    label: "Active Learners",
    value: "50+",
    color: "#1e40af",
  },
];

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-background via-background to-background dark:bg-[linear-gradient(21deg,#171717_20%,#171717_60%,#1e40af_80%,#171717_99%)]">
      {/* Premium Background Elements */}
      <div className="glow-background bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 dark:bg-blue-900/20" />
      <div className="glow-background bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-purple-900/10" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-8 w-fit shadow-inner dark:bg-blue-900/30 dark:border-blue-500/40 dark:text-blue-100 dark:shadow-blue-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 dark:bg-blue-800"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary dark:bg-blue-500"></span>
              </span>
              The Future of Tech Education
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground mb-8 leading-[0.95] lg:leading-[0.9] dark:text-white dark:drop-shadow-lg">
              Master Your <br />
              <span className="text-gradient drop-shadow-sm dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-200 dark:to-white">Tech Journey</span>
            </h1>

            <p className="max-w-xl text-xl text-muted-foreground/80 mb-12 leading-relaxed font-medium dark:text-blue-100/90 dark:text-gray-200">
              DevPath provides expert-curated learning paths and interactive roadmaps to help you navigate your career with absolute precision.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/register"
                className="premium-button group px-10 py-5 text-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-500 dark:shadow-blue-500/20 dark:hover:shadow-blue-500/30"
              >
                Get Started Free
                <BsArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 dark:text-white" />
              </Link>
              <Link
                href="/roadmaps"
                className="px-10 py-5 rounded-xl border border-border bg-card/30 backdrop-blur-sm font-semibold hover:bg-card hover:border-primary/40 transition-all duration-300 shadow-sm dark:bg-neutral-800/50 dark:hover:bg-neutral-700/60 dark:border-blue-500/30 dark:hover:border-blue-500/50 dark:text-white"
              >
                Explore Roadmaps
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/50 pt-10 dark:border-blue-500/20">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <dd className="text-3xl font-bold text-foreground dark:text-white dark:drop-shadow-sm">
                    {stat.value}
                  </dd>
                  <dt className="text-sm font-medium text-muted-foreground mt-1 dark:text-blue-100/80 dark:text-gray-300">
                    {stat.label}
                  </dt>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative z-20 glass-card p-4 rounded-[2rem] border-primary/20 shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)]  dark:bg-transparent">
              <HeroRoadmap />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse dark:bg-blue-500/30" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse dark:bg-blue-600/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
