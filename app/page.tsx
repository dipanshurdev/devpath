// import Footer from "@/components/Footer";
import Hero from "@/components/hero/Hero";
// import Navbar from "@/components/navbar/Navbar";
import OpenSourceSection from "@/components/OSS";
import Roadmaps from "@/components/roadmaps/Roadmaps";
import { Roles } from "@/lib/randomStack";

export default function Home() {
  return (
    <div className="p-4 ">
      <Hero />
      <Roadmaps title="Role Based" data={Roles} />
      {/* <Roadmaps title="Skill Based" inBuilding /> */}
      <OpenSourceSection />
    </div>
  );
}
