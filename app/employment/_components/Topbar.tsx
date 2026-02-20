"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"; // Import NextAuth hooks
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSafeSession } from "@/hooks/use-safe-session";
const Topbar = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {}; // Use NextAuth session hook
  const pathName = usePathname();
  const [isSticky, setIsSticky] = useState(false);

  // Define the routes for the top navigation
  const topRoutes = [
    {
      label: "Instructor",
      path: "/education/dealo-academy/instructor/courses",
    },
    { label: "Learning", path: "/education/dealo-academy/learning" },
  ];

  // Define the routes for the sidebar
  const sidebarRoutes = [
    { label: "Courses", path: "/education/dealo-academy/instructor/courses" },
    {
      label: "Performance",
      path: "/instructor/performance",
    },
  ];

  // Handle scroll event to toggle sticky state
  const handleScroll = () => {
    setIsSticky(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

        <div className="flex items-center gap-6">
          {/* Top Routes for larger screens */}
          <div className="hidden sm:flex gap-6">
            {topRoutes.map((route) => (
              <Link
                href={route.path}
                key={route.path}
                className="text-sm font-medium hover:text-[#326d23] text-white dark:text-black"
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="z-20 sm:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent className="flex flex-col gap-4">
                {topRoutes.map((route) => (
                  <Link
                    href={route.path}
                    key={route.path}
                    className="text-sm font-medium hover:text-[#3dab6b]"
                  >
                    {route.label}
                  </Link>
                ))}
                {pathName.startsWith("/instructor") && (
                  <div className="flex flex-col gap-4">
                    {sidebarRoutes.map((route) => (
                      <Link
                        href={route.path}
                        key={route.path}
                        className="text-sm font-medium hover:text-[#277531]"
                      >
                        {route.label}
                      </Link>
                    ))}
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

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
    </div>
  );
};

export default Topbar;
