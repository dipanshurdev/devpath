"use client";

import Link from "next/link";
import Icon from "./Icon";
import { Button } from "../ui/button";
import roadmapState from "@/lib/state";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { onModalOpen } = roadmapState();
  const { isAuthenticated, user, logout } = useUserContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between p-4 text-primaryWhite shadow-sm relative z-50">
      {/* Left Side - Logo */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center">
          <Icon title="DevPath" />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          href="/roadmaps"
          className="hover:text-primaryBlue transition-colors"
        >
          Roadmaps
        </Link>
        <Link
          href="/about"
          className="hover:text-primaryBlue transition-colors"
        >
          About
        </Link>

        {/* Authentication Section */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 bg-light px-2 py-1 rounded-full text-sm font-semibold hover:opacity-90"
            >
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <span className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-black">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
              <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded-md shadow-md z-50 overflow-hidden animate-fadeIn">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={onModalOpen} variant="default">
            Sign Up
          </Button>
        )}
      </div>

      {/* Mobile Menu Button (Visible on small screens) */}
      <button
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-4 left-4 bg-primaryDarkLight text-primaryWhite rounded-md shadow-md py-6 px-4 space-y-4 flex flex-col items-center z-40">
          <Link
            href="/roadmaps"
            className="w-full text-center hover:text-primaryBlue"
            onClick={() => setMobileMenuOpen(false)}
          >
            Roadmaps
          </Link>
          <Link
            href="/about"
            className="w-full text-center hover:text-primaryBlue"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>

          {/* Authentication Section for Mobile */}
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="w-full text-center hover:text-primaryBlue"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-center text-red-500 hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Button onClick={onModalOpen} variant="default">
              Sign Up
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
