"use client";

import { useEffect, useState } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { sidebarLinks } from "../(constants)";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const Sidebar = () => {
  const pathname = usePathname();
  const session = useSafeSession(); const { data: sessionData, status } = session || {};
  const role = sessionData?.user?.role;
  const [userCredits, setUserCredits] = useState<number>(0);
  const maxCredits = 5;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/credits");
        if (response.ok) {
          const data = await response.json();
          setUserCredits(data.credits || 0);
        } else {
          console.error("Failed to fetch user credits");
        }
      } catch (error) {
        console.error("Error fetching user credits:", error);
      }
    };

    if (status === "authenticated" && sessionData?.user) {
      fetchCredits();
    }
  }, [status, sessionData?.user]);

  const progressPercentage = (userCredits / maxCredits) * 100;

  // Optional: show loading state if role is not ready
  if (!role) {
    return (
      <aside className="hidden lg:flex justify-center items-center h-screen w-[264px] bg-[#2b3e2f] text-white">
        <p className="text-sm">Loading...</p>
      </aside>
    );
  }

  return (
    <>
      {/* Hamburger (mobile only) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#2b3e2f] text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar - always shown on desktop, toggled on mobile */}
      <section
        className={cn(
          "fixed z-40 top-0 left-0 h-screen bg-[#2b3e2f] text-white flex-col overflow-y-auto p-6 pt-28 transition-transform duration-300",
          "w-[264px] hidden lg:flex", // Always show on desktop
          {
            flex: isMobileMenuOpen, // Show on mobile if toggled
            "translate-x-0": isMobileMenuOpen,
            "-translate-x-full":
              !isMobileMenuOpen &&
              typeof window !== "undefined" &&
              window.innerWidth < 1024,
          }
        )}
      >
        {/* Sidebar Links */}
        {sidebarLinks
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const isActive =
              pathname === item.route || pathname.startsWith(`${item.route}/`);

            return (
              <Link
                key={item.label}
                href={item.route}
                className={cn(
                  "flex gap-4 items-center p-4 rounded-lg justify-start hover:bg-[#323232]",
                  { "bg-[#2f6345]": isActive }
                )}
                onClick={() => setIsMobileMenuOpen(false)} // close sidebar on mobile
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={24}
                  height={24}
                />
                <p className="text-lg font-semibold">{item.label}</p>
              </Link>
            );
          })}

        {/* Credits */}
        <div className="mt-auto">
          <div className="relative w-full">
            <Progress value={progressPercentage} />
            <p className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">
              {`${userCredits} / ${maxCredits}`}
            </p>
          </div>
          <h5 className="text-xs text-gray-400 mt-2">
            Upgrade your plan for Unlimited course Generation
          </h5>
        </div>
      </section>
    </>
  );
};

export default Sidebar;
