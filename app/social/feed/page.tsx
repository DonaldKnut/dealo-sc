"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Users, Sparkles, Image as ImageIcon, Video,
  Link as LinkIcon, Send, Search, Bell, Plus, Star, Award,
  Zap, Globe, ArrowRight, CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";

const POSTS = [
  {
    id: 1,
    author: "Amara Osei",
    role: "Full-Stack Developer",
    initials: "AO",
    color: "from-emerald-500 to-green-600",
    time: "2h ago",
    content: "Just shipped a real-time collaboration feature for a fintech client in Lagos 🚀 Built with Next.js 14, Socket.io, and MongoDB Atlas. The latency is under 80ms across West Africa. Proud of this one.",
    tags: ["#WebDev", "#Fintech", "#Nigeria"],
    likes: 142,
    comments: 28,
    shares: 14,
    liked: false,
    bookmarked: false,
    verified: true,
  },
  {
    id: 2,
    author: "Temi Adeyemi",
    role: "Brand Designer",
    initials: "TA",
    color: "from-violet-500 to-purple-600",
    time: "4h ago",
    content: "Redesigned a full brand identity for a Pan-African e-commerce startup. Logo, typography, color system, and component library — all in Figma. The emerald + black palette hits different 🖤💚",
    tags: ["#Design", "#Branding", "#Figma"],
    likes: 89,
    comments: 17,
    shares: 32,
    liked: true,
    bookmarked: true,
    verified: false,
  },
  {
    id: 3,
    author: "Chidi Nwosu",
    role: "ML Engineer",
    initials: "CN",
    color: "from-blue-500 to-cyan-600",
    time: "6h ago",
    content: "My fraud detection model just hit 99.2% accuracy on the test set 🎯 Trained on 2M+ transactions using XGBoost + feature engineering. The false positive rate is down to 0.3% — that's the real win for the business.",
    tags: ["#MachineLearning", "#Fintech", "#Python"],
    likes: 203,
    comments: 44,
    shares: 67,
    liked: false,
    bookmarked: false,
    verified: true,
  },
  {
    id: 4,
    author: "Fatima Bello",
    role: "Content Strategist",
    initials: "FB",
    color: "from-orange-500 to-amber-600",
    time: "8h ago",
    content: "Content tip: Stop writing for algorithms. Write for the person who wakes up at 2am with the exact problem you solve. That's your real audience. That's who converts. 📝",
    tags: ["#ContentStrategy", "#Marketing", "#Growth"],
    likes: 318,
    comments: 52,
    shares: 89,
    liked: true,
    bookmarked: false,
    verified: false,
  },
];

const TRENDING = [
  { tag: "#WebDev", posts: "2.4K posts" },
  { tag: "#AfricanTech", posts: "1.8K posts" },
  { tag: "#Freelancing", posts: "1.2K posts" },
  { tag: "#AITools", posts: "987 posts" },
  { tag: "#UIDesign", posts: "743 posts" },
];

const SUGGESTED = [
  { name: "Emeka Eze", role: "Growth Marketer", initials: "EE", color: "from-pink-500 to-rose-600" },
  { name: "Ngozi Okonkwo", role: "Video Producer", initials: "NO", color: "from-teal-500 to-emerald-600" },
  { name: "Kemi Adebayo", role: "UX Researcher", initials: "KA", color: "from-indigo-500 to-blue-600" },
];

export default function SocialFeedPage() {
  const [posts, setPosts] = useState(POSTS);
  const [newPost, setNewPost] = useState("");
  const [followed, setFollowed] = useState<string[]>([]);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const toggleBookmark = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* ── MAIN FEED ── */}
          <div className="space-y-6">

            {/* Compose Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6"
            >
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 font-black text-black">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share something with the network..."
                    rows={3}
                    className="w-full bg-transparent text-white placeholder-gray-600 resize-none focus:outline-none text-sm leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      {[ImageIcon, Video, LinkIcon].map((Icon, i) => (
                        <button key={i} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-emerald-400 transition-colors">
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feed Posts */}
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-7 hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header */}
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${post.color} flex items-center justify-center font-black text-white flex-shrink-0`}>
                      {post.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{post.author}</span>
                        {post.verified && (
                          <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-2.5 h-2.5 text-black" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs">{post.role} · {post.time}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl hover:bg-white/5 text-gray-600 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4 relative z-10">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-emerald-400 text-xs font-bold hover:text-emerald-300 cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${post.liked ? "text-red-400 bg-red-500/10" : "text-gray-500 hover:text-red-400 hover:bg-red-500/5"
                        }`}
                    >
                      <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </motion.button>

                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-bold">{post.comments}</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-500 hover:text-blue-400 hover:bg-blue-500/5 transition-all">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs font-bold">{post.shares}</span>
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => toggleBookmark(post.id)}
                    className={`p-2 rounded-xl transition-all ${post.bookmarked ? "text-emerald-400 bg-emerald-500/10" : "text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/5"
                      }`}
                  >
                    <Bookmark className={`w-4 h-4 ${post.bookmarked ? "fill-current" : ""}`} />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">

            {/* Trending */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-black text-white tracking-tight">Trending</h3>
              </div>
              <div className="space-y-4">
                {TRENDING.map((t, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="text-emerald-400 font-black text-sm group-hover:text-emerald-300 transition-colors">{t.tag}</p>
                      <p className="text-gray-600 text-xs">{t.posts}</p>
                    </div>
                    <span className="text-gray-700 text-xs font-bold">#{i + 1}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Suggested People */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-black text-white tracking-tight">People to Follow</h3>
              </div>
              <div className="space-y-5">
                {SUGGESTED.map((person) => (
                  <div key={person.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${person.color} flex items-center justify-center font-black text-white text-sm`}>
                        {person.initials}
                      </div>
                      <div>
                        <p className="font-black text-white text-sm group-hover:text-emerald-400 transition-colors">{person.name}</p>
                        <p className="text-gray-600 text-xs">{person.role}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setFollowed((prev) =>
                          prev.includes(person.name)
                            ? prev.filter((n) => n !== person.name)
                            : [...prev, person.name]
                        )
                      }
                      className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${followed.includes(person.name)
                          ? "bg-white/5 text-emerald-400 border border-emerald-500/20"
                          : "bg-emerald-500 text-black hover:bg-emerald-400"
                        }`}
                    >
                      {followed.includes(person.name) ? "Following" : "Follow"}
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-950/60 to-black border border-emerald-500/20 rounded-[2rem] p-7 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
              <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-black text-white text-lg mb-2 tracking-tight">Go Pro</h3>
              <p className="text-gray-500 text-xs mb-5 leading-relaxed">Unlock analytics, priority placement, and verified badge.</p>
              <Link
                href="/pricing"
                className="flex items-center gap-2 text-xs font-black text-black bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 rounded-xl transition-colors"
              >
                Upgrade Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
