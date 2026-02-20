"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  Calendar,
  Award,
  Briefcase,
  TrendingUp,
  Target,
  Star,
  Clock,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  HardDrive,
  FileText,
  UsersRound,
  Zap,
  Crown,
  Plus,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

const SidebarContent: React.FC<SidebarProps> = ({ onClose }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigationItems = [
    {
      id: "home",
      label: "Dashboard",
      icon: Home,
      href: "/dealoforge/dashboard",
    },
    { id: "courses", label: "Courses", icon: BookOpen, href: "/courses" },
    { id: "network", label: "Network", icon: Users, href: "/network" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      href: "/messenger",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
      href: "/certifications",
    },
    { id: "calendar", label: "Calendar", icon: Calendar, href: "/calendar" },
    { id: "jobs", label: "Jobs", icon: Briefcase, href: "/jobs" },
    { id: "drive", label: "Drive", icon: HardDrive, href: "/drive" },
    {
      id: "resume-builder",
      label: "Resume Builder",
      icon: FileText,
      href: "/resume-builder",
    },
    {
      id: "hire-talent",
      label: "Hire Talent",
      icon: UsersRound,
      href: "/hire-talent",
    },
    {
      id: "team-invite",
      label: "Team Invite",
      icon: Users,
      href: "/team-invite",
    },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="h-full flex flex-col bg-dark-100">
      {/* Logo - Fixed at top */}
      <div className="flex items-center justify-between p-4 border-b border-dark-300">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://res.cloudinary.com/dxojy40bv/image/upload/v1755825606/DEALO_ICON_utffca.png"
            alt="Dealo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-white p-2 hover:bg-dark-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation - Takes available space */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-300 scrollbar-track-transparent">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isCourses = item.id === "courses";

          return (
            <div key={item.id} className="space-y-2">
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? "gradient-green text-white shadow-lg shadow-brand-green/20"
                    : "text-gray-300 hover:bg-dark-200"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "" : "group-hover:text-brand-green transition-colors"}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
              {isCourses && (
                <Link
                  href="/dealoforge/dashboard/create-course"
                  onClick={onClose}
                  className="ml-4 flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/20 group text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Create Course</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Fixed Bottom Section - Always visible */}
      <div className="flex-shrink-0 border-t border-dark-300">
        {/* Upgrade to Pro Banner */}
        <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 relative overflow-hidden border border-green-400/50 shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-white/90 text-xs mb-3">
              Unlock premium features & unlimited access
            </p>
            <Link
              href="/pricing"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-sm font-semibold transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Upgrade Now
            </Link>
          </div>
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10 pointer-events-none" />
        </div>

        {/* Fixed Action Buttons */}
        <div className="p-4 space-y-2">
          <Link
            href="/settings"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-dark-200 hover:text-white transition-all duration-200 group"
          >
            <Settings className="w-5 h-5 group-hover:text-brand-gold transition-colors" />
            <span className="font-medium">Settings</span>
          </Link>

          <button
            onClick={() => {
              // Handle sign out
              window.location.href = "/api/auth/signout";
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* User Info - Fixed at very bottom */}
        <div className="px-4 pb-4 border-t border-dark-300 pt-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-green rounded-full flex items-center justify-center ring-2 ring-brand-green/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">John Doe</p>
              <p className="text-gray-400 text-xs truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {onClose && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        </AnimatePresence>
      )}

      {/* Mobile Sidebar */}
      {onClose && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 h-full w-72 bg-dark-100 z-50 lg:hidden shadow-2xl"
        >
          <SidebarContent onClose={onClose} />
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 bg-dark-100 border-r border-dark-300 h-screen">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
