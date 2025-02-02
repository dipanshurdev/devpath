"use client";

import CTA from "@/components/CTA";
import FAQ from "@/components/FAQs";
import Features from "@/components/Features";
import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <div className="p-4 ">
      <Hero />
      <Features />
      <FAQ />
      <CTA />
    </div>
  );
}
