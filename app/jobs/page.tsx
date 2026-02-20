"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  ArrowRight,
  ChevronDown,
  BarChart3,
  Wrench,
  MessageSquare,
  TrendingDown,
  Heart,
  UserCircle,
  Code,
  Megaphone,
  Palette,
  Wallet,
  DollarSign,
  Sparkles,
  Clock,
  Filter,
} from "lucide-react";
import Link from "next/link";
import WhyDealoBest from "@/components/jobs/WhyDealoBest";
import DealoAdvantages from "@/components/jobs/DealoAdvantages";

interface Job {
  _id: string;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  postedBy?: string;
  country: string;
  remote: boolean;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  jobIcon?: string;
  skillsRequired?: string[];
  location?: string;
  experienceRequired?: string | number;
  applications?: string[];
  category?: string;
  company?: {
    name: string;
    logo?: string;
  };
}

const categories = [
  { name: "Software Engineering", icon: Code, count: 15 },
  { name: "Marketing", icon: Megaphone, count: 8 },
  { name: "Design", icon: Palette, count: 5 },
  { name: "Business Development", icon: BarChart3, count: 2 },
  { name: "Sales", icon: Wallet, count: 3 },
  { name: "Customer Service", icon: MessageSquare, count: 2 },
  { name: "Finance", icon: TrendingDown, count: 1 },
  { name: "Human Resources", icon: UserCircle, count: 1 },
  { name: "Construction", icon: Wrench, count: 0 },
  { name: "Healthcare", icon: Heart, count: 0 },
];

const quickFilters = [
  "Remote",
  "Full-time",
  "Part-time",
  "Contract",
  "Lagos",
  "Abuja",
  "Entry Level",
  "Senior",
];

