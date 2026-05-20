"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Book,
  ChevronDown,
  ChevronUp,
  Code,
  FileVideo,
  Folder,
  Gamepad,
  LinkIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { useSession } from "next-auth/react";

const getResourceIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "article":
    case "documentation":
      return <Book className="w-4 h-4" />;
    case "video":
    case "tutorial":
      return <FileVideo className="w-4 h-4" />;
    case "docs":
      return <Folder className="w-4 h-4" />;
    case "game":
    case "interactive":
      return <Gamepad className="w-4 h-4" />;
    default:
      return <Code className="w-4 h-4" />;
  }
};

export default function NodeDetails({
  node,
  isCompleted,
  onComplete,
  roadmapId,
}: {
  node: any;
  isCompleted: boolean;
  onComplete: () => void;
  roadmapId: string;
}) {
  const { data: session } = useSession();
  const [checkedResourceIds, setCheckedResourceIds] = useState<string[]>([]);
  const [expandedResources, setExpandedResources] = useState<Set<number>>(
    new Set(),
  );
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleResourceExpansion = (index: number) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleCheckbox = async (resourceId: string) => {
    const isChecked = checkedResourceIds.includes(resourceId);
    setCheckedResourceIds((prev) =>
      isChecked
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId],
    );
  };

  const completionPercentage =
    node.resources?.length > 0
      ? (checkedResourceIds.length / node.resources.length) * 100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full overflow-hidden glass-card !bg-background/40"
    >
      {/* Header */}
      <div className="p-8 border-b border-border/40 bg-card/20 relative">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Checkpoint
            </div>
            
            <Button
              onClick={onComplete}
              className={`rounded-xl px-6 font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg ${
                isCompleted
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  : "premium-button"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark Done
                </>
              )}
            </Button>
          </div>

          <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">
            {node.title}
          </h2>
        </div>

        {node.description && (
          <div className="mt-4">
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
              {!expanded && node.description.length > 200
                ? `${node.description.slice(0, 200)}...`
                : node.description}
            </p>
            {node.description.length > 200 && (
              <button
                className="mt-4 text-primary text-xs font-bold hover:underline transition-all flex items-center gap-1.5"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    Show less details <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Read full overview <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Resources & Progress */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar bg-card/10">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Progress
            </h3>
            <span className="text-xs font-bold text-primary">
              {Math.round(completionPercentage)}% Complete
            </span>
          </div>
          <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Resources</h3>
          <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
            {checkedResourceIds.length} of {node.resources?.length || 0}
          </span>
        </div>

        {node.resources && node.resources.length > 0 ? (
          <div className="space-y-4">
            {node.resources.map((resource: any, index: number) => (
              <ResourceCard
                key={resource.id || index}
                resource={resource}
                index={index}
                isExpanded={expandedResources.has(index)}
                checked={checkedResourceIds.includes(resource.id)}
                onToggleExpand={() => toggleResourceExpansion(index)}
                onCheckToggle={() => toggleCheckbox(resource.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-[2rem] border-2 border-dashed border-border/50 bg-card/20">
            <Book className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm font-bold text-muted-foreground">
              No specialized resources yet.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ResourceCard({
  resource,
  index,
  isExpanded,
  checked,
  onToggleExpand,
  onCheckToggle,
}: {
  resource: any;
  index: number;
  isExpanded: boolean;
  checked: boolean;
  onToggleExpand: () => void;
  onCheckToggle: () => void;
}) {
  const shouldShowToggle = resource?.description?.length > 150;
  const displayDescription =
    isExpanded || !shouldShowToggle
      ? resource?.description
      : `${resource?.description?.slice(0, 150)}...`;

  return (
    <div
      className={`group relative p-6 rounded-[1.5rem] border-2 transition-all duration-300 ${
        checked
          ? "bg-primary border-primary shadow-xl shadow-primary/10"
          : "bg-card border-border/50 hover:border-primary/40 hover:bg-card/70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl transition-colors duration-300 ${
              checked ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
            }`}
          >
            {getResourceIcon(resource.type)}
          </div>
          <div className="flex-1">
            <h4
              className={`text-lg font-bold leading-tight mb-1 transition-colors ${
                checked ? "text-white" : "text-foreground"
              }`}
            >
              {resource.title}
            </h4>
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${
                  checked ? "text-white/60" : "text-primary/60"
                }`}
              >
                {resource.type || "Module"}
              </span>
              <span className={`w-1 h-1 rounded-full ${checked ? "bg-white/30" : "bg-border"}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${checked ? "text-white/60" : "text-muted-foreground"}`}>
                {resource.difficulty || "Essential"}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onCheckToggle}
          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
            checked
              ? "bg-white border-white text-primary rotate-0"
              : "border-border/60 hover:border-primary text-transparent"
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 transition-transform ${checked ? "scale-100" : "scale-0"}`} />
        </button>
      </div>

      {resource.description && (
        <div className="mt-4">
          <p
            className={`text-sm leading-relaxed font-medium transition-colors ${
              checked ? "text-white/80" : "text-muted-foreground"
            }`}
          >
            {displayDescription}
          </p>
          {shouldShowToggle && (
            <button
              className={`mt-3 text-xs font-bold hover:underline underline-offset-4 transition-all ${
                checked ? "text-white" : "text-primary"
              }`}
              onClick={onToggleExpand}
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        {resource.url ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/link inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
              checked ? "text-white hover:text-white/80" : "text-primary hover:text-primary/80"
            }`}
          >
            Access Resource 
            <LinkIcon className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        ) : (
          <div />
        )}
        
        {!checked && (
          <button 
            onClick={onCheckToggle}
            className="text-[10px] font-bold text-primary hover:underline"
          >
            Mark as learned
          </button>
        )}
      </div>
    </div>
  );
}
