"use client"

import { useState } from "react"
import Link from "next/link"
import { BookmarkIcon, Clock, Star, TrendingUp, Activity, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("in-progress")

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 mb-8 fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              Welcome back, <span className="gradient-text">User</span>
            </h1>
            <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
          </div>
          <Button asChild className="gradient-bg hover:opacity-90 transition-opacity">
            <Link href="/roadmaps">Explore New Roadmaps</Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 stagger-fade-in">
        <Card className="hover-lift glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>

        <Card className="hover-lift glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Active roadmaps</p>
          </CardContent>
        </Card>

        <Card className="hover-lift glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Finished roadmaps</p>
          </CardContent>
        </Card>

        <Card className="hover-lift glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Resources accessed</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="mb-8 glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <CardDescription>Your learning activity over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end justify-between gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              //  Random heights for demo
              const height = Math.random() * 150 + 20
              return (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div
                    className="w-8 bg-gradient-to-t from-primary to-purple-500 rounded-t-sm"
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-xs text-muted-foreground">{day}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Roadmaps Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 glass-card">
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-fade-in">
            <RoadmapProgressCard title="Frontend Development" progress={65} lastUpdated="2 days ago" id="frontend" />
            <RoadmapProgressCard title="React.js" progress={40} lastUpdated="1 week ago" id="react" />
            <RoadmapProgressCard title="Node.js" progress={25} lastUpdated="3 weeks ago" id="nodejs" />
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-fade-in">
            <RoadmapProgressCard title="HTML & CSS" progress={100} lastUpdated="2 months ago" id="html-css" />
            <RoadmapProgressCard title="Git & GitHub" progress={100} lastUpdated="1 month ago" id="git" />
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-fade-in">
            <SavedRoadmapCard
              title="TypeScript"
              description="Add static typing to JavaScript for better developer experience"
              likes={1765}
              saves={932}
              id="typescript"
            />
            <SavedRoadmapCard
              title="MongoDB"
              description="Learn the popular NoSQL database for modern applications"
              likes={1432}
              saves={876}
              id="mongodb"
            />
            <SavedRoadmapCard
              title="DevOps"
              description="Learn CI/CD, containerization, and cloud deployment"
              likes={1543}
              saves={876}
              id="devops"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RoadmapProgressCard({
  title,
  progress,
  lastUpdated,
  id,
}: { title: string; progress: number; lastUpdated: string; id: string }) {
  return (
    <Card className="hover-lift glass-card gradient-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Last updated {lastUpdated}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full gradient-bg hover:opacity-90 transition-opacity">
          <Link href={`/roadmap/${id}`}>Continue Learning</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function SavedRoadmapCard({
  title,
  description,
  likes,
  saves,
  id,
}: { title: string; description: string; likes: number; saves: number; id: string }) {
  return (
    <Card className="hover-lift glass-card gradient-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500" />
            <span>{likes.toLocaleString()} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <BookmarkIcon className="h-4 w-4 text-primary" />
            <span>{saves.toLocaleString()} saves</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full gradient-bg hover:opacity-90 transition-opacity">
          <Link href={`/roadmap/${id}`}>View Roadmap</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
