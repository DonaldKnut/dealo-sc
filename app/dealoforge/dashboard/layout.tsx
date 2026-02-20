"use client";

import { useState, useEffect } from "react";
import { useSafeSession } from "@/hooks/use-safe-session";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep structure identical on server and first client render to avoid hydration mismatch
  const wrapper = (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {!mounted ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading your dashboard...</p>
            </div>
          </div>
        ) : status === "loading" ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading your dashboard...</p>
            </div>
          </div>
        ) : !sessionData?.user ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
              <p className="text-gray-300">Please sign in to access the dashboard.</p>
            </div>
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );

  return wrapper;
}
