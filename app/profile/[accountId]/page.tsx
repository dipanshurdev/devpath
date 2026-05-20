"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookmarkIcon,
  Clock,
  Edit,
  Settings,
  Star,
  Trophy,
  ArrowLeft,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { PiPath } from "react-icons/pi";

// Mock user data
const user = {
  name: "User_Name",
  username: "user_name",
  email: "user@gmail.com",
  imageUrl:
    "https://cloud.appwrite.io/v1/avatars/initials?name=User_Name&project=6713db6600030e21eb99",
  bio: "Frontend developer passionate about learning new technologies.",
  joinedDate: "March 2025",
  completedRoadmaps: 2,
  inProgressRoadmaps: 3,
  savedRoadmaps: 5,
};

// Mock achievements
const achievements = [
  {
    id: "first-roadmap",
    title: "First Steps",
    description: "Completed your first roadmap",
    date: "April 10, 2025",
    icon: "🏆",
  },
  {
    id: "streak-7",
    title: "Consistent Learner",
    description: "Maintained a 7-day learning streak",
    date: "April 15, 2025",
    icon: "🔥",
  },
  {
    id: "resources-50",
    title: "Resource Explorer",
    description: "Accessed 50 learning resources",
    date: "April 18, 2025",
    icon: "📚",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("progress");

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10">
      {/* Header Profile Section */}
      <div className="relative glass-card !bg-primary/5 p-8 md:p-12 border-border/40 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <Avatar className="h-40 w-40 md:h-48 md:w-48 border-4 border-background relative">
              <AvatarImage
                src={user.imageUrl || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback className="text-4xl font-black bg-secondary text-primary">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-4 right-4 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
               <Edit className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
                <span className="text-gradient">{user.name}</span>
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="text-muted-foreground font-bold tracking-tight">@{user.username}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                  Pro Member
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Joined {user.joinedDate}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
              {user.bio}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Button className="premium-button px-8 py-6 rounded-2xl">Follow</Button>
              <Button variant="outline" className="px-8 py-6 rounded-2xl border-border/60 font-bold hover:bg-card">Message</Button>
            </div>
          </div>

          {/* User Fast Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-10 pb-2">
            {[
              { label: "Done", value: user.completedRoadmaps },
              { label: "Active", value: user.inProgressRoadmaps },
              { label: "Saved", value: user.savedRoadmaps },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <div className="text-3xl font-black text-foreground">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Meta & Achievements */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-border/40 bg-secondary/20">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-foreground tracking-tight">Achievements</h3>
               <Trophy className="w-6 h-6 text-amber-500" />
             </div>
             <div className="space-y-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="group flex items-start gap-5 p-4 rounded-3xl hover:bg-card/50 transition-all border border-transparent hover:border-border/40">
                    <div className="text-4xl bg-background w-16 h-16 flex items-center justify-center rounded-2xl shadow-lg border border-border/20 group-hover:scale-110 transition-transform">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-extrabold text-foreground tracking-tight">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">{achievement.description}</p>
                      <p className="text-[10px] font-black text-primary/60 uppercase tracking-tighter pt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
             </div>
             <Button variant="ghost" className="w-full mt-6 rounded-2xl font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors">
               View All Badges
             </Button>
          </div>

          <div className="glass-card p-8 border-border/40">
             <h3 className="text-xl font-black text-foreground mb-6">Details</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Email</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/30">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Location</span>
                  <span className="text-sm font-medium">Remote</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column - Tabs & Content */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-foreground tracking-tight">Activity</h2>
              <TabsList className="bg-card/50 p-1 rounded-2xl border border-border/40 h-14">
                <TabsTrigger value="progress" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">In Progress</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">Done</TabsTrigger>
                <TabsTrigger value="saved" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">Saved</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="progress" className="mt-0">
               <div className="space-y-6">
                  {/* Reuse the Dashboard Progress Card style or similar */}
                  <div className="glass-card p-8 border-border/40 group hover:bg-card/80 transition-all flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
                       <Clock size={40} />
                    </div>
                    <div className="flex-1 space-y-6 w-full text-center md:text-left">
                       <div className="space-y-1">
                          <h4 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">Frontend Development</h4>
                          <p className="text-sm font-medium text-muted-foreground">Updated 2 days ago</p>
                       </div>
                       <div className="space-y-3 max-w-md mx-auto md:mx-0">
                          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">Completion</span>
                            <span className="text-primary font-bold">65%</span>
                          </div>
                          <div className="h-3 bg-secondary rounded-full overflow-hidden">
                             <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "65%" }}
                              className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                             />
                          </div>
                       </div>
                    </div>
                    <Button asChild className="premium-button h-16 px-10 rounded-2xl shrink-0 group">
                      <Link href="/roadmap/frontend" className="flex items-center gap-2">
                        Resume Path
                        <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
                <div className="glass-card p-16 text-center border-dashed border-2 border-border/50">
                  <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-bold text-lg leading-relaxed max-w-xs mx-auto">
                    Finish your current roadmaps to see your certifications here.
                  </p>
                </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 flex flex-col gap-8 border-border/40 hover:bg-card transition-all group">
                   <div className="space-y-2">
                      <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">TypeScript</h4>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed">Add static typing to JavaScript for enterprise-grade applications.</p>
                   </div>
                   <div className="flex items-center justify-between border-t border-border/30 pt-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>1.2k Likes</span>
                      </div>
                      <Button asChild variant="secondary" className="rounded-xl font-bold text-xs h-10 px-6 border-border/60 border hover:border-primary/40 transition-all">
                        <Link href="/roadmap/typescript">Start</Link>
                      </Button>
                   </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
