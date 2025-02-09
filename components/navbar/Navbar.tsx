"use client";

import Link from "next/link";
import Icon from "./Icon";
import { Button } from "../ui/button";
import roadmapState from "@/lib/state";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { onModalOpen } = roadmapState();
  const { isAuthenticated, user } = useUserContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    // logout();
    setDropdownOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center">
          <Icon title="DevPath" />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/roadmaps"
          className="text-primaryWhite hover:text-primaryBlue transition-colors"
        >
          Roadmaps
        </Link>
        <Link
          href="/about"
          className="text-primaryWhite hover:text-primaryBlue transition-colors"
        >
          About
        </Link>

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold"
            >
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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
    </nav>
  );
};

export default Navbar;
