"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  Compass,
  LayoutDashboard,
  LogOut,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import { PiPath } from "react-icons/pi";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface DashboardSidebarProps {
  children: React.ReactNode;
}

export function DashboardSidebar({ children }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/roadmaps",
      label: "Roadmaps",
      icon: Compass,
      active: pathname === "/roadmaps" || pathname.startsWith("/roadmap/"),
    },
    {
      href: "/saved",
      label: "My Library",
      icon: BookMarked,
      active: pathname === "/saved",
    },
    {
      href: "/achievements",
      label: "Achievements",
      icon: Trophy,
      active: pathname === "/achievements",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/25 dark:bg-background">
        <Sidebar variant="inset" className="border-r border-border/50 bg-card/80 backdrop-blur-xl dark:bg-card/60">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/20 transition-transform group-hover:rotate-6">
                <PiPath className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground">DevPath</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="px-3 pb-4">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
                    ${route.active
                      ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20 dark:bg-primary/20 dark:text-primary dark:ring-primary/25"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground dark:hover:bg-muted/50"}
                  `}
                >
                  <route.icon
                    className={`h-5 w-5 ${route.active ? "text-primary" : "opacity-80"}`}
                  />
                  <span>{route.label}</span>
                </Link>
              ))}
            </div>
          </SidebarContent>

          <SidebarFooter className="p-6 border-t border-border/40">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="relative">
                   <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage
                      src={session?.user?.avatar || ""}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-foreground truncate">
                    {session?.user?.name?.split(" ")[0] || "Learner"}
                  </span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Pro Member
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto border-l border-border/30 bg-background/50 pt-20 dark:border-border/40 dark:bg-background/80">
          <div className="mx-auto max-w-6xl p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
