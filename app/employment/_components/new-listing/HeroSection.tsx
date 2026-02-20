"use client";

import { motion } from "framer-motion";
import { Briefcase, Users, Zap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export default function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const benefits = [
    { icon: Briefcase, text: "Free Posting" },
    { icon: Users, text: "50K+ Candidates" },
    { icon: Zap, text: "Quick Setup" },
    { icon: Shield, text: "Verified Talent" },
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 z-10 overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-3 h-3" />
            Talent Acquisition Engine
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
            DEPLOY YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">
              VACANCIES
            </span>
          </h1>

          <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-xs md:text-sm max-w-2xl mx-auto leading-relaxed mb-16">
            Reach the world's most elite technical specialists through a globally coordinated neural distribution grid.
          </p>

          {/* Quick Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16 px-4">
            {benefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  className="flex flex-col items-center gap-4 bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] p-8 border border-white/[0.05] hover:border-emerald-500/30 transition-all duration-500 group shadow-2xl"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                    <Icon className="w-6 h-6 text-emerald-400 group-hover:text-inherit" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest text-center">
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {!isAuthenticated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]"
            >
              Already verified?{" "}
              <Link
                href="/sign-in"
                className="text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Sign in to your hub
              </Link>
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}


