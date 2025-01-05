"use client";

import { BsArrowRight, BsCode, BsLightningCharge } from "react-icons/bs";
import { PiPath } from "react-icons/pi";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroRoadmap from "./HeroAnimation/HeroRoadmap";

const stats = [
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
];

const Hero = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              The Ultimate Guide to Your Developer Success
            </h1>
            <p className="mt-4 max-w-3xl text-xl text-primaryWhite">
              Navigate your tech career with confidence. Our curated learning
              paths guide you through the skills you need to become a proficient
              developer.
            </p>
            <div className="mt-8">
              <Link
                href="/roadmaps"
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Get Started
                <BsArrowRight
                  className="ml-3 -mr-1 h-5 w-5"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <dt className="order-2 mt-2 text-lg font-medium text-light ">
                    {stat.label}
                  </dt>
                  <dd className="order-1 text-3xl font-extrabold text-primaryWhite">
                    {stat.value}
                  </dd>
                  <stat.icon
                    className="order-0 mb-2 h-12 w-12 text-blue-500 "
                    aria-hidden="true"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="items-center justify-center hidden lg:flex"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full h-[500px] max-w-lg">
              <HeroRoadmap />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
