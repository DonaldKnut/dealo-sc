"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Share2, Bookmark, Globe } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  views: string;
  tags: string[];
  publishedTime: string;
  modifiedTime: string;
  image: string;
}

export default function ClientPost({ post }: { post: BlogPost }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* ── INTELLIGENCE PROGRESS UNIT ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100] shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        style={{ scaleX }}
      />

      {/* ── BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-emerald-500/20"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5
              }}
              animate={{
                y: ["0%", "100%"],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <main className="relative z-10">
        {/* ── HEADER ── */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-12 hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Return to Intelligence Unit
              </Link>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-3 h-3 text-emerald-500/50" />
                    {post.views} Global Reads
                  </span>
                </div>

                <div className="relative group">
                  {/* Scanning Line Effect */}
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-px bg-emerald-500/20 z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)] pointer-events-none"
                  />
                  <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
                    {post.title}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-emerald-500/20 flex items-center justify-center p-0.5">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center border border-white/5 shadow-inner">
                        <User className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tighter text-gray-600">Architect</span>
                      <span className="text-sm font-bold text-white tracking-tight">{post.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-10 text-gray-700">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tighter">Genesis Date</span>
                      <span className="text-sm font-medium text-gray-400 border-b border-emerald-500/20 pb-0.5">{post.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tighter">Read Duration</span>
                      <span className="text-sm font-medium text-gray-400">{post.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-8">
                  <button className="group relative flex items-center gap-2 px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Share2 className="w-3.5 h-3.5" />
                    Dispatch Insights
                  </button>
                  <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/10 transition-all">
                    <Bookmark className="w-3.5 h-3.5 text-emerald-500" />
                    Archive Blueprint
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <section className="px-6 pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-px bg-emerald-500/10 blur-[80px] rounded-[3rem] opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />
              <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-24 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full" />

                <div
                  className="prose prose-invert prose-emerald max-w-none prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-p:text-gray-400 prose-p:text-lg prose-p:leading-[1.8] prose-blockquote:border-emerald-500/50 prose-blockquote:bg-emerald-500/5 prose-blockquote:rounded-2xl prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:font-medium prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-24 pt-12 border-t border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60 mb-8">Metadata Clusters</h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-5 py-2.5 bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 hover:border-emerald-500/30 hover:text-emerald-500 transition-all cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── RELATED DISPATCH ── */}
        <section className="px-6 pb-40">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-6 mb-16 px-4">
                <div className="w-12 h-px bg-emerald-500" />
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Related Dispatch</h2>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  {
                    id: "2",
                    title: "How I Landed My Dream Job at Google",
                    excerpt: "Follow the journey of a self-taught developer who went from zero to Google.",
                    author: "Michael Chen",
                    date: "Dec 26, 2024",
                  },
                  {
                    id: "3",
                    title: "The Future of AI in Software Development",
                    excerpt: "Explore how artificial intelligence is transforming the way we write code.",
                    author: "Emily Davis",
                    date: "Dec 25, 2024",
                  },
                ].map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group">
                    <div className="relative bg-white/[0.02] border border-white/5 p-12 rounded-[2.5rem] group-hover:bg-white/[0.04] group-hover:border-emerald-500/20 transition-all duration-700 h-full flex flex-col justify-between shadow-lg">
                      <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tight leading-[1.1] group-hover:text-emerald-400 transition-colors uppercase italic">{relatedPost.title}</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                      <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between font-black uppercase tracking-[0.2em] text-[9px] text-gray-700 group-hover:text-emerald-500/50 transition-colors">
                        <span>Intel Unit Verified</span>
                        <span className="flex items-center gap-2 text-emerald-500 group-hover:gap-3 transition-all">Analyze Blueprint <ArrowRight className="w-4 h-4" /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}


