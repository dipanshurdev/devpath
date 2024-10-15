import React from "react";
import {
  BsArrowRight,
  BsCode,
  BsBook,
  BsLightningCharge,
} from "react-icons/bs";

const Hero = () => {
  return (
    <div
    // className=""
    >
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Your Developer Roadmap to Success
            </h1>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 dark:text-gray-300">
              Navigate your tech career with confidence. Our curated learning
              paths guide you through the skills you need to become a proficient
              developer.
            </p>
            <div className="mt-8">
              <a
                href="#get-started"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Get Started
                <BsArrowRight
                  className="ml-3 -mr-1 h-5 w-5"
                  aria-hidden="true"
                />
              </a>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-8">
              {[
                { icon: BsCode, label: "Technologies", value: "50+" },
                { icon: BsBook, label: "Learning Paths", value: "20+" },
                {
                  icon: BsLightningCharge,
                  label: "Active Learners",
                  value: "100K+",
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
                    className="order-0 mb-2 h-8 w-8 text-primary-400"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* <div className="flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 h-72 w-72 animate-blob rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
              <div className="animation-delay-2000 absolute top-0 -right-4 h-72 w-72 animate-blob rounded-full bg-yellow-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
              <div className="animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 animate-blob rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter"></div>
              <div className="relative space-y-4">
                {["Frontend", "Backend", "DevOps", "Mobile", "AI/ML"].map(
                  (path, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-white p-5 shadow-lg dark:bg-gray-800"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {path}
                      </h3>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-primary-500"
                          style={{
                            width: `${Math.floor(Math.random() * 60 + 40)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div> */}

          {/* 
          import React, { useState } from 'react'
import { ChevronRight, Code, Database, Server, Smartphone, Cpu } from 'lucide-react'

type SkillNode = {
  id: string
  label: string
  icon: React.ElementType
  children?: SkillNode[]
}

const skillTree: SkillNode[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Code,
    children: [
      { id: 'html', label: 'HTML', icon: Code },
      { id: 'css', label: 'CSS', icon: Code },
      { id: 'javascript', label: 'JavaScript', icon: Code },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: Server,
    children: [
      { id: 'nodejs', label: 'Node.js', icon: Server },
      { id: 'databases', label: 'Databases', icon: Database },
      { id: 'api', label: 'API Design', icon: Server },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    icon: Smartphone,
    children: [
      { id: 'react-native', label: 'React Native', icon: Smartphone },
      { id: 'flutter', label: 'Flutter', icon: Smartphone },
      { id: 'swift', label: 'Swift', icon: Smartphone },
    ],
  },
  {
    id: 'ai-ml',
    label: 'AI/ML',
    icon: Cpu,
    children: [
      { id: 'python', label: 'Python', icon: Code },
      { id: 'tensorflow', label: 'TensorFlow', icon: Cpu },
      { id: 'pytorch', label: 'PyTorch', icon: Cpu },
    ],
  },
]

const SkillNode: React.FC<{ node: SkillNode; level: number }> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(level === 0)

  return (
    <div className={`ml-${level * 4}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-left text-gray-800 hover:text-primary-600 focus:outline-none dark:text-gray-200 dark:hover:text-primary-400"
      >
        <ChevronRight
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
        <node.icon className="h-5 w-5" />
        <span className="text-sm font-medium">{node.label}</span>
      </button>
      {isOpen && node.children && (
        <div className="mt-2 space-y-2">
          {node.children.map((child) => (
            <SkillNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function RoadmapVisualization() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Developer Roadmap
      </h2>
      <div className="space-y-4">
        {skillTree.map((node) => (
          <SkillNode key={node.id} node={node} level={0} />
        ))}
      </div>
    </div>
//   ) */}
          {/* } */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
