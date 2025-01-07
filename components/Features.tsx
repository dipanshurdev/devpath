"use client";

import { motion } from "framer-motion";
import { Code, BookOpen, Map } from "lucide-react";

const features = [
  {
    title: "Customized Learning Paths",
    description:
      "Tailored roadmaps for various developer roles and skill levels.",
    icon: Map,
    color: "from-purple-400 to-pink-600",
  },
  {
    title: "Curated Resources",
    description:
      "Hand-picked free learning materials for each step of your journey.",
    icon: BookOpen,
    color: "from-green-400 to-cyan-500",
  },
  {
    title: "Interactive Roadmaps",
    description: "Visualize your progress with our interactive roadmap tool.",
    icon: Code,
    color: "from-yellow-400 to-orange-500",
  },
];

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-primaryWhite sm:text-4xl">
            Why Choose DevPath?
          </p>
        </div>
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flow-root bg-darkLight  rounded-lg px-6 pb-8">
                  <div className="-mt-6 text-center">
                    <div>
                      <span
                        className={`inline-flex items-center justify-center p-3 bg-gradient-to-r ${feature.color} rounded-md shadow-lg`}
                      >
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-2xl font-medium text-primaryWhite tracking-tight">
                      {feature.title}
                    </h3>
                    <p className=" text-base text-light dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
