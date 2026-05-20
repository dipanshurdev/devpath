"use client";

import CTA from "@/components/CTA";
import FAQ from "@/components/FAQs";
import Features from "@/components/Features";
import Hero from "@/components/hero/Hero";
import LandingFooter from "@/components/landing-footer";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Features />
      <FAQ />
      <CTA />
      <LandingFooter />
    </div>
  );
}
