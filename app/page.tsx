"use client";

import CTA from "@/components/CTA";
import FAQ from "@/components/FAQs";
import Features from "@/components/Features";
import Hero from "@/components/hero/Hero";
import LandingFooter from "@/components/landing-footer";
import TrendingRoadmaps from "@/components/roadmaps/TrendingRoadmaps";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <TrendingRoadmaps />
      <Features />
      <FAQ />
      <CTA />
      <LandingFooter />
    </div>
  );
}
