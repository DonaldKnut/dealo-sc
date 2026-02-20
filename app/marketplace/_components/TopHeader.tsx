"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, MessageCircle } from "lucide-react"; // Importing Icons
import Link from "next/link";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import DesktopIcons from "./DesktopIcons";
import MobileMenu from "./MobileMenu";
import { useSafeSession } from "@/hooks/use-safe-session";
const TopHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const user = sessionData?.user;
  const router = useRouter();

  const handleScroll = () => {
    setIsSticky(window.scrollY > 100);
  };

  const searchWork = () => {
    if (query.trim() !== "") {
      router.push(`/search/${query}`);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Handle Dashboard Click
  const handleDashboardClick = () => {
    if (!user) {
      router.push("/sign-in");
    } else {
      router.push("/dealoforge/dashboard");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex justify-between items-center p-4 gap-3 ${
        isSticky
          ? "sticky top-0 bg-[#2c4034cc] text-black shadow-lg z-50 backdrop-blur-lg"
          : "bg-[#373535b3] shadow-md backdrop-blur-lg"
      } transition-all duration-300`}
    >
      <div className="w-[85%] flex justify-between p-5 m-auto items-center">
        {/* Logo */}
        <Logo />

        {/* Search Bar */}
        <SearchBar query={query} setQuery={setQuery} searchWork={searchWork} />

        <div className="flex gap-4">
          {/* Dashboard Button (Conditional Redirect) */}
          <button
            onClick={handleDashboardClick}
            className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
          >
            <LayoutDashboard size={28} />
          </button>

          {/* Messaging Icon */}
          <Link
            href="/messenger"
            className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
          >
            <MessageCircle size={28} />
          </Link>
        </div>

        {/* Desktop Icons */}
        <DesktopIcons
          user={user}
          setMobileMenu={setMobileMenu}
          handleLogout={handleLogout}
        />

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden z-50"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <MobileMenu.CloseIcon /> : <MobileMenu.MenuIcon />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <MobileMenu
          query={query}
          setQuery={setQuery}
          searchWork={searchWork}
          user={user}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default TopHeader;
