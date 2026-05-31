"use client";

import { motion } from "framer-motion";
import { Code, BookOpen, Map } from "lucide-react";
import { BsArrowRight } from "react-icons/bs";

const features = [
  {
    title: "Dynamic Learning Trees",
    description:
      "Interactive dependency graphs that illustrate prerequisites and skill progression paths in absolute detail.",
    icon: Map,
  },
  {
    title: "Production-Ready Materials",
    description:
      "Carefully validated open-source docs, labs, and interactive environments matching industry demands.",
    icon: BookOpen,
  },
  {
    title: "Engineering Sandboxes",
    description:
      "Step-by-step challenges, quizzes, and code review check-ins built to test practical syntax mastery.",
    icon: Code,
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background border-b border-border/40 relative overflow-hidden">
      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">ENGINEERING PLATFORM</h2>
          <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Systematic learning, <span className="text-gradient">engineered for depth.</span>
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-normal">
            No simplified overviews. We structure career paths and tech stacks into rigorous, actionable modules designed to turn software builders into domain experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-card glass-card-hover group p-8 border border-border/60 dark:border-zinc-800/80 rounded-xl"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-neutral-950 transition-all duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer group/link uppercase tracking-wider">
                Explore Details 
                <BsArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
