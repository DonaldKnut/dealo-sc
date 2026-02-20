"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Target,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  Play,
  Calendar,
  UserCheck,
  Shield,
  Sparkles,
  ChevronDown,
} from "lucide-react";

type CertificationLevel = "beginner" | "intermediate" | "advanced" | "expert";
type CertificationField =
  | "programming"
  | "design"
  | "marketing"
  | "business"
  | "data-science"
  | "cybersecurity";

interface Certification {
  _id: string;
  title: string;
  description: string;
  field: CertificationField;
  level: CertificationLevel;
  duration: string;
  questions: number;
  passingScore: number;
  price: number;
  rating: number;
  enrolledCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  tags: string[];
}

const CertificationExplorePage = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<CertificationField | "all">("all");
  const [selectedLevel, setSelectedLevel] = useState<CertificationLevel | "all">("all");
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "rating" | "price">("popular");

  // Mock data for certifications
  const mockCertifications: Certification[] = useMemo(
    () => [
      {
        _id: "1",
        title: "Full Stack Web Development",
        description: "Master modern web development with React, Node.js, and MongoDB",
        field: "programming",
        level: "intermediate",
        duration: "8-12 weeks",
        questions: 50,
        passingScore: 75,
        price: 299,
        rating: 4.8,
        enrolledCount: 1247,
        isPopular: true,
        tags: ["React", "Node.js", "MongoDB", "JavaScript"],
      },
      {
        _id: "2",
        title: "UI/UX Design Fundamentals",
        description: "Learn the principles of user interface and user experience design",
        field: "design",
        level: "beginner",
        duration: "6-8 weeks",
        questions: 40,
        passingScore: 70,
        price: 199,
        rating: 4.6,
        enrolledCount: 892,
        isNew: true,
        tags: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      },
      {
        _id: "3",
        title: "Digital Marketing Strategy",
        description: "Develop comprehensive digital marketing strategies for business growth",
        field: "marketing",
        level: "advanced",
        duration: "10-14 weeks",
        questions: 60,
        passingScore: 80,
        price: 399,
        rating: 4.9,
        enrolledCount: 567,
        isPopular: true,
        tags: ["SEO", "Social Media", "Content Marketing", "Analytics"],
      },
      {
        _id: "4",
        title: "Business Analytics & Data Science",
        description: "Transform data into actionable business insights",
        field: "data-science",
        level: "expert",
        duration: "12-16 weeks",
        questions: 70,
        passingScore: 85,
        price: 599,
        rating: 4.7,
        enrolledCount: 234,
        tags: ["Python", "SQL", "Machine Learning", "Tableau"],
      },
      {
        _id: "5",
        title: "Cybersecurity Fundamentals",
        description: "Learn essential cybersecurity concepts and best practices",
        field: "cybersecurity",
        level: "beginner",
        duration: "6-10 weeks",
        questions: 45,
        passingScore: 75,
        price: 249,
        rating: 4.5,
        enrolledCount: 445,
        tags: ["Network Security", "Ethical Hacking", "Risk Management"],
      },
      {
        _id: "6",
        title: "E-commerce Business Management",
        description: "Build and scale successful e-commerce businesses",
        field: "business",
        level: "intermediate",
        duration: "8-12 weeks",
        questions: 55,
        passingScore: 75,
        price: 349,
        rating: 4.4,
        enrolledCount: 678,
        tags: ["Shopify", "Amazon", "Dropshipping", "Marketing"],
      },
    ],
    []
  );

  useEffect(() => {
    setCertifications(mockCertifications);
    setFilteredCertifications(mockCertifications);
    setLoading(false);
  }, [mockCertifications]);

  useEffect(() => {
    let filtered = certifications;

    if (searchTerm) {
      filtered = filtered.filter(
        (cert) =>
          cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedField !== "all") {
      filtered = filtered.filter((cert) => cert.field === selectedField);
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((cert) => cert.level === selectedLevel);
    }

    switch (sortBy) {
      case "popular":
        filtered = filtered.sort((a, b) => b.enrolledCount - a.enrolledCount);
        break;
      case "newest":
        filtered = filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
    }

    setFilteredCertifications(filtered);
  }, [certifications, searchTerm, selectedField, selectedLevel, sortBy]);

  const getFieldIcon = (field: CertificationField) => {
    switch (field) {
      case "programming": return <Zap className="h-5 w-5" />;
      case "design": return <Target className="h-5 w-5" />;
      case "marketing": return <TrendingUp className="h-5 w-5" />;
      case "business": return <BarChart3 className="h-5 w-5" />;
      case "data-science": return <BarChart3 className="h-5 w-5" />;
      case "cybersecurity": return <Shield className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLevelStyles = (level: CertificationLevel) => {
    switch (level) {
      case "beginner": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "intermediate": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "advanced": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "expert": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const fields: { value: CertificationField | "all"; label: string }[] = [
    { value: "all", label: "All Fields" },
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "business", label: "Business" },
    { value: "data-science", label: "Data Science" },
    { value: "cybersecurity", label: "Cybersecurity" },
  ];

  const levels: { value: CertificationLevel | "all"; label: string }[] = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  const sortOptions: { value: "popular" | "newest" | "rating" | "price"; label: string }[] = [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "rating", label: "Top Rated" },
    { value: "price", label: "Price: Low to High" },
  ];

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
              Global Standards
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]"
            >
              EXPLORE OUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                CERTIFICATIONS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Validate your expertise with AI-powered certifications designed for the modern economy. From design to data science, get globally recognized.
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
                  <span className="text-sm font-bold uppercase tracking-widest text-white">Filters</span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {filteredCertifications.length} Results
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
                    placeholder="Search by title, field, or tech..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/5 focus:border-emerald-500/40 focus:bg-white/[0.06] rounded-xl pl-12 pr-4 py-3 md:py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                {/* Field Filter */}
                <div className="relative min-w-[180px]">
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value as any)}
                    className="w-full appearance-none bg-white/[0.04] border border-white/5 focus:border-emerald-500/40 hover:bg-white/[0.06] rounded-xl px-4 py-3 md:py-3.5 text-sm text-white outline-none cursor-pointer transition-all"
                  >
                    {fields.map(f => <option key={f.value} value={f.value} className="bg-neutral-900">{f.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Level Filter */}
                <div className="relative min-w-[150px]">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as any)}
                    className="w-full appearance-none bg-white/[0.04] border border-white/5 focus:border-emerald-500/40 hover:bg-white/[0.06] rounded-xl px-4 py-3 md:py-3.5 text-sm text-white outline-none cursor-pointer transition-all"
                  >
                    {levels.map(l => <option key={l.value} value={l.value} className="bg-neutral-900">{l.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Sort By Filter */}
                <div className="relative min-w-[180px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full appearance-none bg-white/[0.04] border border-white/5 focus:border-emerald-500/40 hover:bg-white/[0.06] rounded-xl px-4 py-3 md:py-3.5 text-sm text-white outline-none cursor-pointer transition-all"
                  >
                    {sortOptions.map(o => <option key={o.value} value={o.value} className="bg-neutral-900">{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CERTIFICATIONS GRID ── */}
        <section className="px-6 lg:px-8 py-12 pb-32">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-[2rem] aspect-[4/5] animate-pulse" />
                ))}
              </div>
            ) : filteredCertifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredCertifications.map((cert, index) => (
                    <motion.div
                      layout
                      key={cert._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group relative flex flex-col bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/30 rounded-[2.5rem] p-8 transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl"
                      onClick={() => router.push(`/certification/${cert.field}/${cert.level}`)}
                    >
                      {/* Floating Icon Base */}
                      <div className="flex items-center justify-between mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${cert.field === 'programming' ? 'bg-blue-500/10 text-blue-400' :
                          cert.field === 'design' ? 'bg-purple-500/10 text-purple-400' :
                            cert.field === 'marketing' ? 'bg-emerald-500/10 text-emerald-400' :
                              cert.field === 'cybersecurity' ? 'bg-rose-500/10 text-rose-400' :
                                'bg-amber-500/10 text-amber-400'
                          }`}>
                          {getFieldIcon(cert.field)}
                        </div>
                        {cert.isNew && (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                            New Release
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                          {cert.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                          {cert.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getLevelStyles(cert.level)}`}>
                            {cert.level}
                          </span>
                          <span className="px-4 py-1.5 rounded-xl bg-white/[0.04] border border-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            {cert.duration}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Standard Fee</span>
                          <span className="text-2xl font-black text-emerald-400">₦{cert.price.toLocaleString()}</span>
                        </div>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#121212] bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                              {i === 3 ? '+' : ''}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
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
                <h3 className="text-2xl font-black text-white mb-2">No Matching Certifications</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Try broadening your filters or searching for different keywords.</p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedField("all"); setSelectedLevel("all"); }}
                  className="mt-8 text-emerald-400 text-sm font-bold uppercase tracking-widest hover:text-emerald-300"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CertificationExplorePage;
