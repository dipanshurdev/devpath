"use client";

import { motion } from "framer-motion";
import {
  Book,
  ChevronDown,
  ChevronUp,
  Code,
  MessageCircle,
  Send,
  Trash2,
  FileVideo,
  Folder,
  Gamepad,
  LinkIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

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
  roadmapId: _roadmapId,
}: {
  node: any;
  isCompleted: boolean;
  onComplete: () => void;
  roadmapId: string;
}) {
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
                isExpanded={expandedResources.has(index)}
                checked={checkedResourceIds.includes(resource.id)}
                onToggleExpand={() => toggleResourceExpansion(index)}
                onCheckToggle={() => toggleCheckbox(resource.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl border border-dashed border-border bg-card/10">
            <Book className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm font-bold text-muted-foreground">
              No specialized resources yet.
            </p>
          </div>
        )}

        <NodeComments nodeId={(node.nodeId as string) ?? (node.id as string)} />
      </div>
    </motion.div>
  );
}

type CommentAuthor = {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
};

type NodeReply = {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  isOwner: boolean;
  user: CommentAuthor;
};

type NodeComment = {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  isOwner: boolean;
  user: CommentAuthor;
  replies: NodeReply[];
};

const rateLimitMessage = "You're posting too fast — please wait a moment";

function getAuthorName(author: CommentAuthor) {
  return author.name || author.username || "DevPath user";
}

function getInitials(author: CommentAuthor) {
  return getAuthorName(author).slice(0, 2).toUpperCase();
}

function formatCommentDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isRateLimitError(status: number, data: { code?: string }) {
  return status === 429 || data.code === "RATE_LIMIT";
}

function NodeComments({ nodeId }: { nodeId: string }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<NodeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set(),
  );
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [replySubmittingId, setReplySubmittingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/nodes/${nodeId}/comments`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.error ?? "Failed to load comments");
          return;
        }

        if (!cancelled) {
          setComments(data.data.comments ?? []);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load comments");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  async function handlePostComment() {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await fetch(`/api/nodes/${nodeId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          isRateLimitError(response.status, data)
            ? rateLimitMessage
            : data.error ?? "Failed to post comment",
        );
        return;
      }

      setComments((current) => [data.data, ...current]);
      setNewComment("");
    } catch {
      setError("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePostReply(commentId: string) {
    const content = replyDrafts[commentId]?.trim();
    if (!content) return;

    try {
      setReplySubmittingId(commentId);
      setError(null);
      const response = await fetch(`/api/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          isRateLimitError(response.status, data)
            ? rateLimitMessage
            : data.error ?? "Failed to post reply",
        );
        return;
      }

      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, data.data] }
            : comment,
        ),
      );
      setReplyDrafts((current) => ({ ...current, [commentId]: "" }));
      setExpandedReplies((current) => new Set(current).add(commentId));
      setActiveReplyId(null);
    } catch {
      setError("Failed to post reply");
    } finally {
      setReplySubmittingId(null);
    }
  }

  async function handleDeleteComment(commentId: string) {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setComments((current) =>
        current.filter((comment) => comment.id !== commentId),
      );
      return;
    }

    const data = await response.json();
    setError(data.error ?? "Failed to delete comment");
  }

  async function handleDeleteReply(commentId: string, replyId: string) {
    const response = await fetch(`/api/replies/${replyId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter((reply) => reply.id !== replyId),
              }
            : comment,
        ),
      );
      return;
    }

    const data = await response.json();
    setError(data.error ?? "Failed to delete reply");
  }

  function toggleReplies(commentId: string) {
    setExpandedReplies((current) => {
      const next = new Set(current);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }

  return (
    <div className="mt-10 border-t border-border/40 pt-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-foreground">Comments</h3>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <MessageCircle className="w-4 h-4" />
          {comments.length}
        </span>
      </div>

      {status === "unauthenticated" ? (
        <p className="text-sm font-medium text-muted-foreground rounded-lg border border-dashed border-border bg-card/10 p-4">
          Sign in to comment.
        </p>
      ) : (
        <div className="space-y-3 mb-6">
          <Textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Add a comment"
            maxLength={5000}
            disabled={status !== "authenticated" || submitting}
          />
          <Button
            onClick={handlePostComment}
            disabled={!newComment.trim() || submitting}
            className="premium-button rounded-xl font-bold"
          >
            <Send className="w-4 h-4 mr-2" />
            Post comment
          </Button>
        </div>
      )}

      {error && (
        <p className="mb-4 text-sm font-bold text-destructive">{error}</p>
      )}

      {loading ? (
        <p className="text-sm font-medium text-muted-foreground">
          Loading comments...
        </p>
      ) : comments.length === 0 ? (
        <p className="text-sm font-medium text-muted-foreground">
          No comments yet.
        </p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => {
            const repliesExpanded = expandedReplies.has(comment.id);

            return (
              <div
                key={comment.id}
                className="rounded-lg border border-border/60 bg-card/40 p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 border border-primary/20">
                    <AvatarImage
                      src={comment.user.avatar || "/placeholder.svg"}
                      alt={getAuthorName(comment.user)}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {getInitials(comment.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-foreground">
                          {getAuthorName(comment.user)}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {formatCommentDate(comment.createdAt)}
                        </p>
                      </div>
                      {comment.isOwner && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {comment.content}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        {repliesExpanded ? "Hide" : "Show"}{" "}
                        {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"}
                      </button>
                      {session && (
                        <button
                          onClick={() => setActiveReplyId(comment.id)}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {repliesExpanded && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3 border-l border-border/50 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border border-primary/20">
                          <AvatarImage
                            src={reply.user.avatar || "/placeholder.svg"}
                            alt={getAuthorName(reply.user)}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                            {getInitials(reply.user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-foreground">
                                {getAuthorName(reply.user)}
                              </p>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {formatCommentDate(reply.createdAt)}
                              </p>
                            </div>
                            {reply.isOwner && (
                              <button
                                onClick={() =>
                                  handleDeleteReply(comment.id, reply.id)
                                }
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Delete reply"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeReplyId === comment.id && (
                  <div className="mt-4 space-y-3 pl-12">
                    <Textarea
                      value={replyDrafts[comment.id] ?? ""}
                      onChange={(event) =>
                        setReplyDrafts((current) => ({
                          ...current,
                          [comment.id]: event.target.value,
                        }))
                      }
                      placeholder="Write a reply"
                      maxLength={5000}
                      disabled={replySubmittingId === comment.id}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handlePostReply(comment.id)}
                        disabled={
                          !replyDrafts[comment.id]?.trim() ||
                          replySubmittingId === comment.id
                        }
                        className="premium-button rounded-xl font-bold"
                      >
                        Reply
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setActiveReplyId(null)}
                        className="rounded-xl font-bold"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResourceCard({
  resource,
  isExpanded,
  checked,
  onToggleExpand,
  onCheckToggle,
}: {
  resource: any;
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
      className={`group relative p-6 rounded-lg border transition-all duration-200 ${
        checked
          ? "bg-primary border-primary shadow-md shadow-primary/5"
          : "bg-card border-border/60 hover:border-neutral-350 hover:bg-card/70 dark:border-zinc-800/80"
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
