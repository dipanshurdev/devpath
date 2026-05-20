"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookmarkIcon, Code, Database, Globe, Server, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const featuredRoadmaps = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Learn HTML, CSS, JavaScript, and modern frontend frameworks",
    icon: Globe,
    likes: 2453,
    saves: 1289,
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Master server-side programming, APIs, and databases",
    icon: Server,
    likes: 1876,
    saves: 982,
  },
  {
    id: "fullstack",
    title: "Full Stack Development",
    description: "Combine frontend and backend skills to build complete applications",
    icon: Code,
    likes: 3241,
    saves: 1765,
  },
  {
    id: "react",
    title: "React.js",
    description: "Learn the popular JavaScript library for building user interfaces",
    icon: Code,
    likes: 2987,
    saves: 1543,
  },
  {
    id: "nextjs",
    title: "Next.js",
    description: "Master the React framework for production-grade applications",
    icon: Code,
    likes: 1876,
    saves: 1023,
  },
  {
    id: "mongodb",
    title: "MongoDB",
    description: "Learn the popular NoSQL database for modern applications",
    icon: Database,
    likes: 1432,
    saves: 876,
  },
]

export function FeaturedRoadmaps() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-32 bg-muted"></CardHeader>
            <CardContent className="h-24 mt-4 bg-muted"></CardContent>
            <CardFooter className="h-12 mt-4 bg-muted"></CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 stagger-fade-in">
      {featuredRoadmaps.map((roadmap) => (
        <Card key={roadmap.id} className="overflow-hidden hover-lift glass-card gradient-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2 border border-primary/20">
                <roadmap.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>{roadmap.title}</CardTitle>
            </div>
            <CardDescription>{roadmap.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span>{roadmap.likes.toLocaleString()} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <BookmarkIcon className="h-4 w-4 text-primary" />
                <span>{roadmap.saves.toLocaleString()} saves</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full gradient-bg hover:opacity-90 transition-opacity">
              <Link href={`/roadmap/${roadmap.id}`}>View Roadmap</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
