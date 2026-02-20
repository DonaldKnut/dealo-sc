"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  illustration?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  illustration,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 px-6 relative group"
    >
      <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/[0.05] shadow-3xl backdrop-blur-3xl">
        {/* Illustration or Icon */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-50 opacity-50" />
          {illustration ? (
            <div className="text-8xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-700 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              {illustration}
            </div>
          ) : (
            <div className="w-28 h-28 mx-auto mb-4 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center group-hover:border-emerald-500/30 transition-all duration-500">
              <Icon className="w-12 h-12 text-white/20 group-hover:text-emerald-400 transition-all duration-500" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase leading-none">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/30 mb-12 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
          {description}
        </p>

        {/* Action Button */}
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-4 px-10 py-5 bg-emerald-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-400 transition-all duration-300 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1"
          >
            {action.label}
          </Link>
        )}
      </div>
    </motion.div>
  );
}


