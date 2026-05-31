"use client";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

const CTA = () => {
  return (
    <section className="py-24 bg-background border-b border-border/40 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
        <div className="bg-neutral-950 text-white dark:bg-neutral-900/60 p-12 md:p-20 rounded-xl text-center relative overflow-hidden border border-neutral-800 shadow-2xl">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.15]">
              Begin crafting your <br />
              <span className="text-neutral-400">engineering path.</span>
            </h2>
            <p className="text-base text-neutral-400 mb-10 leading-relaxed font-normal">
              Accelerate your progression. DevPath gives you a structured, step-by-step framework to skip the tutorial loop and master software systems in depth.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-neutral-950 hover:bg-neutral-100 px-8 py-4 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg flex items-center gap-2"
              >
                Get Started Free
                <BsArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-750 px-8 py-4 rounded-lg font-bold text-sm transition-all duration-200"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
