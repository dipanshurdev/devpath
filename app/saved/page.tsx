"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, Search, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import RoadmapCardLazy from "@/components/roadmaps/RoadmapCardLazy";
import { useSavedRoadmaps } from "@/lib/hooks/use-bookmark";

interface SavedRoadmap {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: string;
  viewCount?: number;
  isFeatured?: boolean;
  creator?: {
    name: string;
    username: string;
    avatar?: string;
  };
  _count?: {
    likes?: number;
    bookmarks?: number;
  };
}

export default function SavedRoadmapsPage() {
  const { data: _session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");

  const { data: savedRoadmaps = [], isLoading, error } = useSavedRoadmaps();
  console.log(savedRoadmaps);
  

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/saved");
    }
  }, [status, router]);

  // Filter saved roadmaps
  const filteredRoadmaps = React.useMemo(() => {
    if (!savedRoadmaps) return [];
    
    return (savedRoadmaps as SavedRoadmap[]).filter((roadmap: SavedRoadmap) => {
      const matchesSearch = !searchTerm || 
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roadmap.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === "all" || roadmap.type === filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [savedRoadmaps, searchTerm, filterType]);

  // Get unique types for filter
  const uniqueTypes = React.useMemo(() => {
    if (!savedRoadmaps) return [];
    const types = (savedRoadmaps as SavedRoadmap[]).map((r: SavedRoadmap) => r.type);
    return Array.from(new Set(types));
  }, [savedRoadmaps]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-12 w-full max-w-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Saved Roadmaps</h2>
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t load your saved roadmaps. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 my-10">
      <div className="container section">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-12"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-2xl">
                  <Bookmark className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-foreground tracking-tight mb-2">
                  Your Collection
                </h1>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    {savedRoadmaps.length} saved
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    Curated learning paths
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your personal library of roadmaps, carefully saved for your learning journey. 
              Explore, track progress, and build your expertise.
            </motion.p>

            {/* Search and Filters */}
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative flex-1 max-w-xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <Input
                    placeholder="Search your collection..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base bg-card/50 border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                  className="h-12 px-6 font-medium"
                >
                  All
                </Button>
                {uniqueTypes.map((type: string) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type)}
                    className="h-12 px-6 font-medium"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <motion.div 
            className="card-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Skeleton className="h-80 w-full rounded-3xl bg-card/50" />
              </motion.div>
            ))}
          </motion.div>
        ) : filteredRoadmaps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-card to-card/50 border border-white/10 rounded-3xl p-12">
                <BookOpen className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-3xl font-black text-foreground mb-4">
                  {savedRoadmaps.length === 0 
                    ? "Start Your Collection" 
                    : "No Matches Found"
                  }
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  {savedRoadmaps.length === 0
                    ? "Your learning journey begins here. Explore roadmaps and save the ones that spark your curiosity."
                    : "Try adjusting your search terms or filters to discover roadmaps in your collection."
                  }
                </p>
                {savedRoadmaps.length === 0 && (
                  <Button 
                    asChild 
                    size="lg"
                    className="h-14 px-8 text-base font-medium group"
                  >
                    <a href="/roadmaps" className="flex items-center gap-2">
                      Explore Roadmaps
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08 }}
            className="card-grid"
          >
            {filteredRoadmaps.map((roadmap: SavedRoadmap, index: number) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <RoadmapCardLazy
                  roadmapId={roadmap.roadmapId}
                  title={roadmap.title}
                  description={roadmap.description}
                  type={roadmap.type}
                  difficulty={roadmap.difficulty}
                  estimatedTime={roadmap.estimatedTime}
                  viewCount={roadmap.viewCount}
                  likeCount={roadmap._count?.likes || 0}
                  bookmarkCount={roadmap._count?.bookmarks || 0}
                  isBookmarked={true}
                  isFeatured={roadmap.isFeatured}
                  creator={roadmap.creator}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
