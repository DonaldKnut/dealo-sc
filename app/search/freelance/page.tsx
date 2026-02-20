"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Briefcase, Award, Sparkles, Star, Clock, MapPin,
  ArrowRight, Filter, SlidersHorizontal, Code, Palette,
  PenTool, Megaphone, BarChart3, Video, Camera, Music,
  Globe, Zap, CheckCircle, TrendingUp, Users, Heart,
  ChevronDown, X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "All", icon: Sparkles, count: "4.2K+" },
  { label: "Development", icon: Code, count: "1.2K+" },
  { label: "Design", icon: Palette, count: "850+" },
  { label: "Writing", icon: PenTool, count: "450+" },
  { label: "Marketing", icon: Megaphone, count: "380+" },
  { label: "Analytics", icon: BarChart3, count: "210+" },
  { label: "Video", icon: Video, count: "320+" },
  { label: "Photography", icon: Camera, count: "190+" },
  { label: "Music", icon: Music, count: "140+" },
];

const SORT_OPTIONS = ["Best Match", "Top Rated", "Newest", "Price: Low to High", "Price: High to Low"];

const SERVICES = [
  {
    id: 1,
    title: "Full-Stack Web App Development with Next.js & Node.js",
    seller: "Amara Osei",
    sellerInitials: "AO",
    sellerColor: "from-emerald-500 to-green-600",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviews: 142,
    price: 150,
    deliveryDays: 7,
    category: "Development",
    tags: ["Next.js", "Node.js", "MongoDB"],
    badge: "Top Rated",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
    featured: true,
    liked: false,
  },
  {
    id: 2,
    title: "Premium Brand Identity Design — Logo, Colors & Typography System",
    seller: "Temi Adeyemi",
    sellerInitials: "TA",
    sellerColor: "from-violet-500 to-purple-600",
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviews: 98,
    price: 200,
    deliveryDays: 5,
    category: "Design",
    tags: ["Figma", "Branding", "Logo"],
    badge: "Rising Star",
    badgeColor: "bg-blue-500/20 text-blue-400",
    featured: false,
    liked: true,
  },
  {
    id: 3,
    title: "Machine Learning Model Development & Data Pipeline Setup",
    seller: "Chidi Nwosu",
    sellerInitials: "CN",
    sellerColor: "from-blue-500 to-cyan-600",
    location: "Port Harcourt, Nigeria",
    rating: 5.0,
    reviews: 67,
    price: 350,
    deliveryDays: 10,
    category: "Analytics",
    tags: ["Python", "TensorFlow", "SQL"],
    badge: "Expert",
    badgeColor: "bg-yellow-500/20 text-yellow-400",
    featured: true,
    liked: false,
  },
  {
    id: 4,
    title: "SEO-Optimised Long-Form Content Writing for Tech & Fintech",
    seller: "Fatima Bello",
    sellerInitials: "FB",
    sellerColor: "from-orange-500 to-amber-600",
    location: "Kano, Nigeria",
    rating: 4.7,
    reviews: 211,
    price: 80,
    deliveryDays: 3,
    category: "Writing",
    tags: ["SEO", "Copywriting", "Fintech"],
    badge: "Top Rated",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
    featured: false,
    liked: false,
  },
  {
    id: 5,
    title: "Performance Marketing — Meta & Google Ads Campaign Management",
    seller: "Emeka Eze",
    sellerInitials: "EE",
    sellerColor: "from-pink-500 to-rose-600",
    location: "Enugu, Nigeria",
    rating: 4.9,
    reviews: 88,
    price: 250,
    deliveryDays: 14,
    category: "Marketing",
    tags: ["Meta Ads", "Google Ads", "Analytics"],
    badge: "Expert",
    badgeColor: "bg-yellow-500/20 text-yellow-400",
    featured: false,
    liked: false,
  },
  {
    id: 6,
    title: "Cinematic Short-Form Video Editing for Social Media & Brands",
    seller: "Ngozi Okonkwo",
    sellerInitials: "NO",
    sellerColor: "from-teal-500 to-emerald-600",
    location: "Benin City, Nigeria",
    rating: 4.8,
    reviews: 54,
    price: 120,
    deliveryDays: 4,
    category: "Video",
    tags: ["Premiere Pro", "After Effects", "Reels"],
    badge: "Rising Star",
    badgeColor: "bg-blue-500/20 text-blue-400",
    featured: false,
    liked: true,
  },
  {
    id: 7,
    title: "Mobile App Development — iOS & Android with React Native",
    seller: "Kemi Adebayo",
    sellerInitials: "KA",
    sellerColor: "from-indigo-500 to-blue-600",
    location: "Ibadan, Nigeria",
    rating: 4.9,
    reviews: 73,
    price: 400,
    deliveryDays: 21,
    category: "Development",
    tags: ["React Native", "iOS", "Android"],
    badge: "Top Rated",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
    featured: false,
    liked: false,
  },
  {
    id: 8,
    title: "UI/UX Design — Full Product Design with Prototyping & Handoff",
    seller: "Dayo Olatunji",
    sellerInitials: "DO",
    sellerColor: "from-fuchsia-500 to-pink-600",
    location: "Lagos, Nigeria",
    rating: 4.7,
    reviews: 119,
    price: 180,
    deliveryDays: 6,
    category: "Design",
    tags: ["Figma", "UX Research", "Prototyping"],
    badge: "Expert",
    badgeColor: "bg-yellow-500/20 text-yellow-400",
    featured: false,
    liked: false,
  },
  {
    id: 9,
    title: "Professional Product & Lifestyle Photography for E-Commerce",
    seller: "Bola Akinwale",
    sellerInitials: "BA",
    sellerColor: "from-amber-500 to-orange-600",
    location: "Lagos, Nigeria",
    rating: 4.6,
    reviews: 45,
    price: 95,
    deliveryDays: 5,
    category: "Photography",
    tags: ["Product Shots", "Lightroom", "E-Commerce"],
    badge: "Rising Star",
    badgeColor: "bg-blue-500/20 text-blue-400",
    featured: false,
    liked: false,
  },
];

