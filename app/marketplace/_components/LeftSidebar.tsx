"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Settings,
  Plus,
  Heart,
  MessageCircle,
  Bell,
  BarChart3,
  DollarSign,
  Calendar,
  Award,
  Users,
  TrendingUp,
  Star,
  Clock,
  Target,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";

const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const { data: session } = useSafeSession();

  const userStats = {
    completedProjects: 12,
    totalEarnings: 2500,
    rating: 4.8,
    responseTime: "2 hours",
    completionRate: 98,
  };

  const quickActions = [
    {
      icon: Plus,
      label: "Post Service",
      href: "/marketplace/create-work",
      color: "text-green-400",
    },
    {
      icon: Heart,
      label: "My Wishlist",
      href: "/marketplace/wishlist",
      color: "text-red-400",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      href: "/messages",
      color: "text-blue-400",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/analytics",
      color: "text-purple-400",
    },
  ];

  const navigationItems = [
    {
      icon: User,
      label: "Profile",
      href: "/profile",
      active: activeTab === "profile",
    },
    {
      icon: DollarSign,
      label: "Earnings",
      href: "/earnings",
      active: activeTab === "earnings",
    },
    {
      icon: Calendar,
      label: "Schedule",
      href: "/schedule",
      active: activeTab === "schedule",
    },
    {
      icon: Award,
      label: "Certifications",
      href: "/certifications",
      active: activeTab === "certifications",
    },
    {
      icon: Users,
      label: "Network",
      href: "/network",
      active: activeTab === "network",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      active: activeTab === "settings",
    },
  ];

  const recentActivity = [
    {
      type: "like",
      message: "Sarah liked your Web Design service",
      time: "2m ago",
    },
    { type: "message", message: "New message from John", time: "5m ago" },
    { type: "order", message: "New order for Logo Design", time: "1h ago" },
    { type: "review", message: "5-star review received", time: "2h ago" },
  ];

  return (
    <div className="w-80 space-y-6 pb-10">
      {/* User Profile Card - Premium Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-green-500 to-emerald-400">
              <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-black">
                <Image
                  src={session?.user?.image || "/default-avatar.jpg"}
                  alt={session?.user?.name || "User"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-black rounded-full" />
          </div>

          <h3 className="font-black text-xl text-white mb-1 tracking-tight">
            {session?.user?.name || "Guest User"}
          </h3>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-6">
            {session?.user?.email || "guest@example.com"}
          </p>

          {/* Quick Stats - Elite Layout */}
          <div className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden mb-6 border border-white/5">
            <div className="bg-black/20 p-4">
              <div className="text-xl font-black text-white">
                {userStats.completedProjects}
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Projects</div>
            </div>
            <div className="bg-black/20 p-4 border-l border-white/5">
              <div className="text-xl font-black text-emerald-400">
                ${userStats.totalEarnings}
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Earnings</div>
            </div>
          </div>

          <Link
            href="/profile/edit"
            className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-emerald-500/20 group/btn"
          >
            <User className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            Edit Profile
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions - Floating Action Menu */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Plus className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="font-black text-white tracking-tight">Operations</h3>
        </div>

        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/5 transition-all duration-300 group/item"
            >
              <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/5 group-hover/item:border-white/20 transition-all duration-300`}>
                <action.icon
                  className={`w-5 h-5 ${action.color} group-hover/item:scale-110 transition-transform`}
                />
              </div>
              <span className="text-sm font-bold text-gray-400 group-hover/item:text-white transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Performance Stats - Visual Progress */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="font-black text-white tracking-tight">Metrics</h3>
        </div>

        <div className="space-y-6">
          <div className="group/stat">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Platform Rating</span>
              <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
                <span className="text-yellow-500 text-xs font-black">
                  {userStats.rating}
                </span>
              </div>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 padding-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(userStats.rating / 5) * 100}%` }}
                className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="group/stat">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Reliability</span>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 text-xs font-black">
                  {userStats.completionRate}%
                </span>
              </div>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 padding-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${userStats.completionRate}%` }}
                className="bg-gradient-to-r from-emerald-600 to-green-400 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation - Bottom Bar Navigation Style */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl"
      >
        <h3 className="font-black text-white tracking-tight mb-6">Discovery</h3>
        <div className="grid grid-cols-1 gap-2">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setActiveTab(item.label.toLowerCase())}
              className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group ${item.active
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "hover:bg-white/5 text-gray-500 hover:text-white"
                }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LeftSidebar;
