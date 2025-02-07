"use client";

import Link from "next/link";
import Icon from "./Icon";
import { Button } from "../ui/button";
import roadmapState from "@/lib/state";
import { useUserContext } from "@/context/AuthContext";

const Navbar = () => {
  const { onModalOpen } = roadmapState();
  const { isAuthenticated } = useUserContext();
  console.log(isAuthenticated);

  return (
    <nav className="w-full flex items-center justify-between p-4  ">
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
        {/* <Link
          href="/resources"
          className="text-primaryWhite hover:text-primaryBlue transition-colors"
        >
          Resources
        </Link> */}
        <Link
          href="/about"
          className="text-primaryWhite hover:text-primaryBlue transition-colors"
        >
          About
        </Link>
        {isAuthenticated ? (
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        ) : (
          <Button onClick={onModalOpen} variant="default">
            Sign Up
          </Button>
        )}

        {/* Placeholder for future profile component */}
      </div>
    </nav>
  );
};

export default Navbar;