const STATS = [
  { value: "4.2K+", label: "Active Services" },
  { value: "28K+", label: "Verified Freelancers" },
  { value: "4.9★", label: "Avg. Rating" },
  { value: "98%", label: "Satisfaction Rate" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function FreelanceSearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Best Match");
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [services, setServices] = useState(SERVICES);

  const toggleLike = (id: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, liked: !s.liked } : s))
    );
  };

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchQ =
      !query ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.seller.toLowerCase().includes(query.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    const matchPrice = s.price >= priceRange[0] && s.price <= priceRange[1];
    return matchCat && matchQ && matchPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Top Rated") return b.rating - a.rating;
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Newest") return b.id - a.id;
    // Best Match: featured first
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f1a0f] to-black" />
        <div className="absolute top-[10%] left-[15%] w-[45%] h-[60%] bg-emerald-500/8 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-[10%] w-[30%] h-[40%] bg-green-600/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Freelance Marketplace
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.88]"
          >
            FIND THE PERFECT<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500">
              FREELANCER
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Browse 4,200+ premium services from Africa's most elite verified freelancers. Quality guaranteed.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-emerald-500/15 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-[3rem]" />
            <div className="relative flex items-center bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl transition-all duration-300 group-focus-within:border-emerald-500/50 group-hover:border-white/20">
              <Search className="ml-5 text-emerald-500/50 w-5 h-5 flex-shrink-0 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder="Search services, skills, or freelancers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent px-5 py-4 outline-none text-white text-base placeholder-gray-600 font-medium"
              />
              {query && (
                <button onClick={() => setQuery("")} className="mr-2 p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-black font-black px-8 py-4 rounded-[2rem] transition-all duration-500 shadow-lg shadow-emerald-900/40 uppercase tracking-widest text-xs flex-shrink-0">
                Search
              </button>
            </div>
          </motion.div>

          {/* Quick Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 justify-center mt-6"
          >
            {["React Developer", "UI Designer", "SEO Writer", "Video Editor", "Data Analyst"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs font-bold text-gray-500 hover:text-emerald-400 px-3 py-1.5 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-all duration-300"
              >
                {tag}
              </button>
            ))}
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

      {/* ── MAIN CONTENT ── */}
      <section className="py-12 px-6 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Category Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 flex-shrink-0 ${activeCategory === cat.label
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                    : "bg-white/[0.04] border border-white/10 text-gray-400 hover:border-emerald-500/30 hover:text-white"
                  }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
                <span className={`text-[10px] font-black ${activeCategory === cat.label ? "text-black/60" : "text-gray-600"}`}>
                  {cat.count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <p className="text-gray-500 text-sm font-bold">
              <span className="text-white font-black">{sorted.length}</span> services found
              {activeCategory !== "All" && <span className="text-emerald-400"> in {activeCategory}</span>}
            </p>

            <div className="flex items-center gap-3">
              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${showFilters
                    ? "bg-emerald-500 text-black"
                    : "bg-white/[0.04] border border-white/10 text-gray-400 hover:border-emerald-500/30 hover:text-white"
                  }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </motion.button>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/10 hover:border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-all duration-300"
                >
                  {sortBy}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSort ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {showSort && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#0d1a0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-20"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setSortBy(opt); setShowSort(false); }}
                          className={`w-full text-left px-5 py-3 text-xs font-bold transition-colors ${sortBy === opt ? "text-emerald-400 bg-emerald-500/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8">
                  <h3 className="font-black text-white mb-6 text-sm uppercase tracking-widest">Price Range</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <label className="text-gray-500 text-xs font-bold mb-2 block">Min ($)</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="text-gray-600 font-black mt-6">—</div>
                    <div className="flex-1">
                      <label className="text-gray-500 text-xs font-bold mb-2 block">Max ($)</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <button
                      onClick={() => setPriceRange([0, 500])}
                      className="mt-6 text-xs font-black text-gray-500 hover:text-emerald-400 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Service Cards Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + query + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sorted.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className={`group relative bg-white/[0.03] backdrop-blur-xl border rounded-[2rem] overflow-hidden transition-all duration-500 ${service.featured ? "border-emerald-500/25 hover:border-emerald-500/50" : "border-white/10 hover:border-emerald-500/25"
                    }`}
                >
                  {/* Featured glow */}
                  {service.featured && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-7 relative z-10">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${service.badgeColor}`}>
                        {service.badge}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleLike(service.id)}
                        className={`p-2 rounded-xl transition-all ${service.liked ? "text-red-400 bg-red-500/10" : "text-gray-600 hover:text-red-400 hover:bg-red-500/5"
                          }`}
                      >
                        <Heart className={`w-4 h-4 ${service.liked ? "fill-current" : ""}`} />
                      </motion.button>
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-white text-base leading-snug mb-5 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {service.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {service.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Seller */}
                    <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/5">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${service.sellerColor} flex items-center justify-center font-black text-white text-sm flex-shrink-0`}>
                        {service.sellerInitials}
                      </div>
                      <div>
                        <p className="font-black text-white text-sm">{service.seller}</p>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-500/50" />
                          <span className="text-gray-600 text-xs">{service.location}</span>
                        </div>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-black text-sm">{service.rating}</span>
                        <span className="text-gray-600 text-xs">({service.reviews})</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                          <Clock className="w-3 h-3" />
                          <span>Delivery in {service.deliveryDays} days</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Starting at </span>
                          <span className="text-emerald-400 font-black text-xl">${service.price}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-emerald-900/30"
                      >
                        View
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {sorted.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <Briefcase className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
              <p className="text-gray-500 font-black text-lg mb-2">No services found</p>
              <p className="text-gray-700 text-sm">Try adjusting your search or filters</p>
              <button
                onClick={() => { setQuery(""); setActiveCategory("All"); setPriceRange([0, 500]); }}
                className="mt-6 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}

          {/* Load More */}
          {sorted.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <button className="inline-flex items-center gap-3 px-10 py-4 bg-white/[0.04] border border-white/10 hover:border-emerald-500/30 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-500 group">
                Load More Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── POST YOUR SERVICE CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
              ARE YOU A<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                FREELANCER?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Join 28,000+ verified freelancers earning on Dealo. Post your service in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace/create-work"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-500 shadow-2xl shadow-emerald-900/40 group"
              >
                Post Your Service
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-3 px-10 py-4 bg-white/[0.04] border border-white/10 hover:border-emerald-500/30 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-500"
              >
                Browse Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
