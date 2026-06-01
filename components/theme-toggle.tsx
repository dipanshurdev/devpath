"use client";

import * as React from "react";
import { BsMoon, BsSun, BsLaptop } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Toggle theme" className="border-border/60">
        <BsLaptop className="h-5 w-5 opacity-60" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          aria-label="Theme options"
          className="border-border/60 bg-background/80 shadow-sm transition-all hover:scale-105 hover:border-primary/30 dark:bg-card/50"
        >
          <div className="relative flex h-5 w-5 items-center justify-center">
            {resolvedTheme === "dark" ? (
              <BsMoon className="h-5 w-5 transition-transform duration-300" />
            ) : resolvedTheme === "light" ? (
              <BsSun className="h-5 w-5 transition-transform duration-300" />
            ) : (
              <BsLaptop className="h-5 w-5 transition-transform duration-300" />
            )}
          </div>
          <span className="sr-only">Theme options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" min-w-48 border-border/60 glass-card  backdrop-blur-xl dark:border-border/50 mt-6">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <BsSun className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Light</span>
            <span className="text-xs text-muted-foreground">Light mode</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <BsMoon className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="font-medium">Dark</span>
            <span className="text-xs text-muted-foreground">Dark mode</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <BsLaptop className="h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="font-medium">System</span>
            <span className="text-xs text-muted-foreground">Follow system preference</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
