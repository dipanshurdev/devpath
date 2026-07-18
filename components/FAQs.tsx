"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What makes DevPath different from blog posts or articles?",
    answer:
      "Unlike static articles, DevPath provides structured interactive paths that treat skills like architectural dependencies. You see the step-by-step connections, prerequisites, and resource depth in a comprehensive graph.",
  },
  {
    question: "Is DevPath designed only for senior developers?",
    answer:
      "No. Our curricula start from foundational fundamentals and branch into advanced specialties. Whether you are learning core frontend architecture or senior system design, the paths adjust to your starting tier.",
  },
  {
    question: "Are the study resources curated from premium courses?",
    answer:
      "We prioritize highly vetted, comprehensive open-source documents, standard specifications, and free tutorials. Where necessary, we include direct links to premium documentation if it represents the industry gold standard.",
  },
  {
    question: "How frequently are the roadmaps updated?",
    answer:
      "Our curriculum is updated regularly to match current production frameworks and standard practices, ensuring you are not following deprecated libraries.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="border-b border-border/60 dark:border-zinc-800 bg-background">
      <div className="container-xl py-16">
        {/* Header */}
        <div className="flex items-baseline gap-6 mb-10 pb-6 border-b border-border/60 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            FAQ
          </p>
          <h2 className="text-lg font-semibold text-foreground dark:text-white">
            Common questions
          </h2>
        </div>

        {/* Two-column layout on desktop — questions left, answers right */}
        <div className="max-w-3xl">
          <div className="border border-border/60 dark:border-zinc-800 divide-y divide-border/60 dark:divide-zinc-800">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-start justify-between gap-6 px-6 py-5 text-left hover:bg-neutral-50 dark:hover:bg-zinc-900/40 transition-colors group"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span
                    className={`text-sm font-semibold leading-snug transition-colors ${
                      open === i
                        ? "text-foreground dark:text-white"
                        : "text-foreground/80 dark:text-neutral-300 group-hover:text-foreground dark:group-hover:text-white"
                    }`}
                  >
                    {faq.question}
                  </span>
                  {/* Plus → rotates to × */}
                  <span
                    className={`shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 border transition-all duration-200 ${
                      open === i
                        ? "border-foreground dark:border-white bg-foreground dark:bg-white text-background dark:text-neutral-950 rotate-45"
                        : "border-border/60 dark:border-zinc-700 text-muted-foreground"
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/60 dark:border-zinc-800 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
