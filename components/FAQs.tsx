"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is DevPath?",
    answer:
      "DevPath is a platform that provides personalized learning paths and curated resources for developers at all levels. It offers interactive roadmaps to guide you through your coding journey.",
  },
  {
    question: "Is DevPath suitable for beginners?",
    answer:
      "DevPath caters to developers of all skill levels, including complete beginners. Our roadmaps start from the basics and progress to advanced topics.",
  },
  {
    question: "Are the resources on DevPath free?",
    answer:
      "Yes, we curate and provide links to free learning resources. However, some external resources may have their own pricing models.",
  },
  {
    question: "How often are the roadmaps updated?",
    answer:
      "We regularly update our roadmaps to keep up with the latest trends and technologies in the ever-evolving field of software development.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">FAQ</h2>
          <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Got <span className="text-gradient">questions?</span>
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className={`
                  flex justify-between items-center w-full p-6 text-lg font-bold text-left transition-all duration-300
                  ${activeIndex === index ? "glass-card text-primary rounded-t-[1.5rem]" : "glass-card-hover bg-card/40 hover:bg-card/60 rounded-[1.5rem] text-foreground"}
                  border border-border/50
                `}
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <div className={`p-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-primary text-white rotate-180" : "bg-primary/10 text-primary"}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden glass-card rounded-b-[1.5rem] border-t-0 border-border/50"
                  >
                    <div className="p-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
    </section>
  );
};

export default FAQ;
