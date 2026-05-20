"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  GitBranch,
  Heart,
  Bookmark,
} from "lucide-react";

interface Roadmap {
  id: string;
  roadmapId: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  status: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  _count: {
    nodes: number;
    likes: number;
    bookmarks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ManageRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/roadmaps");
      const data = await response.json();

      if (data.success) {
        setRoadmaps(data.data);
      } else {
        setError(data.error);
      }
} catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roadmapId: string) => {
    if (!confirm("Are you sure you want to delete this roadmap?")) {
      return;
    }

    try {
      const response = await fetch(`/api/roadmaps/${roadmapId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Roadmap deleted successfully!");
        fetchRoadmaps();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      alert(`Error: ${message}`);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading roadmaps...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              Manage Roadmaps
            </h1>
            <p className="text-muted-foreground">
              View and manage all learning roadmaps
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
            <Button
              asChild
              className="gradient-bg hover:opacity-90 transition-opacity"
            >
              <Link href="/admin/roadmaps/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Roadmaps List */}
      <div className="grid gap-6">
        {roadmaps.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No roadmaps found. Create your first roadmap!
              </p>
              <Button asChild>
                <Link href="/admin/roadmaps/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Roadmap
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          roadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="hover-lift glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{roadmap.title}</CardTitle>
                      <Badge variant={roadmap.isPublished ? "default" : "secondary"}>
                        {roadmap.isPublished ? "Published" : "Draft"}
                      </Badge>
                      {roadmap.isFeatured && (
                        <Badge variant="outline" className="bg-amber-500/10">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {roadmap.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-4 w-4" />
                        <span>{roadmap._count.nodes} nodes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{roadmap.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{roadmap._count.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="h-4 w-4" />
                        <span>{roadmap._count.bookmarks} saves</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/roadmaps/${roadmap.roadmapId}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/roadmaps/${roadmap.roadmapId}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(roadmap.roadmapId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{roadmap.type}</Badge>
                  <Badge variant="outline">{roadmap.difficulty}</Badge>
                  <Badge variant="outline">ID: {roadmap.roadmapId}</Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
