"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, TrendingUp } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  level: string;
  category: string;
  instructor: string;
  thumbnail?: string;
  description?: string;
  type?: "enrolled" | "created";
  status?: string;
}

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/dashboard/courses", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-1/3 bg-white/5 rounded-3xl" />
          <div className="h-6 w-1/4 bg-white/5 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-white/5 rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* ── HEADER SECTION ── */}
      <section className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <BookOpen className="w-3 h-3" />
            My learning
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-4">
            MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">COURSES</span>
          </h1>
          <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-xs md:text-sm max-w-xl leading-relaxed">
            Manage your neural pathways and track the growth of your instructional legacy.
          </p>
        </motion.div>
      </section>

      {/* ── SEARCH & FILTERS ── */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 w-5 h-5 transition-colors" />
        <input
          type="text"
          placeholder="FILTER NEURAL DATA..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-6 py-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] text-white placeholder:text-white/10 uppercase font-black text-[10px] tracking-[0.3em] focus:outline-none focus:bg-white/[0.04] focus:border-emerald-500/30 transition-all shadow-2xl"
        />
      </div>

      {/* ── COURSES GRID ── */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-1 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/30 transition-all duration-500 group relative shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                {/* Course Header */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {course.type === "created" && (
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${course.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                        {course.status || "DRAFT"}
                      </span>
                    )}
                    {course.type === "created" && (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        ORIGINATOR
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                      {course.level || "ELITE"}
                    </span>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                      {course.category || "CORE"}
                    </span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Architect</p>
                    <p className="text-sm font-bold text-white/60">{course.instructor || "Anonymous"}</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-500/20 group-hover:text-emerald-500 transition-colors" />
                </div>

                {/* CTA */}
                <Link
                  href={course.type === "created" ? `/dealoforge/dashboard/courses/${course.id}` : `/courses/${course.id}`}
                  className={`w-full flex items-center justify-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 ${course.type === "created"
                    ? "bg-white/5 text-white hover:bg-white/10"
                    : "bg-emerald-500 text-black hover:bg-emerald-400"
                    }`}
                >
                  {course.type === "created" ? "MANAGE CORE" : "INITIALIZE LEARN"}
                </Link>
              </div>

              {/* Decorative side accent */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-emerald-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Browse courses to enroll in or create your own to teach others."
          illustration="📚"
          action={{
            label: "Browse courses",
            href: "/courses",
          }}
        />
      ) : (
        <EmptyState
          icon={Search}
          title="No results"
          description="Try different search terms or clear filters."
          illustration="🔍"
          action={{
            label: "Clear search",
            href: "/courses",
          }}
        />
      )}
    </div>
  );
};

export default CoursesPage;
