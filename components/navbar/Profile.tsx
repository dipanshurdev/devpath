import Link from "next/link";
import React, { useCallback, useState } from "react";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { signOut } from "next-auth/react";
import { IUser } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  user?: IUser;
};

const Profile = ({ user }: Props) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleOpen = () => {
    router.push("/login");
  };

  const toggleDropdown = useCallback(() => {
    if (user) {
      setDropdownOpen(!dropdownOpen);
    }
  }, [dropdownOpen, user]);

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
    setDropdownOpen(false);
  }, [router]);

  return (
    <div className="relative flex items-center gap-4">
      {user ? (
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="flex gap-3  cursor-pointer items-center justify-evenly"
          >
            <div className="block w-10 h-10 ">
              <Image
                src={user.avatar ?? "/default-avatar.png"}
                alt={`${user.name}'s Picture`}
                width={40}
                height={40}
                className=" rounded-full"
              />
            </div>

            <span>{user.username}</span>
          </div>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-primaryDark rounded-lg shadow-lg py-4 z-50"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href={`/profile/${user.id}`}
                className="border-b border-primaryDarkLight"
                onClick={() => setDropdownOpen(false)}
              >
                <p className="flex items-center justify-start gap-4 w-full text-left px-4 py-2  text-primaryWhite hover:bg-primaryBlue">
                  Profile
                </p>
              </Link>
              <Link href="/saved" onClick={() => setDropdownOpen(false)}>
                <p className="flex items-center justify-start gap-4 w-full text-left px-4 py-2  text-primaryWhite hover:bg-primaryBlue">
                  Saved
                </p>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-start gap-4 w-full text-left px-4 py-2  text-primaryWhite hover:bg-primaryBlue"
              >
                Logout
                <span>
                  <LuLogOut />
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className="bg-primaryBlue py-2 px-4 rounded-lg flex items-center gap-2"
        >
          Login
          <span>
            <LuLogIn />
          </span>
        </button>
      )}
    </div>
  );
};

export default Profile;
