// // import roadmapState from "@/lib/state";
// import Link from "next/link";
// import React, { useCallback, useState } from "react";
// import { LuLogIn, LuLogOut, LuUser } from "react-icons/lu";
// import { signOutAccount } from "@/lib/appwrite/api";
// import { IUser } from "@/types";
// import Image from "next/image";

// type Props = {
//   user: IUser;
// };

// const Profile = ({ user }: Props) => {
//   // const modal = roadmapState();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // const handleOpen = () => {
//   //   modal.onModalOpen();
//   // };

//   // console.log(user);

//   const toggleDropdown = useCallback(() => {
//     if (user) {
//       setDropdownOpen(!dropdownOpen);
//     }
//   }, [dropdownOpen]);

//   const closeDropdown = useCallback(() => {
//     signOutAccount();
//   }, [user]);

//   return (
//     <div className="relative flex items-center gap-4">
//       {
//         user.id && (
//           <div className="relative">
//             <div
//               onClick={toggleDropdown}
//               className="flex gap-3  cursor-pointer items-center justify-evenly"
//             >
//               <div className="block w-10 h-10 ">
//                 <img
//                   src={user.imageUrl}
//                   alt={`${user.name}'s Picture`}
//                   className=" rounded-full"
//                 />
//               </div>

//               <span>{user.username}</span>
//             </div>

//             {dropdownOpen && (
//               <div
//                 className="absolute right-0 mt-2 w-48 bg-primaryDark rounded-lg shadow-lg py-4 z-50"
//                 onMouseLeave={closeDropdown}
//               >
//                 <Link
//                   href="/profile/user.id"
//                   className="border-b border-primaryDarkLight"
//                 >
//                   <p className="flex items-center justify-start gap-4 w-full text-left px-4 py-2  text-primaryWhite hover:bg-primaryBlue">
//                     Profile
//                   </p>
//                 </Link>
//                 <Link href="/saved">
//                   <p className="flex items-center justify-start gap-4 w-full text-left px-4 py-2  text-primaryWhite hover:bg-primaryBlue">
//                     Saved
//                   </p>
//                 </Link>
//                 <button
//                   onClick={() => {
//                     // Handle logout functionality here
//                     closeDropdown();
//                   }}
//                   className="flex items-center justify-start gap-4 w-full text-left px-4 py-2  text-primaryWhite hover:bg-primaryBlue"
//                 >
//                   Logout
//                   <span>
//                     <LuLogOut />
//                   </span>
//                 </button>
//               </div>
//             )}
//           </div>
//         )
//         // : (
//         //   <button
//         //     onClick={handleOpen}
//         //     className="bg-primaryBlue py-2 px-4 rounded-lg flex items-center gap-2"
//         //   >
//         //     Login
//         //     <span>
//         //       <LuLogIn />
//         //     </span>
//         //   </button>
//         // )
//       }
//     </div>
//   );
// };

// export default Profile;
