"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EnhancedProductCard from "./EnhancedProductCard";
import { IWork } from "@/types";
import { useSafeSession } from "@/hooks/use-safe-session";

interface EnhancedWorkGridProps {
  data: IWork[];
  loading?: boolean;
}

const EnhancedWorkGrid: React.FC<EnhancedWorkGridProps> = ({
  data,
  loading = false,
}) => {
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(
    new Set()
  );
  const { data: session } = useSafeSession();

  // Fetch wishlist on component mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist();
    }
  }, [session?.user?.id]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        const wishlistIds = new Set<string>(
          data.wishlist.map((item: any) => String(item.workId._id))
        );
        setWishlistedItems(wishlistIds);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const handleWishlistToggle = async (workId: string) => {
    if (!session?.user?.id) {
      // Redirect to login or show login modal
      return;
    }

    try {
      const isWishlisted = wishlistedItems.has(workId);
      const action = isWishlisted ? "remove" : "add";

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workId, action }),
      });

      if (response.ok) {
        setWishlistedItems((prev) => {
          const newSet = new Set(prev);
          if (isWishlisted) {
            newSet.delete(workId);
          } else {
            newSet.add(workId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden animate-pulse"
          >
            <div className="aspect-[4/3] bg-gray-700" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-700 rounded" />
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-700 rounded-full w-16" />
                <div className="h-6 bg-gray-700 rounded-full w-20" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-700 rounded w-20" />
                <div className="h-10 bg-gray-700 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            No Services Found
          </h3>
          <p className="text-gray-400 mb-8">
            We couldn&apos;t find any services matching your criteria. Try
            adjusting your filters or search terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors">
              Clear Filters
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/20">
              Browse All Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {data.map((work, index) => (
        <motion.div
          key={work._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <EnhancedProductCard
            work={work}
            onWishlistToggle={handleWishlistToggle}
            isWishlisted={wishlistedItems.has(work._id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EnhancedWorkGrid;
