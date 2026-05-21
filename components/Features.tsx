"use client";

import { motion } from "framer-motion";
import { Code, BookOpen, Map } from "lucide-react";
import { BsArrowRight } from "react-icons/bs";

const features = [
  {
    title: "Customized Roadmaps",
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
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Features</h2>
          <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Everything you need to <span className="text-gradient">succeed in tech</span>
          </p>
          <p className="text-lg text-muted-foreground">
            We&apos;ve built the most comprehensive platform for developers to map their career and master new technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-card glass-card-hover group p-8 rounded-[2rem] border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center text-primary font-semibold text-sm cursor-pointer group/link">
                Learn more 
                <BsArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
    </section>
  );
};

export default Features;
