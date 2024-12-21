// import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQs";
import Features from "@/components/Features";
import Hero from "@/components/hero/Hero";
// import Navbar from "@/components/navbar/Navbar";
// import OpenSourceSection from "@/components/OSS";
// import Roadmaps from "@/components/roadmaps/Roadmaps";
// import { Roles, Lang } from "@/lib/randomStack";

export default function Home() {
  return (
    <div className="p-4 ">
      <Hero />
      <Features />
      <FAQ />
      <CTA />

      {/* <Roadmaps title="Skill Based" inBuilding /> */}
      {/* <OpenSourceSection /> */}
    </div>
  );
}
