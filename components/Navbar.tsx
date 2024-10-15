import Link from "next/link";
import React from "react";
import { LuGithub, LuLogIn } from "react-icons/lu";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between">
      <div className="flex items-center justify-start gap-4">
        <span>LOGO</span>

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
        <span className="bg-neutral-800 rounded-full w-10 h-10 flex items-center justify-center">
          <Link href="www.github.com">
            <LuGithub width={44} />
          </Link>
        </span>
        <button className="bg-blue-800 py-2 px-4 rounded-lg flex items-center gap-2">
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
