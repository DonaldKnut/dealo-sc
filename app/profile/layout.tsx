"use client";

import React, { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SessionProvider>
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f0a] to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-white/50 text-sm font-medium">Loading your profile...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-black text-white">
          {children}
        </div>
      )}
    </SessionProvider>
  );
}
