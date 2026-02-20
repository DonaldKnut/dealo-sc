"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Play,
  Clock,
  Star,
  Users,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Monitor,
  Video
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo: {
    url: string;
    duration: number;
    thumbnail: string;
  };
  price: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  category: string;
  tags: string[];
  instructor: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  sections: Array<{
    title: string;
    lectures: Array<{
      title: string;
      duration: number;
    }>;
  }>;
  requirements: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  createdAt: string;
  updatedAt: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category && category !== "all") params.append("category", category);
      if (level && level !== "all") params.append("level", level);
      if (sortBy) params.append("sortBy", sortBy);

      const res = await fetch(`/api/courses?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [search, category, level, sortBy]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const getTotalDuration = (sections: Course["sections"]) => {
    return sections.reduce((total, section) => {
      return (
        total +
        section.lectures.reduce(
          (sectionTotal, lecture) => sectionTotal + lecture.duration,
          0
        )
      );
    }, 0);
  };

  const getTotalLectures = (sections: Course["sections"]) => {
    return sections.reduce(
      (total, section) => total + section.lectures.length,
      0
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const categories = [
    "Technology",
    "Design",
    "Business",
    "Healthcare",
    "Education",
    "Marketing",
    "Finance",
    "Creative",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-green-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
      </div>

      <div className="relative z-10">
        {/* ── HERO SECTION ── */}
        <section className="pt-32 pb-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              Empowering Minds
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.85]"
            >
              DISCOVER OUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                MASTERCOURSES
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Elevate your skillset with production-grade courses taught by global industry leaders. Real-world projects, real-world impact.
            </motion.p>
          </div>
        </section>

        {/* ── FILTERS SECTION ── */}
        <section className="sticky top-[72px] z-40 px-6 py-2 md:py-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl"
            >
              {/* Mobile Filter Toggle */}
              <div className="md:hidden flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold uppercase tracking-widest text-white">Browse Filters</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {courses.length} Courses
                  </span>
                </div>
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isFiltersOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Filter Content */}
              <div className={`flex flex-col md:flex-row gap-2 ${isFiltersOpen ? "flex" : "hidden md:flex"}`}>
                <div className="md:hidden h-px bg-white/5 my-1" />

                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search courses, skills, or instructors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/5 focus:border-emerald-500/40 focus:bg-white/[0.06] rounded-xl pl-12 pr-4 py-3 md:py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                {/* Category Selector */}
                <div className="relative min-w-[180px]">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full appearance-none bg-white/[0.04] border border-white/5 focus:ring-0 focus:ring-offset-0 focus:border-emerald-500/40 hover:bg-white/[0.06] rounded-xl px-4 py-6 md:py-7 text-sm text-white outline-none cursor-pointer transition-all">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/10 text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level Selector */}
                <div className="relative min-w-[150px]">
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="w-full appearance-none bg-white/[0.04] border border-white/5 focus:ring-0 focus:ring-offset-0 focus:border-emerald-500/40 hover:bg-white/[0.06] rounded-xl px-4 py-6 md:py-7 text-sm text-white outline-none cursor-pointer transition-all">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/10 text-white">
                      <SelectItem value="all">All Levels</SelectItem>
                      {levels.map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By Filter */}
                <div className="relative min-w-[150px]">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full appearance-none bg-white/[0.04] border border-white/5 focus:ring-0 focus:ring-offset-0 focus:border-emerald-500/40 hover:bg-white/[0.06] rounded-xl px-4 py-6 md:py-7 text-sm text-white outline-none cursor-pointer transition-all">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/10 text-white">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── COURSES GRID ── */}
        <section className="px-6 lg:px-8 py-12 pb-32">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] aspect-[4/5.5] animate-pulse" />
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {courses.map((course, index) => (
                    <motion.div
                      layout
                      key={course._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group flex flex-col bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/30 rounded-[2.5rem] transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl relative"
                    >
                      <Link href={`/courses/${course.slug}`} className="flex flex-col h-full">
                        {/* Thumbnail Wrap */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                          <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                              <Monitor className="w-12 h-12 text-white/20" />
                            </div>
                          )}

                          {/* Price Badge */}
                          <div className="absolute top-6 right-6 z-30">
                            <span className="px-5 py-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all shadow-2xl">
                              {course.price.isFree ? "Complimentary" : `${course.price.currency} ${course.price.amount}`}
                            </span>
                          </div>

                          {/* Media Type */}
                          <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                              <Video className="w-3.5 h-3.5 text-white/80" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Premium Access</span>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className="px-3 py-1 bg-white/[0.04] border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400">
                              {course.category}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-black text-white">4.9</span>
                            </div>
                          </div>

                          <h3 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight group-hover:text-emerald-400 transition-colors duration-300">
                            {course.title}
                          </h3>

                          <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2 mb-8">
                            {course.shortDescription || course.description}
                          </p>

                          {/* Meta Row */}
                          <div className="flex items-center border-t border-white/5 pt-6 mt-auto">
                            <div className="flex items-center gap-6">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Duration</span>
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-emerald-500" />
                                  {formatDuration(getTotalDuration(course.sections))}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Content</span>
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <Users className="w-3 h-3 text-emerald-500" />
                                  {getTotalLectures(course.sections)} Lectures
                                </span>
                              </div>
                            </div>

                            {/* Instructor Avatar Stack */}
                            <div className="ml-auto w-10 h-10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden group-hover:border-emerald-500/50 transition-colors">
                              {course.instructor.avatar ? (
                                <Image
                                  src={course.instructor.avatar}
                                  alt={course.instructor.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-xs font-black">
                                  {course.instructor.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Hover Overlay Arrow */}
                        <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                            <ArrowRight className="w-6 h-6" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                  <Search className="w-16 h-16 text-gray-600 relative" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">No Matching Courses Found</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Try refining your search terms or adjusting the category filters.</p>
                <button
                  onClick={() => { setSearch(""); setCategory("all"); setLevel("all"); }}
                  className="mt-8 text-emerald-400 text-sm font-bold uppercase tracking-widest hover:text-emerald-300 border-b border-transparent hover:border-emerald-300 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoursesPage;
