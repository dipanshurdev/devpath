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
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-primaryWhite mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="flex justify-between items-center w-full px-4 py-2 text-lg font-medium text-left text-light bg-darkLight rounded-lg hover:text-primaryWhite focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50"
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 " />
                ) : (
                  <ChevronDown className="w-5 h-5 " />
                )}
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 py-2 text-primaryWhite  rounded-b-lg"
                  >
                    {faq.answer}
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
