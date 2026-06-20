import { Clock, Users, Star, Construction } from "lucide-react";
import React from "react";

const difficultyConfig: Record<string, string> = {
  Beginner:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Intermediate:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Advanced:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  Expert:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

type Props = {
  getDifficultyColor?: (difficulty: string) => string;
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
  const badgeClass =
    difficultyConfig[roadmap.difficulty] ?? difficultyConfig.Intermediate;

  return (
    <div className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-border/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badgeClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {roadmap.difficulty}
            </span>
            {roadmap.category && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border border-border bg-muted/40 text-muted-foreground">
                {roadmap.category}
              </span>
            )}
          </div>
        </div>

        {/* Title & description */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground leading-snug tracking-tight mb-1 group-hover:text-primary transition-colors duration-150">
            {roadmap.title}
          </h3>
          {roadmap.description && (
            <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
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
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border/60"
              >
                {tech}
              </span>
            ))}
            {roadmap.technologies.length > 3 && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border/60">
                +{roadmap.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 py-3 border-t border-b border-border/60 text-[12px] text-muted-foreground">
          {roadmap.duration && (
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="shrink-0" />
              <span>{roadmap.duration}</span>
            </div>
          )}
          {roadmap.learners && (
            <div className="flex items-center gap-1.5">
              <Users size={12} className="shrink-0" />
              <span>{roadmap.learners} learners</span>
            </div>
          )}
          {roadmap.rating && (
            <div className="flex items-center gap-1.5">
              <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />
              <span>{roadmap.rating}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-70"
        >
          <Construction size={14} />
          Coming Soon
        </button>
      </div>
    </div>
  );
};
