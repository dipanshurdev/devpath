"use client";

import Link from "next/link";
import React from "react";
import { LuLogIn, LuUser } from "react-icons/lu";
import Icon from "./Icon";
import roadmapState from "@/lib/state";

const Navbar = () => {
  const modal = roadmapState();

  const handleOpen = () => {
    modal.onModalOpen();
  };

  return (
    <nav className="w-full flex items-center justify-between">
      <div className="flex items-center justify-start gap-4">
        <Link href="/">
          <Icon title="DevPath" />
        </Link>

        <span>
          <Link href="/roadmaps">Roadmaps</Link>
        </span>
        <span>
          <Link href="/roadmaps">Resources</Link>
        </span>
        <span>
          <Link href="/roadmaps">About</Link>
        </span>
      </div>
      <div className="flex items-center gap-4 ">
        {/* <span className="bg-darkLight rounded-full w-10 h-10 flex items-center justify-center">
          <Link href="/users/99">
            <LuUser width={44} />
          </Link>
        </span> */}
        <button
          onClick={handleOpen}
          className="bg-primaryBlue py-2 px-4 rounded-lg flex items-center gap-2"
        >
          Login
          <span>
            <LuLogIn />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
