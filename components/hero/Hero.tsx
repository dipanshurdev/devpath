import React from "react";
import { BsArrowRight, BsCode, BsLightningCharge } from "react-icons/bs";
import { PiPath } from "react-icons/pi";
import HeroRoadmap from "./HeroAnimation/HeroRoadmap";

const Hero = () => {
  return (
    <div className="lg:container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primaryWhite  sm:text-5xl md:text-6xl">
            Your Developer Roadmap to Success
          </h1>
          <p className="mt-4 max-w-3xl text-xl text-primaryWhite">
            Navigate your tech career with confidence. Our curated learning
            paths guide you through the skills you need to become a proficient
            developer.
          </p>
          <div className="mt-8">
            <a
              href="#roadmaps"
              className="inline-flex items-center rounded-lg bg-primaryBlue  px-6 py-3 text-base text-white  "
            >
              Get Started
              <BsArrowRight className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: BsCode,
                label: "Technologies",
                value: "15+",
                color: "#1e40af",
              },
              {
                icon: PiPath,
                label: "Learning Paths",
                value: "10+",
                color: "#1e40af",
              },
              {
                icon: BsLightningCharge,
                label: "Active Learners",
                value: "05+",
                color: "#1e40af",
              },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <dt className="order-2 mt-2 text-lg font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </dt>
                <dd className="order-1 text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </dd>
                <stat.icon
                  className="order-0 mb-2 h-12 w-12 text-primary-400"
                  aria-hidden="true"
                  color={stat.color}
                />
              </div>
            ))}
          </div>
        </div>
        <div className=" items-center justify-center max-sm:hidden lg:flex">
          <div className="relative w-full h-[500px] max-w-lg">
            <HeroRoadmap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
