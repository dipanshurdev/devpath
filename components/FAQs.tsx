"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What makes DevPath different from blog posts or articles?",
    answer:
      "Unlike static articles, DevPath provides structured interactive paths that treat skills like architectural dependencies. You see the step-by-step connections, prerequisites, and resource depth in a comprehensive graph.",
  },
  {
    question: "Is DevPath designed only for senior developers?",
    answer:
      "No. Our curricula start from foundational fundamentals and branch into advanced specialties. Whether you are learning core frontend architecture or senior system design, the paths adjust dynamically to your starting tier.",
  },
  {
    question: "Are the study resources curated from premium courses?",
    answer:
      "We prioritize highly vetted, comprehensive open-source documents, standard specifications, and free tutorials. Where necessary, we include direct links to premium documentation if it represents the industry gold standard.",
  },
  {
    question: "How frequently are the roadmaps updated?",
    answer:
      "Our curriculum engine updates paths regularly to match current production frameworks and standard practices, ensuring you are not study-pathing deprecated libraries.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background border-b border-border/40 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">INQUIRIES</h2>
          <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Frequently asked <span className="text-gradient">questions.</span>
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-3">
              <button
                className={`
                  flex justify-between items-center w-full p-5 text-base font-bold text-left transition-all duration-200
                  ${activeIndex === index ? "glass-card text-neutral-900 dark:text-white rounded-t-xl" : "glass-card-hover bg-card/45 hover:bg-card/90 rounded-xl text-foreground"}
                  border border-border/60 dark:border-zinc-800/80
                `}
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <div className={`p-1 rounded-full transition-all duration-200 ${activeIndex === index ? "bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rotate-180" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden glass-card rounded-b-xl border-t-0 border-border/60 dark:border-zinc-800/80"
                  >
                    <div className="p-5 text-sm text-muted-foreground leading-relaxed font-normal">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
