"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareerTipsPage() {
  const posts = [
    {
      id: "4",
      title: "Building a Personal Brand as a Freelancer",
      description: "Learn strategies to build your personal brand and attract high-paying clients in the global marketplace.",
      author: "David Wilson",
      date: "Dec 24, 2024",
      readTime: "10 min read",
      category: "career-tips",
      views: "7.1K",
    },
    {
      id: "5",
      title: "Mastering the Art of Tech Interviewing",
      description: "A deep dive into the psychological and technical frameworks for acing top-tier engineering roles.",
      author: "Sarah Johnson",
      date: "Jan 12, 2025",
      readTime: "15 min read",
      category: "career-tips",
      views: "4.3K",
    },
    {
      id: "6",
      title: "Architecting Your Growth: From Junior to Lead",
      description: "A strategic roadmap for navigating the complexities of career progression in high-stakes environments.",
      author: "Michael Chen",
      date: "Feb 05, 2025",
      readTime: "18 min read",
      category: "career-tips",
      views: "10.2K",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <main className="relative z-10 pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* ── HERO ── */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Return to Intelligence Hub
              </Link>

              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-px bg-emerald-500" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">Mission Objective</span>
                </div>
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] italic">
                  Career <span className="text-emerald-500">Engineering</span>
                </h1>
                <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                  Strategic frameworks and blueprints for navigating the path to professional mastery in the global tech ecosystem.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── ARCHIVE GRID ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group">
                <div className="relative h-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-500 overflow-hidden shadow-2xl">
                  {/* Glass Shimmer */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        {post.category.replace('-', ' ')}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-gray-700">
                        <Globe className="w-3 h-3" />
                        {post.views} Global Reads
                      </div>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight leading-[1.1] italic group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                      <span>Architect: {post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{post.readTime}</span>
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 group-hover:gap-2 transition-all">
                        Analyze <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* ── EXPANSION CTA ── */}
          <div className="mt-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-px bg-emerald-500/10 blur-[100px] rounded-[3rem] opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />
              <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-20 text-center space-y-8 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Ready to <span className="text-emerald-500">Accelerate?</span>
                </h2>
                <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                  Join the intelligence network of the future and transition from passive observer to active architect.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/sign-up" className="px-10 py-5 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20">Initialize Success Flow</Link>
                  <Link href="/courses" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white/10 transition-all">Browse Blueprints</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}


