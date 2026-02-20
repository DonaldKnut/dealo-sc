"use client";

export const dynamic = "force-dynamic";

import { useSafeSession } from "@/hooks/use-safe-session";
import { motion } from "framer-motion";
import {
  Globe,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import QuickOnboardingForm from "./QuickOnboardingForm";

export default function CompleteProfileClient() {
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-black" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <Loader2 className="w-16 h-16 animate-spin text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Syncing Environment
          </h2>
          <p className="text-gray-400 font-medium">
            Preparing your professional workspace...
          </p>
        </motion.div>
      </div>
    );
  }

  // Server page should have already redirected in these cases.
  if (
    !sessionData?.user ||
    sessionData.user.isProfileComplete ||
    !sessionData.user.isEmailVerified
  ) {
    return null;
  }

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-[#020617] relative">
      {/* Ambient background (behind both panels) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Left: Fixed promo panel (fixed to screen, not scrollable) — same as auth */}
      <div className="hidden lg:flex lg:w-[50vw] lg:flex-shrink-0 lg:flex-grow-0 relative z-10 h-screen overflow-hidden">
        <div className="w-full h-full bg-black/50 backdrop-blur-3xl border-r border-white/5 flex flex-col p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="text-white fill-white w-6 h-6" />
            </div>
            <span className="text-white font-black text-2xl tracking-tighter">
              DEALO <span className="text-emerald-400">SC</span>
            </span>
          </motion.div>

          <div className="flex-1 flex flex-col justify-center min-h-0 pt-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-8"
            >
              <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-black text-white leading-[1.1]">
                Redefine Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                  Professional Edge
                </span>
              </h1>
              <p className="text-lg xl:text-xl text-gray-400 max-w-md leading-relaxed">
                Join an elite ecosystem designed for growth, innovation, and
                global collaboration.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-5 mt-10 xl:mt-14"
            >
              {[
                {
                  icon: ShieldCheck,
                  title: "Verified Identity",
                  desc: "Build trust with our secure verification system.",
                },
                {
                  icon: Target,
                  title: "Curated Matching",
                  desc: "Get matched with opportunities that fit your exact profile.",
                },
                {
                  icon: Trophy,
                  title: "Premium Tools",
                  desc: "Access industry-leading resources to scale your talent.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                    <item.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-bold text-base xl:text-lg">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center gap-4 pt-8 flex-shrink-0 opacity-40">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20 min-w-0" />
            <span className="text-white text-[10px] font-mono uppercase tracking-[0.25em] whitespace-nowrap">
              System Version 4.0.2
            </span>
          </div>
        </div>
      </div>

      {/* Right: Scrollable form only — same structure as auth (inner scroll) */}
      <div className="w-full lg:w-[50vw] lg:flex-shrink-0 lg:flex-grow-0 h-screen overflow-y-auto overflow-x-hidden relative z-10 flex items-start justify-center pt-8 sm:pt-12 lg:pt-16 pb-8 px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl relative"
        >
          <div className="relative py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" /> User Onboarding
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
                Finalize Your Profile
              </h2>
              <p className="text-gray-400 text-base lg:text-lg">
                Help us customize your experience by providing a few more
                details.
              </p>
            </motion.div>

            <QuickOnboardingForm session={session} />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-14 p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                  <Globe className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h4 className="text-lg font-bold text-white mb-1">
                    Join the Global Elite
                  </h4>
                  <p className="text-gray-400 text-sm">
                    By completing this setup, you join a network of over{" "}
                    <span className="text-emerald-400 font-semibold">
                      15,000+
                    </span>{" "}
                    industry leaders.
                  </p>
                </div>
                <div className="flex gap-6 flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="text-white font-black text-xl">98%</span>
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">
                      Success
                    </span>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="text-white font-black text-xl">24h</span>
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">
                      Launch
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

