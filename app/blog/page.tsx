"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  BookOpen,
  Target,
  Code,
  Star,
  TrendingUp,
  Zap,
  Globe,
} from "lucide-react";
import Link from "next/link";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { id: "All", name: "All Posts", icon: <BookOpen className="w-4 h-4" /> },
    {
      id: "career-tips",
      name: "Career Tips",
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: "tech-insights",
      name: "Tech Insights",
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: "success-stories",
      name: "Success Stories",
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: "industry-news",
      name: "Industry News",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  const posts = [
    {
      id: "1",
      title: "10 Essential Skills Every Developer Needs in 2024",
      excerpt:
        "Discover the most in-demand programming skills that will boost your career.",
      author: "Sarah Johnson",
      date: "Dec 27, 2024",
      readTime: "8 min read",
      category: "tech-insights",
      featured: true,
      views: "12.5K",
    },
    {
      id: "2",
      title: "How I Landed My Dream Job at Google",
      excerpt:
        "Follow the journey of a self-taught developer who went from zero to Google.",
      author: "Michael Chen",
      date: "Dec 26, 2024",
      readTime: "12 min read",
      category: "success-stories",
      featured: true,
      views: "8.9K",
    },
    {
      id: "3",
      title: "The Future of AI in Software Development",
      excerpt:
        "Explore how artificial intelligence is transforming the way we write code.",
      author: "Emily Davis",
      date: "Dec 25, 2024",
      readTime: "6 min read",
      category: "tech-insights",
      views: "5.2K",
    },
    {
      id: "4",
      title: "Building a Personal Brand as a Freelancer",
      excerpt:
        "Learn strategies to build your personal brand and attract high-paying clients.",
      author: "David Wilson",
      date: "Dec 24, 2024",
      readTime: "10 min read",
      category: "career-tips",
      views: "7.1K",
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <main className="relative z-10">
        {/* ── HERO SECTION ── */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Intelligence Unit</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
                Dealo <span className="text-emerald-500">Insights</span>
              </h1>
              <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Architecting the future of African talent through deep intelligence,
                success blueprints, and elite career engineering.
              </p>
            </motion.div>

            {/* ── SEARCH & FILTERS ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 max-w-4xl mx-auto space-y-8"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden focus-within:border-emerald-500/30 transition-all">
                  <Search className="ml-6 w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Scan the archives..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-5 bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-700 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group relative px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 ${selectedCategory === category.id
                      ? "bg-emerald-500 text-black shadow-2xl shadow-emerald-500/20"
                      : "bg-white/[0.03] text-gray-500 border border-white/5 hover:border-emerald-500/30 hover:text-white"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      {category.icon}
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FEATURED GRID ── */}
        <section className="py-20 px-6 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16 px-4">
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500">Elite Selection</h4>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Featured Blueprints</h2>
              </div>
              <div className="hidden md:block h-px flex-1 bg-white/5 mx-12 mb-4" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts
                .filter((post) => post.featured)
                .map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="relative h-[450px] rounded-3xl overflow-hidden border border-white/10 p-10 flex flex-col justify-end group-hover:border-emerald-500/30 transition-all duration-700 bg-white/[0.02]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0" />

                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                              {post.category}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{post.readTime}</span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none group-hover:text-emerald-400 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-2 max-w-xl">
                            {post.excerpt}
                          </p>
                          <div className="pt-4 flex items-center justify-between border-t border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <User className="w-3 h-3 text-emerald-500" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{post.author}</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-emerald-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* ── RECENT LOGS ── */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-8 mb-16">
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500">The Archives</h4>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Recent Dispatch</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts
                .filter((post) => !post.featured)
                .map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="group bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-500 h-full flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-500/70">{post.category}</div>
                          <h3 className="text-xl font-black uppercase tracking-tight leading-snug">{post.title}</h3>
                          <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{post.date}</span>
                          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            Read Case <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* ── ACCELERATOR CTA ── */}
        <section className="pb-32 px-6">
          <div className="max-w-5xl mx-auto relative group">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 backdrop-blur-3xl rounded-[3rem] p-16 overflow-hidden text-center">
              <Zap className="w-12 h-12 text-emerald-500 mx-auto mb-8 animate-pulse" />
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">Redefine Your <span className="text-emerald-500">Trajectory</span></h2>
              <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
                Join the intelligence network of the future. Gain exclusive access to elite learning modules and global opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="px-10 py-5 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20">Initialize Success Flow</Link>
                <Link href="/courses" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white/10 transition-all">Browse Capability Grid</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogPage;
