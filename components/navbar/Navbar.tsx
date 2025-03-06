"use client";

import Link from "next/link";
import Icon from "./Icon";
import { Button } from "../ui/button";
import roadmapState from "@/lib/state";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { onModalOpen } = roadmapState();
  const { isAuthenticated, user } = useUserContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-between p-4  text-primaryWhite">
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
              className="w-8 h-8 bg-light rounded-full flex items-center justify-center text-sm font-bold"
            >
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-primaryWhite text-black rounded-lg shadow-lg z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-light"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-light"
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
        <div className="absolute top-14 right-[135px] w-[35%] bg-primaryDarkLight rounded-sm text-primaryWhite md:hidden flex flex-col items-center space-y-4 gap-10 py-4 shadow-lg">
          <Link
            href="/roadmaps"
            className="hover:text-primaryBlue transition-colors border-b-2 hover:border-primaryBlue border-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            Roadmaps
          </Link>
          <Link
            href="/about"
            className="hover:text-primaryBlue transition-colors border-b-2 hover:border-primaryBlue border-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>

          {/* Authentication Section for Mobile */}
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="hover:text-primaryBlue transition-colors border-b-2 hover:border-primaryBlue border-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400"
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
