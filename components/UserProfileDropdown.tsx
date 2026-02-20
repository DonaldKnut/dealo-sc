"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useSafeSession } from "@/hooks/use-safe-session";

const UserProfileDropdown = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const user = sessionData?.user;

  return (
    <div className="relative group">
      <div className="flex items-center cursor-pointer">
        <Image
          src={user?.image || "/user.png"}
          width={82}
          height={82}
          alt="User Profile"
          className="rounded-full border border-white" // Add styles for appearance
        />
      </div>
      {/* Dropdown for profile info */}
      <div className="absolute right-0 z-10 hidden w-48 bg-white rounded-lg shadow-lg group-hover:block">
        <Link
          href="/profile"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
        >
          Profile
        </Link>
        <Link
          href="/settings"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
        >
          Settings
        </Link>
        {/* Using next-auth signOut method */}
        <button
          onClick={async () => {
            await signOut({ redirect: false });
            window.location.href = "/sign-in";
          }} // Redirect to /sign-in after signing out
          className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfileDropdown;
