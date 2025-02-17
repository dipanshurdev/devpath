"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuGithub, LuTwitter, LuCoffee } from "react-icons/lu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const features = [
  {
    title: "Beginner-Friendly Roadmaps",
    description: "Clear, step-by-step learning paths for various tech stacks.",
  },
  {
    title: "Free Resources",
    description:
      "Curated lists of free learning materials for each step of your journey.",
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning journey with interactive checkpoints.",
  },
  {
    title: "Community-Driven",
    description: "Benefit from and contribute to a growing knowledge base.",
  },
];

const roadmaps = [
  {
    name: "Frontend Development",
    description: "Master HTML, CSS, JavaScript, and modern frameworks.",
  },
  {
    name: "Backend Development",
    description: "Learn server-side programming, databases, and APIs.",
  },
  {
    name: "DevOps",
    description:
      "Explore the world of CI/CD, containerization, and cloud platforms.",
  },
  {
    name: "Mobile Development",
    description:
      "Build apps for iOS and Android using React Native or Flutter.",
  },
  {
    name: "All Roadmaps",
    description:
      "Check out all available roadmaps and start your learning journey.",
    link: "/roadmaps",
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className="min-h-screen  dark:bg-gray-900">
      {/* <header className=" dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primaryWhite dark:text-white">
            DevPath
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <LuMoon className="h-5 w-5" />
            ) : (
              <LuSun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header> */}

      <main className="max-w-4xl  mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-primaryWhite dark:text-white mb-8">
            About DevPath
          </h2>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-12 "
          >
            <TabsList className="grid w-full grid-cols-3 bg-primaryDark rounded-lg text-primaryWhite">
              <TabsTrigger value="mission">Our Mission</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="team">Roadmaps</TabsTrigger>
            </TabsList>
            <TabsContent value="mission">
              <Card className="bg-primaryDark border-none text-primaryWhite">
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                  <CardDescription className="text-light">
                    Empowering beginner developers with free, structured
                    learning paths
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-light dark:text-gray-300">
                    DevPath is a passion project created by a solo developer
                    with a mission to make the journey into tech more accessible
                    and structured for beginners. I believe that quality
                    education should be free and available to everyone. That's
                    why DevPath offers carefully crafted roadmaps filled with
                    free resources, guiding you step-by-step through your
                    learning journey. Whether you're starting from scratch or
                    looking to expand your skills, DevPath is here to light the
                    way on your path to becoming a proficient developer.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-primaryDark border-none text-primaryWhite"
                  >
                    <CardHeader>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-light dark:text-gray-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="team">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roadmaps.map((roadmap, index) => (
                  <Card
                    key={index}
                    className="bg-primaryDark border-none text-primaryWhite"
                  >
                    <CardHeader>
                      {roadmap.link ? (
                        <Link href={roadmap.link}>
                          <CardTitle>{roadmap.name}</CardTitle>
                        </Link>
                      ) : (
                        <CardTitle>{roadmap.name}</CardTitle>
                      )}
                    </CardHeader>

                    <CardContent>{roadmap.description}</CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-light dark:text-white mb-4">
              Get Involved
            </h3>
            <p className="text-light dark:text-gray-300 mb-6">
              DevPath is a community-driven project. Your contributions, whether
              it's suggesting new resources, improving existing roadmaps, or
              helping with the platform itself, are always welcome. Join our
              community and help make learning to code more accessible for
              everyone!
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/dipanshurdev/devpath"
                className="bg-primaryBlue text-primaryWhite px-4 py-2 rounded-lg flex items-center hover:scale-105 transition-all duration-300"
              >
                <LuGithub className="mr-2 h-4 w-4" /> Contribute on GitHub
              </Link>

              <Link
                href="https://x.com/dipanshurdev"
                className="bg-primaryBlue text-primaryWhite px-4 py-2 rounded-lg flex items-center hover:scale-105 transition-all duration-300"
              >
                <LuTwitter className="mr-2 h-4 w-4" /> Follow for Updates
              </Link>

              <Link
                href="#"
                className="bg-primaryBlue text-primaryWhite px-4 py-2 rounded-lg flex items-center hover:scale-105 transition-all duration-300"
              >
                <LuCoffee className="mr-2 h-4 w-4" /> Buy Me a Coffee
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
