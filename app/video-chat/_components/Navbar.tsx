// Navbar.tsx

"use client";
import Image from "next/image";
import Link from "next/link";
import { useSafeSession } from "@/hooks/use-safe-session";
import MobileNav from "./MobileNav";
import UserProfileDropdown from "../../../components/UserProfileDropdown"; // Import the new component

const Navbar = () => {
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const user = sessionData?.user;

  return (
    <nav className="flex-between fixed z-50 w-full bg-[#444643] px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/dealo_logo.png"
            width={120}
            height={120}
            alt="Dealo logo"
            className="w-12 h-12 lg:w-16 lg:h-16"
          />
          <span className="text-lg font-bold text-white hidden sm:block">
            Dealo
          </span>
        </div>
      </Link>
      <div className="flex-between gap-5">
        {user && <UserProfileDropdown />}{" "}
        {/* Use the new UserProfileDropdown component */}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
