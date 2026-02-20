"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Monitor, TrendingUp, Palette, BarChart3, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Avatar circles use promo images from public/assets/promo-images
const INTELLIGENCE_AVATARS = [
  { src: "/assets/promo-images/jonathan-velasquez-160775.png", alt: "Professional in workspace" },
  { src: "/assets/promo-images/One light headshot not bad 😉📸 @trebihammond came….jpg", alt: "Headshot" },
  { src: "/assets/promo-images/9 Nonprofits That Are Making A Difference In The World.jpg", alt: "Team collaboration" },
  { src: "/assets/promo-images/Learning a digital skill will save you time and money_ Teens should learn skills on the internet instead of endless scrolling_.jpg", alt: "Digital skills learning" },
  { src: "/assets/promo-images/Young multiethnic students using computer inside university classroom _ Premium Photo.jpg", alt: "Students collaborating" },
];

const COURSE_CATEGORIES = [
  {
    id: "programming",
    name: "Engineering & Tech",
    description: "Cloud computing, AI, modern software engineering",
    count: "2.5K+",
    href: "/courses?category=programming",
    icon: Monitor,
    gradient: "from-blue-500/20 to-indigo-600/20",
    iconColor: "text-blue-400",
  },
  {
    id: "business",
    name: "Growth & Business",
    description: "Strategy, venture capital, and market scaling",
    count: "1.8K+",
    href: "/courses?category=business",
    icon: TrendingUp,
    gradient: "from-emerald-500/20 to-green-600/20",
    iconColor: "text-emerald-400",
  },
  {
    id: "design",
    name: "Product Design",
    description: "High-end UI/UX, product design, brand identity",
    count: "1.2K+",
    href: "/courses?category=design",
    icon: Palette,
    gradient: "from-purple-500/20 to-pink-600/20",
    iconColor: "text-purple-400",
  },
  {
    id: "data-science",
    name: "Data Intelligence",
    description: "Advanced analytics and machine intelligence",
    count: "900+",
    href: "/courses?category=data-science",
    icon: BarChart3,
    gradient: "from-amber-500/20 to-orange-600/20",
    iconColor: "text-amber-400",
  },
];

const CourseSearchHero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push(`/courses?q=${encodeURIComponent(searchQuery)}`);
    setIsSearching(false);
  };

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* ── PREMIUM BACKGROUND EFFECTS ── */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.03] rounded-full blur-[150px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/[0.05] rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* ── LEFT COLUMN: HEADING & SEARCH ── */}
          <div className="lg:col-span-12 xl:col-span-12 space-y-12 text-center lg:text-left xl:col-span-5">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black uppercase tracking-[0.34em] text-emerald-400 mx-auto lg:mx-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              >
                <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
                Intelligence Matching
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter"
              >
                PRECISION <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                  DISCOVERY
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/40 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Navigate Nigeria's most comprehensive educational database with precision tools designed for high-performers.
              </motion.p>
            </div>

            {/* Premium Search Box — button inside input, full height */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative group max-w-2xl mx-auto lg:mx-0"
            >
              <form onSubmit={handleSearch} className="relative flex items-stretch">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-500 transition-colors pointer-events-none z-10">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query courses, roles, or skills..."
                  className="w-full pl-16 pr-[180px] py-5 bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] text-white placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white/[0.05] focus:border-emerald-500/40 transition-all text-lg font-bold shadow-2xl backdrop-blur-xl"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-[calc(100%-16px)] min-h-[52px] px-8 bg-emerald-500 text-black rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(16,185,129,0.35)] active:scale-[0.98] disabled:opacity-50 border border-emerald-400/30"
                >
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: DYNAMIC CATEGORY CARDS ── */}
          <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 pb-4">
            {COURSE_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="group relative h-[260px] bg-white/[0.02] border border-white/[0.08] rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden cursor-pointer hover:bg-white/[0.05] hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2 shadow-2xl shadow-black shadow-inner"
                onClick={() => router.push(cat.href)}
              >
                {/* Visual Identity */}
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 ${cat.iconColor}`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="block text-3xl font-black text-white leading-none tracking-tighter">{cat.count}</span>
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] opacity-60">Enrolled</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">{cat.name}</h4>
                  <p className="text-xs text-white/40 font-bold leading-relaxed uppercase tracking-wider">{cat.description}</p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── GLOBAL ACCESS BANNER (same treatment as search bar: dope CTA) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 rounded-[2.5rem] bg-white/[0.03] border border-white/[0.08] overflow-hidden relative shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 p-8 md:py-6 md:pr-4">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="hidden sm:flex -space-x-5 shrink-0">
              {INTELLIGENCE_AVATARS.map((avatar, i) => (
                <div key={i} className="relative w-14 h-14 rounded-full border-4 border-black bg-neutral-900 overflow-hidden flex-shrink-0">
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    fill
                    className="object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    sizes="56px"
                  />
                </div>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-black bg-emerald-500 flex items-center justify-center text-black text-[10px] font-black shadow-[0_0_30px_rgba(16,185,129,0.4)] z-10 flex-shrink-0">
                +14K
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-black text-2xl uppercase tracking-widest leading-none">Intelligence Network</h4>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">Access standardized curricula vetted by global industry councils.</p>
            </div>
          </div>

          <div className="relative flex items-stretch justify-center md:justify-end min-h-[56px]">
            <button
              onClick={() => router.push("/courses")}
              className="w-full md:w-auto min-h-[52px] px-10 py-4 bg-emerald-500 text-black rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-emerald-400 hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(16,185,129,0.35)] active:scale-[0.98] border border-emerald-400/30"
            >
              <ArrowRight className="w-5 h-5" />
              Explore Curriculum
            </button>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseSearchHero;
