"use client"

import { memo } from "react"
import { Handle, Position } from "reactflow"
import { CheckCircle, Circle, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NodeData } from "@/lib/roadmap-data"

interface RoadmapNodeProps {
  data: NodeData & {
    isCompleted: boolean
    isSelected: boolean
    onClick: () => void
  }
}

export const RoadmapNode = memo(({ data }: RoadmapNodeProps) => {
  const getNodeStyle = () => {
    if (data.isCompleted) {
      return "bg-green-50 border-green-500 dark:bg-green-950 dark:border-green-400"
    }
    if (data.isSelected) {
      return "bg-primary/10 border-primary shadow-lg shadow-primary/20"
    }
    return "bg-card border-border hover:border-primary/50 hover:shadow-lg"
  }

  const getIconColor = () => {
    if (data.isCompleted) return "text-green-500"
    if (data.isSelected) return "text-primary"
    return "text-muted-foreground"
  }

  return (
    <div
      className={`
        relative min-w-[200px] max-w-[280px] p-4 rounded-lg border-2 cursor-pointer
        transition-all duration-200 hover:scale-105
        ${getNodeStyle()}
      `}
      onClick={data.onClick}
    >
      {/* Top Handle */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-primary bg-background" />

      {/* Content */}
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm leading-tight">{data.title}</h3>
            {data.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{data.description}</p>}
          </div>
          <div className={`ml-2 ${getIconColor()}`}>
            {data.isCompleted ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {data.type && (
            <Badge variant="outline" className="text-xs">
              {data.type}
            </Badge>
          )}
          {data.difficulty && (
            <Badge
              variant="outline"
              className={`text-xs ${
                data.difficulty === "Beginner"
                  ? "border-green-500 text-green-500"
                  : data.difficulty === "Intermediate"
                    ? "border-yellow-500 text-yellow-500"
                    : "border-red-500 text-red-500"
              }`}
            >
              {data.difficulty}
            </Badge>
          )}
        </div>

        {/* Resources indicator */}
        {data.resourceCount && data.resourceCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>{data.resourceCount} resources</span>
          </div>
        )}

        {/* Progress indicator for selected node */}
        {data.isSelected && <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />}
      </div>

      {/* Bottom Handle */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-primary bg-background" />
    </div>
  )
})

RoadmapNode.displayName = "RoadmapNode"
