"use client";

import Link from "next/link";
import { PiPath } from "react-icons/pi";
import { Button } from "../ui/button";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  const { data: session, status } = useSession();
    const role = session?.user?.role;

  const router = useRouter();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";


  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="nav-blur w-full">
      <div className="nav-container">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary flex rounded-full items-center justify-center shadow-lg shadow-primary/25 group-hover:rotate-6 transition-transform">
                <PiPath className="text-primary-foreground w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground">DevPath</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/roadmaps"
              className="nav-link"
            >
              Roadmaps
            </Link>
            {session && (
              <>
                <Link
                  href="/dashboard"
                  className="nav-link"
                >
                  Dashboard
                </Link>
                <Link
                  href="/saved"
                  className="nav-link"
                >
                  Saved
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="nav-link"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="nav-link"
            >
              Pricing
            </Link>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : session && status === "authenticated" ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-4 rounded-sm bg-secondary/50 border border-border group hover:border-primary/40 transition-all"
              >
                {session.user?.avatar ? (
                  <Image
                    src={session.user.avatar}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-xs font-bold text-foreground">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 glass-card rounded-none p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 border-b border-border/10">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Personal Account
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href={`/profile/${session.user?.username}`}
                      className="flex items-center px-4 py-2 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {isAdmin ? (

                      <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                      >
                      Control Center
                    </Link>
                    ):null}
                    <div className="h-px bg-border/40 my-2 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="premium-button px-6 py-2.5 text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-secondary border border-border text-foreground hover:border-primary/30 transition-all"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full glass-card border-x-0 border-b-border/40 p-6 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="/roadmaps"
                className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center justify-between group"
                onClick={() => setMobileMenuOpen(false)}
              >
                Roadmaps
                <ChevronDown className="w-5 h-5 -rotate-90 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/about"
                className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center justify-between group"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
                <ChevronDown className="w-5 h-5 -rotate-90 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/pricing"
                className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center justify-between group"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
                <ChevronDown className="w-5 h-5 -rotate-90 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Theme</span>
              <ThemeToggle />
            </div>

            <div className="h-px bg-border/40" />

            {status === "loading" ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : session ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    href="/dashboard"
                    className="text-lg font-bold text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/saved"
                    className="text-lg font-bold text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Saved Roadmaps
                  </Link>
                  <Link
                    href="/settings"
                    className="text-lg font-bold text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-lg font-bold text-destructive text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  href="/login"
                  className="w-full py-4 text-center font-bold border border-border rounded-[1.5rem] bg-card hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full py-4 text-center font-bold premium-button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
