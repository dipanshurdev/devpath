"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Github, 
  Twitter, 
  Coffee, 
  Target, 
  Zap, 
  Users, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Target,
    title: "Structured Learning Paths",
    description: "Carefully curated roadmaps that guide you from beginner to professional, eliminating the confusion of what to learn next.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Free Quality Resources",
    description: "Access premium learning materials without the cost. Every resource is handpicked for its quality and effectiveness.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BookOpen,
    title: "Interactive Progress Tracking",
    description: "Monitor your journey with visual checkpoints, celebrate milestones, and stay motivated throughout your learning process.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Community-Driven Growth",
    description: "Join a thriving community of learners, contribute to roadmaps, and help shape the future of tech education.",
    gradient: "from-purple-500 to-pink-500",
  },
];

const stats = [
  { value: "50+", label: "Learning Paths" },
  { value: "1000+", label: "Free Resources" },
  { value: "5000+", label: "Active Learners" },
  { value: "24/7", label: "Always Available" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 blur-3xl" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="container section relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-20"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Open Source Education Platform</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-black text-foreground tracking-tight mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">DevPath</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Empowering the next generation of developers with free, structured, and community-driven learning paths. 
              Your journey from curious beginner to confident professional starts here.
            </p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button asChild size="lg" className="h-14 px-8 text-base font-medium group">
                <Link href="/roadmaps" className="flex items-center gap-2">
                  Explore Roadmaps
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base font-medium">
                <Link href="https://github.com/dipanshurdev/devpath" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  Contribute
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mission Section */}
      <div className="container section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-3xl" />
            <Card className="relative bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-2xl">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black text-foreground">Our Mission</h2>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                DevPath was born from a simple belief: <span className="text-foreground font-semibold">quality education should be free and accessible to everyone</span>. 
                As a solo developer passionate about making tech education more approachable, I created this platform to eliminate the confusion 
                and overwhelm that often accompanies learning to code.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every roadmap is carefully crafted with free, high-quality resources, guiding you step-by-step through your learning journey. 
                Whether you&apos;re starting from scratch or looking to expand your skills, DevPath is here to illuminate your path to becoming 
                a proficient developer. Together, we&apos;re building a future where anyone, anywhere can transform their career through technology.
              </p>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-foreground mb-4">Why DevPath?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to accelerate your learning journey, all in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group relative h-full bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-primary/30 transition-all duration-500">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-foreground mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-blue-500/30 to-primary/30 rounded-3xl blur-3xl" />
            <Card className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-black text-foreground mb-4">
                Join Our Community
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                DevPath is a community-driven project. Your contributions—whether suggesting resources, 
                improving roadmaps, or helping with the platform—are always welcome.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-medium group"
                >
                  <Link 
                    href="https://github.com/dipanshurdev/devpath" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-5 h-5" />
                    Contribute on GitHub
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-medium group"
                >
                  <Link 
                    href="https://x.com/dipanshurdev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Twitter className="w-5 h-5" />
                    Follow for Updates
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-medium group"
                >
                  <Link 
                    href="#" 
                    className="flex items-center gap-2"
                  >
                    <Coffee className="w-5 h-5" />
                    Support the Project
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
