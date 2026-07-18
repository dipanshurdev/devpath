import { Clock, Users, Construction } from "lucide-react";
import React from "react";

const difficultyDot: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-blue-500",
  Advanced: "bg-orange-500",
  Expert: "bg-purple-500",
};

const difficultyText: Record<string, string> = {
  Beginner: "text-emerald-600 dark:text-emerald-400",
  Intermediate: "text-blue-600 dark:text-blue-400",
  Advanced: "text-orange-600 dark:text-orange-400",
  Expert: "text-purple-600 dark:text-purple-400",
};

type Props = {
  roadmap: {
    id: string;
    title: string;
    description?: string;
    difficulty: string;
    duration?: string;
    category?: string;
    learners?: string | number;
    rating?: number;
    technologies?: string[];
    projects?: number;
  };
};

export const AppendRoadmap = ({ roadmap }: Props) => {
  const dotClass = difficultyDot[roadmap.difficulty] ?? "bg-blue-500";
  const textClass = difficultyText[roadmap.difficulty] ?? "text-blue-600 dark:text-blue-400";

  return (
    <div className="group flex flex-col bg-card border-b border-r border-border/60 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors">
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${textClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {roadmap.difficulty}
          </div>
          {roadmap.category && (
            <>
              <span className="text-border/60 dark:text-zinc-700 select-none">·</span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {roadmap.category}
              </span>
            </>
          )}
        </div>

        {/* Title & description */}
        <div className="flex-1 space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground dark:text-white leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {roadmap.title}
          </h3>
          {roadmap.description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {roadmap.description}
            </p>
          )}
        </div>

        {/* Tech tags */}
        {roadmap.technologies && roadmap.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {roadmap.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-medium bg-neutral-100 dark:bg-zinc-800 text-muted-foreground border border-border/60 dark:border-zinc-700"
              >
                {tech}
              </span>
            ))}
            {roadmap.technologies.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-neutral-100 dark:bg-zinc-800 text-muted-foreground border border-border/60 dark:border-zinc-700">
                +{roadmap.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 border-t border-border/60 dark:border-zinc-800 pt-3 text-[11px] text-muted-foreground">
          {roadmap.duration && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {roadmap.duration}
            </span>
          )}
          {roadmap.learners && roadmap.learners !== "0" && (
            <span className="flex items-center gap-1">
              <Users size={11} />
              {roadmap.learners}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          disabled
          className="w-full flex items-center justify-center gap-1.5 h-9 text-[11px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-zinc-800/60 text-muted-foreground border border-border/60 dark:border-zinc-700 cursor-not-allowed opacity-60 transition-none"
        >
          <Construction size={12} />
          Coming Soon
        </button>
      </div>
    </div>
  );
};
