"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeSession } from "@/hooks/use-safe-session";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const notifications = [
    {
      id: 1,
      title: "New course available",
      message: "Advanced React Development is now available",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Certification completed",
      message: "Congratulations! You've earned your Python certification",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "New message",
      message: "John Doe sent you a message",
      time: "3 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = "/sign-in";
    } catch (e) {
      console.error("Sign out failed", e);
      window.location.href = "/sign-in";
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses, people, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
                >
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                            !notification.read ? "bg-gray-700/50" : ""
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-300 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <button className="w-full text-sm text-green-400 hover:text-green-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Image
                src={sessionData?.user?.image || "/avatar.png"}
                alt={sessionData?.user?.name || "User"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block text-sm font-medium">
                {sessionData?.user?.name ||
                  (status === "loading" ? "Loading..." : "Guest")}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* User dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
                >
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {sessionData?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {sessionData?.user?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      href={`/users/${
                        sessionData?.user?.name
                          ?.toLowerCase()
                          .replace(/\s+/g, "-") || "profile"
                      }`}
                    >
                      <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                    </Link>
                    <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
