"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  History,
  Calendar,
  Settings,
  Users,
  FileVideo,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const VideoChatSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      label: "Home",
      icon: Home,
      href: "/video-chat",
    },
    {
      label: "New Meeting",
      icon: Video,
      href: "/video-chat/new",
    },
    {
      label: "Scheduled",
      icon: Calendar,
      href: "/video-chat/scheduled",
    },
    {
      label: "Recordings",
      icon: FileVideo,
      href: "/video-chat/recordings",
    },
    {
      label: "History",
      icon: History,
      href: "/video-chat/history",
    },
    {
      label: "Contacts",
      icon: Users,
      href: "/video-chat/contacts",
    },
  ];

  const bottomItems = [
    {
      label: "Settings",
      icon: Settings,
      href: "/video-chat/settings",
    },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-black/60 backdrop-blur-xl border-r border-white/[0.06]"
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-7 z-50 w-6 h-6 rounded-full bg-[#1a2e1a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600/40 transition-colors shadow-lg"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col pt-6 px-3 space-y-1">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/video-chat" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                  isCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-green-500/[0.12] text-green-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-green-400"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <item.icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${
                    isActive ? "text-green-400" : ""
                  }`}
                />

                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section — Settings */}
      <div className="px-3 pb-5 space-y-1">
        <div className="border-t border-white/[0.06] mb-3" />
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                  isCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-green-500/[0.12] text-green-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${
                    isActive ? "text-green-400" : ""
                  }`}
                />

                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
};

export default VideoChatSidebar;
