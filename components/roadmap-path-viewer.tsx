"use client"

import { useState, useEffect, useRef } from "react"
import type { Roadmap, RoadmapNode } from "@/types/roadmap"
import { ResourcePanel } from "@/components/resource-panel"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Maximize, Minimize, Clock, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

interface RoadmapPathViewerProps {
  roadmap: Roadmap
  userCompletedNodes?: string[]
}

export function RoadmapPathViewer({ roadmap, userCompletedNodes = [] }: RoadmapPathViewerProps) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pathProgress, setPathProgress] = useState(0)

  // Calculate the number of completed nodes
  const completedNodesCount = userCompletedNodes.length
  const totalNodesCount = roadmap.nodes.length
  const progressPercentage = totalNodesCount > 0 ? (completedNodesCount / totalNodesCount) * 100 : 0

  useEffect(() => {
    // Animate path progress when component mounts
    const timer = setTimeout(() => {
      setPathProgress(100)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node)
    setIsPanelOpen(true)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Determine if a node is completed
  const isNodeCompleted = (nodeId: string) => {
    return userCompletedNodes.includes(nodeId)
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-white dark:bg-black rounded-xl border border-border overflow-hidden glass-card shadow-lg ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : "h-[700px]"
      }`}
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="icon" onClick={toggleFullscreen} className="bg-background/80 backdrop-blur-sm">
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{roadmap.estimated_time_to_finish ?? roadmap.estimatedTime ?? "—"}</span>
        </Badge>
      </div>

      <div className="h-full w-full overflow-auto p-8">
        <div className="relative min-h-[600px] w-full">
          {/* The road/path */}
          <svg
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: 1 }}
            viewBox="0 0 1000 800"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Main path */}
            <path
              d="M100,100 C150,100 150,200 200,200 S250,300 300,300 S350,400 400,400 S450,500 500,500 S550,600 600,600"
              fill="none"
              stroke="url(#roadGradient)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (1000 * pathProgress) / 100}
              className="transition-all duration-1000 ease-in-out"
            />

            {/* Glowing effect */}
            <path
              d="M100,100 C150,100 150,200 200,200 S250,300 300,300 S350,400 400,400 S450,500 500,500 S550,600 600,600"
              fill="none"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#glow)"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (1000 * pathProgress) / 100}
              className="transition-all duration-1000 ease-in-out"
            />

            {/* Animated particles along the path */}
            <circle r="5" fill="#ffffff" className="animate-pulse">
              <animateMotion
                dur="10s"
                repeatCount="indefinite"
                path="M100,100 C150,100 150,200 200,200 S250,300 300,300 S350,400 400,400 S450,500 500,500 S550,600 600,600"
              />
            </circle>
            <circle r="4" fill="#ffffff" className="animate-pulse">
              <animateMotion
                dur="15s"
                repeatCount="indefinite"
                path="M100,100 C150,100 150,200 200,200 S250,300 300,300 S350,400 400,400 S450,500 500,500 S550,600 600,600"
                begin="2s"
              />
            </circle>
            <circle r="3" fill="#ffffff" className="animate-pulse">
              <animateMotion
                dur="12s"
                repeatCount="indefinite"
                path="M100,100 C150,100 150,200 200,200 S250,300 300,300 S350,400 400,400 S450,500 500,500 S550,600 600,600"
                begin="5s"
              />
            </circle>
          </svg>

          {/* Nodes */}
          <div className="relative z-10">
            {roadmap.nodes.map((node, index) => {
              // Calculate position based on index
              const top = 100 + index * 100
              const left = 100 + (index % 2) * 100 // Alternate left position for visual interest

              const completed = isNodeCompleted(node.nodeId)

              return (
                <motion.div
                  key={node.nodeId}
                  className={`absolute cursor-pointer ${
                    completed
                      ? "bg-green-100 dark:bg-green-900 border-green-500"
                      : "bg-white dark:bg-gray-800 border-primary"
                  } rounded-xl border-2 p-4 shadow-lg w-64 hover-lift glass-card`}
                  style={{ top: `${top}px`, left: `${left}px` }}
                  onClick={() => handleNodeClick(node)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="font-bold text-lg mb-1">{node.title}</h3>
                  <p className="text-sm text-muted-foreground">{node.description}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <Badge
                      variant={completed ? "secondary" : "outline"}
                      className={
                        completed
                          ? "text-xs border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                          : "text-xs"
                      }
                    >
                      {completed ? "Completed" : "Not Started"}
                    </Badge>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {node.resources.length}
                    </Badge>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Resource panel */}
      <div
        className={`absolute top-0 right-0 h-full bg-background/95 backdrop-blur-md border-l border-border transition-all duration-300 ${
          isPanelOpen ? "w-full md:w-1/3 translate-x-0" : "w-0 translate-x-full"
        }`}
      >
        {isPanelOpen && selectedNode && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPanelOpen(false)}
              className="absolute top-2 left-2 z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <ResourcePanel node={selectedNode} />
          </>
        )}
      </div>

      {!isPanelOpen && selectedNode && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPanelOpen(true)}
          className="absolute top-1/2 right-0 -translate-y-1/2 rounded-l-full rounded-r-none border-r-0 bg-background/80 backdrop-blur-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Resources</span>
        </Button>
      )}
    </div>
  )
}
