"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"; // Import NextAuth hooks
import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSafeSession } from "@/hooks/use-safe-session";
const Topbar = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {}; // Use NextAuth session hook
  const pathName = usePathname();
  const [isSticky, setIsSticky] = useState(false);

  // Handle scroll event to toggle sticky state
  const handleScroll = () => {
    if (typeof window !== "undefined") {
      setIsSticky(window.scrollY > 100);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      className={`flex justify-between items-center p-4 ${
        isSticky ? "sticky top-0 bg-white shadow-md z-50" : ""
      } transition-transform duration-300`}
    >
      <div className="w-[85%] flex justify-between items-center m-auto">
        <Link href="/">
          <Image
            src={
              isSticky ? "/dealo_academy_black.png" : "/dealo_academy_white.png"
            }
            height={80}
            width={120}
            alt="logo"
            className="transition-opacity duration-300"
          />
        </Link>

        {/* User Authentication */}
        {sessionData?.user ? (
          <div className="flex items-center gap-2">
            <span>{sessionData?.user?.name}</span>
            <Button onClick={() => signOut({ callbackUrl: "/" })}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Topbar;