export default function JobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobCounts, setJobCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/dealo-jobs", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setJobs(data.jobs || []);
            const counts: Record<string, number> = {};
            (data.jobs || []).forEach((job: Job) => {
              const category = job.category || "Other";
              counts[category] = (counts[category] || 0) + 1;
            });
            setJobCounts(counts);
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location && location !== "All Locations")
      params.set("location", location);
    router.push(`/employment/search?${params.toString()}`);
  };

  const featuredJobs = jobs.slice(0, 6);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      if (days < 7) return `${days}d ago`;
      if (days < 30) return `${Math.floor(days / 7)}w ago`;
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "";
    }
  };

  const totalJobs = jobs.length > 0 ? jobs.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Hero */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-green-500/[0.06] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-green-500/[0.08] border border-green-500/15 rounded-full px-4 py-1.5 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-300 font-medium">
              {totalJobs > 0
                ? `${totalJobs.toLocaleString()} jobs available`
                : "New opportunities daily"}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-5"
          >
            Find work that moves
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              your career forward
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base lg:text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Discover opportunities from verified companies across Nigeria.
            Search, apply, and land your next role — all in one place.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto backdrop-blur-sm"
          >
            <div className="flex-1 flex items-center gap-2.5 bg-white/[0.04] rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 outline-none text-sm text-white placeholder-gray-500 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2.5 bg-white/[0.04] rounded-xl px-4 py-3 sm:w-48">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 outline-none text-sm text-white bg-transparent cursor-pointer [&>option]:bg-[#0f1a0f] [&>option]:text-white"
              >
                <option>All Locations</option>
                <option>Lagos, Nigeria</option>
                <option>Abuja, Nigeria</option>
                <option>Port Harcourt</option>
                <option>Remote</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl px-6 py-3 text-sm font-medium transition-all shadow-lg shadow-green-500/15 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </motion.div>

          {/* Quick Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-5 max-w-2xl mx-auto"
          >
            {quickFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSearchQuery(filter);
                  handleSearch();
                }}
                className="px-3 py-1.5 text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] rounded-lg hover:border-green-500/20 hover:text-green-400 hover:bg-green-500/[0.04] transition-all"
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Browse by Category
              </h2>
              <p className="text-sm text-gray-500">
                Find your niche in the job market
              </p>
            </div>
            <Link
              href="/employment/search"
              className="text-xs text-green-500 hover:text-green-400 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const count = jobCounts[category.name] || category.count;
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    router.push(
                      `/employment/search?q=${encodeURIComponent(category.name)}`
                    )
                  }
                  className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-left hover:border-green-500/20 hover:bg-white/[0.05] transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-green-500/10 flex items-center justify-center mb-3 group-hover:from-emerald-500/20 group-hover:to-green-600/20 transition-all">
                    <IconComponent className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-xs font-semibold text-white mb-1 group-hover:text-green-300 transition-colors leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-gray-600">
                    {count} {count === 1 ? "job" : "jobs"}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Featured Jobs
              </h2>
              <p className="text-sm text-gray-500">
                Latest opportunities from verified companies
              </p>
            </div>
            <Link
              href="/employment/search"
              className="text-xs text-green-500 hover:text-green-400 transition-colors flex items-center gap-1"
            >
              All jobs <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
                    <div className="space-y-1.5">
                      <div className="w-20 h-3 bg-white/[0.06] rounded" />
                      <div className="w-14 h-2.5 bg-white/[0.04] rounded" />
                    </div>
                  </div>
                  <div className="w-3/4 h-4 bg-white/[0.06] rounded mb-3" />
                  <div className="w-1/2 h-3 bg-white/[0.04] rounded" />
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {featuredJobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -3 }}
                    onClick={() => router.push(`/employment/show/${job._id}`)}
                    className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-green-500/15 hover:bg-white/[0.05] transition-all cursor-pointer group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {job.jobIcon ? (
                          <Image
                            src={job.jobIcon}
                            alt={job.title}
                            width={40}
                            height={40}
                            className="rounded-xl"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-green-500/10 flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-green-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            {job.category || "General"}
                          </p>
                          {job.createdAt && (
                            <p className="text-[11px] text-gray-600">
                              {formatDate(job.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      {job.remote && (
                        <span className="text-[10px] text-green-400 bg-green-500/[0.08] border border-green-500/15 px-2 py-0.5 rounded-full font-medium">
                          Remote
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-white mb-3 group-hover:text-green-300 transition-colors leading-snug line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location || job.country || "Not specified"}
                      </span>
                      <span className="text-gray-700">·</span>
                      <span className="capitalize">
                        {job.type || "Full Time"}
                      </span>
                    </div>

                    {/* Skills */}
                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skillsRequired.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] text-gray-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <span className="text-[10px] text-gray-500">
                            +{job.skillsRequired.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Budget */}
                    {job.budget && (
                      <div className="pt-3 border-t border-white/[0.05]">
                        <span className="text-sm font-semibold text-green-400">
                          ${job.budget.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/employment/search"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-green-500/15"
                >
                  Browse All Jobs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/employment/new-listing"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] px-5 py-2.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-all"
                >
                  Post a Job <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-12 flex flex-col items-center justify-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-green-500/10 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-green-600/60" />
              </div>
              <p className="text-sm text-gray-400 mb-1 font-medium">
                No featured jobs right now
              </p>
              <p className="text-xs text-gray-600 mb-5">
                Check back soon or post your own listing
              </p>
              <div className="flex gap-3">
                <Link
                  href="/employment/search"
                  className="text-xs text-green-400 border border-green-500/20 bg-green-500/[0.06] px-4 py-2 rounded-lg hover:bg-green-500/[0.12] transition-colors"
                >
                  Browse Jobs
                </Link>
                <Link
                  href="/employment/new-listing"
                  className="text-xs text-gray-400 border border-white/[0.08] bg-white/[0.03] px-4 py-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  Post a Job
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <WhyDealoBest />
      <DealoAdvantages />
    </div>
  );
}
