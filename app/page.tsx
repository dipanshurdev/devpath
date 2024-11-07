// import Footer from "@/components/Footer";
import Hero from "@/components/hero/Hero";
// import Navbar from "@/components/navbar/Navbar";
import OpenSourceSection from "@/components/OSS";
import Roadmaps from "@/components/roadmaps/Roadmaps";

export default function Home() {
  return (
    <div className="p-4">
      <Hero />
      <Roadmaps />
      <OpenSourceSection />
    </div>
  );
}
