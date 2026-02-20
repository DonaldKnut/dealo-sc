"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  UserPlus,
  TrendingUp,
  Star,
  MapPin,
  Eye,
  DollarSign,
  Clock,
  Sparkles,
  Target,
  Users,
  Award,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";

interface SuggestedUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  location?: string;
  followersCount: number;
  category: string;
  rating: number;
  isFollowing: boolean;
}

interface TrendingWork {
  _id: string;
  title: string;
  creator: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  price: number;
  category: string;
  viewsCount: number;
  thumbnail: string;
}

const RightSidebar: React.FC = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [trendingWorks, setTrendingWorks] = useState<TrendingWork[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSafeSession();

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const fetchSidebarData = async () => {
    try {
      setLoading(true);
      const [usersResponse, worksResponse] = await Promise.all([
        fetch("/api/users/suggested"),
        fetch("/api/works/trending"),
      ]);

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setSuggestedUsers(usersData.users || []);
      }

      if (worksResponse.ok) {
        const worksData = await worksResponse.json();
        setTrendingWorks(worksData.works || []);
      }
    } catch (error) {
      console.error("Failed to fetch sidebar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setSuggestedUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, isFollowing: !user.isFollowing }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="w-80 space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-3 bg-gray-700 rounded" />
              <div className="h-3 bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-80 space-y-6">
      {/* People to Follow - Elite Spotlight */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="font-black text-white tracking-tight">Top Talent</h3>
        </div>

        <div className="space-y-6 relative z-10">
          {suggestedUsers.slice(0, 5).map((user) => (
            <div key={user._id} className="flex items-center justify-between group/user">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-green-500 to-emerald-400">
                    <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-black">
                      <Image
                        src={user.avatar || "/default-avatar.jpg"}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover group-hover/user:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {user.rating > 4.5 && (
                    <div className="absolute -top-1 -right-1 p-1 bg-yellow-500 rounded-full border-2 border-black">
                      <Sparkles className="w-2 h-2 text-black" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white text-sm tracking-tight group-hover/user:text-emerald-400 transition-colors">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                    <span>{user.category}</span>
                    {user.location && (
                      <>
                        <span className="text-emerald-500 opacity-50">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{user.location}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleFollow(user._id)}
                className={`p-2 rounded-xl transition-all duration-300 ${user.isFollowing
                  ? "bg-white/5 text-emerald-500 border border-emerald-500/20"
                  : "bg-emerald-500 text-black hover:bg-emerald-400"
                  }`}
              >
                {user.isFollowing ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          ))}
        </div>

        <button className="w-full mt-8 py-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-emerald-400 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300">
          Discover All Talent
        </button>
      </motion.div>

      {/* Trending Works - Cinematic List */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <h3 className="font-black text-white tracking-tight">Hot Services</h3>
        </div>

        <div className="space-y-6">
          {trendingWorks.slice(0, 5).map((work, index) => (
            <div key={work._id} className="flex items-center gap-4 group/work relative">
              <div className="text-2xl font-black text-white/5 absolute -left-2 top-0 group-hover/work:text-emerald-500/10 transition-colors pointer-events-none">
                0{index + 1}
              </div>

              <div className="flex-1 pl-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 p-0.5">
                    <Image
                      src={work.creator?.avatar || "/default-avatar.jpg"}
                      alt={`${work.creator?.firstName || "Unknown"} ${work.creator?.lastName || "User"
                        }`}
                      width={32}
                      height={32}
                      className="w-full h-full rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs line-clamp-1 tracking-tight group-hover/work:text-emerald-400 transition-colors">
                      {work.title}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase">
                      <span>{work.category}</span>
                      <span className="text-emerald-500/30">•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        <span>{work.viewsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-emerald-400 font-black text-sm">
                    {formatPrice(work.price)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                    <span className="text-white text-[10px] font-bold">New</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Premium CTA Ads */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-emerald-600 to-green-900 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-emerald-900/40 group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <Sparkles className="w-10 h-10 text-white shadow-2xl" />
          </div>
          <h3 className="font-black text-2xl text-white mb-3 tracking-tighter leading-tight">MAXIMIZE YOUR EXPOSURE</h3>
          <p className="text-emerald-100/70 text-sm mb-8 font-medium italic">
            "Don't just be part of the marketplace, own it."
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white text-emerald-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all duration-300"
          >
            Go Pro Now
          </motion.button>
        </div>
      </motion.div>

      {/* Platform Meta - Minimalist Grid */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 p-8"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Global Talent</span>
            <p className="text-xl font-black text-white">2.5K+</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Solutions</span>
            <p className="text-xl font-black text-white">15K+</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Satisfaction</span>
            <p className="text-xl font-black text-emerald-400">98%</p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Elite Rating</span>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
              <p className="text-xl font-black text-white">4.8</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Simple Footer */}
      <div className="pt-4 text-center">
        <div className="flex justify-center gap-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-emerald-400 transition-colors">Help</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Data</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Safety</a>
        </div>
        <p className="mt-4 text-[9px] font-bold text-gray-700 uppercase tracking-widest">© 2025 Dealo Talent Network</p>
      </div>
    </div>
  );
};

export default RightSidebar;
