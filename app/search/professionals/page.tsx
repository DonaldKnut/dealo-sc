"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Users, Star, MapPin, Briefcase, Code, Palette, PenTool,
  BarChart3, Megaphone, Video, Globe, Filter, ArrowRight, Sparkles,
  CheckCircle, TrendingUp, Award, Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const CATEGORIES = [
  { label: "All", icon: Users },
  { label: "Developers", icon: Code },
  { label: "Designers", icon: Palette },
  { label: "Writers", icon: PenTool },
  { label: "Marketers", icon: Megaphone },
  { label: "Analysts", icon: BarChart3 },
  { label: "Video Editors", icon: Video },
];

const FEATURED_PROS = [
  {
    name: "Amara Osei",
    role: "Full-Stack Developer",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviews: 142,
    skills: ["React", "Node.js", "MongoDB"],
    badge: "Top Rated",
    category: "Developers",
    hourlyRate: "$45",
    avatar: null,
    initials: "AO",
    color: "from-emerald-500 to-green-600",
  },
  {
    name: "Temi Adeyemi",
    role: "Brand & UI Designer",
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviews: 98,
    skills: ["Figma", "Branding", "Motion"],
    badge: "Rising Star",
    category: "Designers",
    hourlyRate: "$38",
    avatar: null,
    initials: "TA",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Chidi Nwosu",
    role: "Data Analyst & ML Engineer",
    location: "Port Harcourt, Nigeria",
    rating: 5.0,
    reviews: 67,
    skills: ["Python", "TensorFlow", "SQL"],
    badge: "Expert",
    category: "Analysts",
    hourlyRate: "$60",
    avatar: null,
    initials: "CN",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Fatima Bello",
    role: "Content Strategist",
    location: "Kano, Nigeria",
    rating: 4.7,
    reviews: 211,
    skills: ["SEO", "Copywriting", "Strategy"],
    badge: "Top Rated",
    category: "Writers",
    hourlyRate: "$30",
    avatar: null,
    initials: "FB",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "Emeka Eze",
    role: "Growth Marketer",
    location: "Enugu, Nigeria",
    rating: 4.9,
    reviews: 88,
    skills: ["Meta Ads", "Google Ads", "Analytics"],
    badge: "Expert",
    category: "Marketers",
    hourlyRate: "$50",
    avatar: null,
    initials: "EE",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Ngozi Okonkwo",
    role: "Video Producer",
    location: "Benin City, Nigeria",
    rating: 4.8,
    reviews: 54,
    skills: ["Premiere Pro", "After Effects", "DaVinci"],
    badge: "Rising Star",
    category: "Video Editors",
    hourlyRate: "$42",
    avatar: null,
    initials: "NO",
    color: "from-teal-500 to-emerald-600",
  },
];

const STATS = [
  { value: "28K+", label: "Verified Professionals" },
  { value: "120+", label: "Countries Represented" },
  { value: "4.9★", label: "Average Rating" },
  { value: "98%", label: "Client Satisfaction" },
];

export default function ProfessionalsSearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = FEATURED_PROS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchQ =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.role.toLowerCase().includes(query.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24 px-6">
        {/* Glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f1a0f] to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Professional Network
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]"
          >
            FIND YOUR<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500">
              DREAM TEAM
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Connect with Africa's most elite verified professionals — developers, designers, analysts, and more — ready to elevate your next project.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative max-w-2xl mx-auto group"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, skill, or role..."
              className="w-full pl-14 pr-6 py-5 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all duration-300 text-base shadow-2xl backdrop-blur-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeCategory === cat.label
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                    : "bg-white/[0.04] border border-white/10 text-gray-400 hover:border-emerald-500/30 hover:text-white"
                  }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFESSIONAL CARDS ── */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + query}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((pro, i) => (
                <motion.div
                  key={pro.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-7 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badge */}
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${pro.badge === "Top Rated"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : pro.badge === "Expert"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                      {pro.badge}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-black text-sm">{pro.rating}</span>
                      <span className="text-gray-600 text-xs">({pro.reviews})</span>
                    </div>
                  </div>

                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4 mb-5 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pro.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-white font-black text-lg">{pro.initials}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base tracking-tight group-hover:text-emerald-400 transition-colors">
                        {pro.name}
                      </h3>
                      <p className="text-gray-500 text-xs font-medium">{pro.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-emerald-500/50" />
                        <span className="text-gray-600 text-xs">{pro.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                    {pro.skills.map((skill) => (
                      <span key={skill} className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-400">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-emerald-400 font-black text-lg">{pro.hourlyRate}</span>
                      <span className="text-gray-600 text-xs">/hr</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
                    >
                      Hire
                      <ArrowRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Users className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">No professionals match your search.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-black" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-black tracking-tighter mb-6">
              ARE YOU A<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                PROFESSIONAL?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Join 28,000+ verified experts already earning on Dealo. Your next big client is waiting.
            </p>
            <Link
              href="/marketplace/create-work"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-500 shadow-2xl shadow-emerald-900/40 group"
            >
              Post Your Service
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
