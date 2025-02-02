// "use client";

// import Link from "next/link";
// import React from "react";
// // import { LuLogIn, LuUser } from "react-icons/lu";
// import Icon from "./Icon";
// // import roadmapState from "@/lib/state";
// // import { getAccount } from "@/lib/appwrite/api";
// // import { useUserContext } from "@/context/AuthContext";
// // import { toast } from "react-toastify";
// // import Profile from "./Profile";
// // import SearchBar from "../roadmaps/SearchBar";
// // import { useUserContext } from "@/context/AuthContext";

// const Navbar = () => {
//   // const [searchTerm, setSearchTerm] = useState("");

//   return (
//     <nav className="w-full flex items-center justify-between">
//       <div className="flex items-center justify-between gap-4">
//         <Link href="/">
//           <Icon title="DevPath" />
//         </Link>
//         <span>
//           <Link href="/roadmaps">Roadmaps</Link>
//         </span>
//       </div>
//       <div className="flex gap-4 items-center justify-center">
//         {/* <span>
//           <Link href="/roadmaps">Resources</Link>
//         </span> */}
//         {/* <span>
//           <Link href="/roadmaps">About</Link>
//         </span> */}
//         {/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
//         {/* <Profile /> */}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import Link from "next/link";
import Icon from "./Icon";

const Navbar = () => {
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
        </Link>
        <Link
          href="/about"
          className="text-primaryWhite hover:text-primaryBlue transition-colors"
        >
          About
        </Link>
        <Link href="/about" className="text-primaryBlue  transition-colors">
          Sign Up
        </Link> */}
        {/* Placeholder for future profile component */}

        {/* <div className="w-8 h-8 bg-gray-200 rounded-full"></div> */}
      </div>
    </nav>
  );
};

export default Navbar;
