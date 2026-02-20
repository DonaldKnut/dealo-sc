"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronRight, Sparkles, Users, MessageSquare, Award, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SUCCESS_STORIES = [
  {
    id: 1,
    name: "Samuel Oladipupo",
    role: "AI Engineering Instructor",
    impact: "Built a 5k+ student community",
    result: "Top 1% Global Creator",
    image: "/assets/Samuel David Potter.jpg",
    quote: "Dealo gave me the tools to share my React expertise with students across Nigeria. The AI features made course creation 10x faster.",
    color: "from-emerald-400 to-cyan-500",
    stats: { students: "5.2K", rating: "4.9", earnings: "Top Tier" }
  },
  {
    id: 2,
    name: "Amara Okonkwo",
    role: "Python for Data Science",
    impact: "100% Student Placement",
    result: "Legacy Partner",
    image: "/assets/Portrait 🤍 __ Cooperate headshot.jpg",
    quote: "Teaching Python has never been more rewarding. The platform's certification system adds real value to my students' resumes.",
    color: "from-emerald-500 to-green-600",
    stats: { students: "3.8K", rating: "4.8", earnings: "Premium" }
  },
  {
    id: 3,
    name: "Tejiri Oghenedoro",
    role: "UI/UX Design Master",
    impact: "Standardized modern UX",
    result: "Design Vanguard",
    image: "/assets/One light headshot not bad 😉📸 @trebihammond came….jpg",
    quote: "The design-first approach of Dealo resonates with my UI/UX teaching style. It's the experience creators have been waiting for.",
    color: "from-green-400 to-emerald-600",
    stats: { students: "2.5K", rating: "4.9", earnings: "Growth" }
  },
  {
    id: 4,
    name: "Amara Okeke",
    role: "Fintech Strategy Leader",
    impact: "Mentored 200+ startups",
    result: "Strategic Advisor",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
    quote: "Dealo isn't just a platform; it's a launchpad for the next generation of Nigerian tech leaders. The scaling tools are unmatched.",
    color: "from-blue-400 to-indigo-500",
    stats: { students: "1.2K", rating: "5.0", earnings: "Elite" }
  },
  {
    id: 5,
    name: "David Adeleke",
    role: "Cloud Architecture Expert",
    impact: "Deployed global infrastructure",
    result: "Architect Emeritus",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400",
    quote: "Bridging the gap between theory and cloud deployment was my goal. Dealo's lab environments made this possible for thousands.",
    color: "from-amber-400 to-orange-500",
    stats: { students: "4.1K", rating: "4.9", earnings: "Top Tier" }
  },
  {
    id: 6,
    name: "Fatima Yusuf",
    role: "Cybersecurity Specialist",
    impact: "Secured 50+ Enterprise Orgs",
    result: "Defense Fellow",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400",
    quote: "Training the defensive front line of African tech. Dealo's secure certification is the gold standard in the industry.",
    color: "from-red-400 to-pink-500",
    stats: { students: "2.9K", rating: "4.8", earnings: "Strategic" }
  }
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-green-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      <main className="relative z-10 pt-32 pb-32">
        {/* ── HERO SECTION ── */}
        <section className="px-6 lg:px-8 mb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black uppercase tracking-[0.34em] text-emerald-400 mb-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              <Award className="w-3.5 h-3.5 fill-emerald-400" />
              Impact Showcase
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase"
            >
              CHAMPIONS OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                DEALO
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/40 font-medium leading-relaxed max-w-2xl mx-auto uppercase tracking-widest text-sm md:text-base leading-loose"
            >
              Documenting the journey of global industry leaders who are scaling their impact and transforming careers across the continent.
            </motion.p>
          </div>
        </section>

        {/* ── STORIES GRID ── */}
        <section className="px-6 lg:px-8 mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SUCCESS_STORIES.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative flex flex-col bg-white/[0.02] border border-white/[0.08] rounded-[3rem] p-1 shadow-2xl transition-all duration-700 hover:border-emerald-500/30 hover:bg-white/[0.04] hover:-translate-y-2 overflow-hidden shadow-inner"
                >
                  {/* Card Content Interior */}
                  <div className="p-8 flex flex-col h-full bg-black/40 backdrop-blur-3xl rounded-[2.8rem] m-px">
                    <div className="relative mb-8 aspect-square rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-[8px] font-black uppercase tracking-widest shadow-xl">
                          {story.result}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                          {story.name}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 group-hover:text-emerald-400 transition-colors">
                          {story.role}
                        </p>
                      </div>

                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-emerald-500/10" />
                        <p className="text-sm font-medium leading-relaxed text-white/40 group-hover:text-white/70 transition-colors italic line-clamp-3">
                          "{story.quote}"
                        </p>
                      </div>

                      {/* Micro Stats */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                        <div className="space-y-0.5">
                          <span className="block text-[8px] font-black uppercase tracking-widest text-white/20">Students</span>
                          <span className="text-sm font-black text-white">{story.stats.students}+</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="block text-[8px] font-black uppercase tracking-widest text-white/20">Rating</span>
                          <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
                            {story.stats.rating} <Star className="w-3 h-3 fill-current" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link
                        href={`/blog/success-stories/${story.id}`}
                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all shadow-xl"
                      >
                        View Full Legacy <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SHARE YOUR LEGACY CTA ── */}
        <section className="px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3.5rem] bg-emerald-500 p-12 lg:p-20 overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.2)] text-center lg:text-left"
            >
              {/* Visual Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-900/10 rounded-full -ml-32 -mb-32 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="space-y-6 flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 text-[10px] font-black uppercase tracking-[0.3em] text-black">
                    Partner with us
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-black leading-[0.9] tracking-tighter uppercase">
                    READY TO SHARE <br />
                    <span className="text-white/40 italic">YOUR LEGACY?</span>
                  </h2>
                  <p className="text-black/60 font-medium text-lg max-w-md mx-auto lg:mx-0">
                    Join our mission to democratize elite tech education. Share your story and inspire the next cohort of high-performers.
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button className="px-12 py-6 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.34em] hover:bg-neutral-900 hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                    Submit Your Impact <Zap className="w-4 h-4 fill-white text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Zap({ className, ...props }: any) {
  return (
    <svg
      className={className}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
