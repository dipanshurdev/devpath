"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import { CheckCircle2, FileText } from "lucide-react";
import { BsArrowRight } from "react-icons/bs";

interface CustomNodeData {
  title: string;
  description?: string;
  completed?: boolean;
  resources?: unknown[];
  nodeId: string;
  order?: number;
  category?: string;
  difficulty?: string;
}

const difficultyStyles: Record<string, string> = {
  Beginner:
    "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Intermediate:
    "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Advanced:
    "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
  Expert:
    "bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30",
};

function CustomNode({ data }: { data: CustomNodeData }) {
  const isCompleted = data.completed ?? false;
  const resourceCount = data.resources?.length ?? 0;
  const stepNum = (data.order ?? 0) + 1;
  const difficulty = data.difficulty ?? "";
  const difficultyClass =
    difficultyStyles[difficulty] ??
    "bg-muted/50 text-muted-foreground border-border/50";
  const category = data.category ?? "";

  return (
    <div className="group relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!opacity-0 group-hover:!opacity-100 !transition-opacity"
      />
      
      <div
        className={`
          relative flex flex-col w-[280px] rounded-[1.5rem] border transition-all duration-500 cursor-pointer
          backdrop-blur-sm
          ${
            isCompleted
              ? "bg-primary border-primary/50 shadow-[0_10px_30px_-10px_rgba(var(--primary),0.5)] text-primary-foreground"
              : "bg-card/80 border-border/50 hover:border-primary/40 text-foreground shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
          }
        `}
      >
        {/* Step Indicator Badge */}
        <div className="absolute -top-3 -left-3">
           <div className={`
             flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-xs shadow-lg
             ${isCompleted ? "bg-white text-primary border-primary" : "bg-primary text-white border-white"}
           `}>
             {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
           </div>
        </div>

        <div className="p-5 pt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {category && (
              <span className={`
                px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border
                ${isCompleted ? "bg-white/20 border-white/30 text-white" : "bg-secondary text-muted-foreground border-border"}
              `}>
                {category}
              </span>
            )}
            {difficulty && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${difficultyClass}`}>
                {difficulty}
              </span>
            )}
          </div>

          <h3 className={`
            font-bold text-base leading-snug tracking-tight mb-2
            ${isCompleted ? "text-white" : "text-foreground"}
          `}>
            {data.title}
          </h3>

          {data.description && (
            <p className={`
              text-xs line-clamp-2 leading-relaxed opacity-80 mb-4
              ${isCompleted ? "text-white/90" : "text-muted-foreground"}
            `}>
              {data.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div className={`
              flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide
              ${isCompleted ? "text-white/80" : "text-primary/80"}
            `}>
              <FileText className="w-3.5 h-3.5" />
              <span>{resourceCount} Resources</span>
            </div>
            
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1
              ${isCompleted ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}
            `}>
              <BsArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
        
        {/* Progress bar at the bottom for completed nodes */}
        {isCompleted && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded-b-full overflow-hidden">
            <div className="h-full bg-white w-full" />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!opacity-0 group-hover:!opacity-100 !transition-opacity"
      />
    </div>
  );
}

export default memo(CustomNode);
