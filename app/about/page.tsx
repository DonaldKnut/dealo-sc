"use client";

import { motion } from "framer-motion";
import {
  Target,
  Users,
  Zap,
  Globe,
  Award,
  Heart,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  MapPin,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Fueled by Purpose",
      description: "We don't just build tools; we open doors for professionals to thrive and win."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "People First",
      description: "Before the code and the AI, there's you. We're building a community that genuinely cares."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Ahead of the Curve",
      description: "We're obsessed with what's next, making sure you're always equipped with tomorrow's tech."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "No Borders",
      description: "We believe your location shouldn't limit your potential. We're bridging the global gap."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Always Giving Our Best",
      description: "We don't settle for 'good enough'. Quality is the baseline for everything we touch."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Honest to the Core",
      description: "No corporate fluff. Just transparent, real talk and actions you can count on."
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 relative overflow-hidden">

      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      <main className="relative z-10 pt-32 pb-32">
        {/* ── HERO SECTION ── */}
        <section className="px-6 lg:px-8 mb-32">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black uppercase tracking-[0.34em] text-emerald-400 mb-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              Our Core Identity
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase"
            >
              THE DEALO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                JOURNEY
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/40 font-medium leading-relaxed max-w-2xl mx-auto uppercase tracking-widest text-sm md:text-base leading-loose"
            >
              We're not just building a platform; we're crafting a launchpad for the next generation of African high-performers.
            </motion.p>
          </div>
        </section>

        {/* ── STORY & VISION ── */}
        <section className="px-6 lg:px-8 mb-32">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-1.5 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent shadow-2xl"
            >
              <div className="p-10 lg:p-14 rounded-[2.9rem] bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter">How it all started</h2>
                  <p className="text-white/50 text-lg leading-relaxed font-medium">
                    Dealo was born from a simple observation: Nigeria is overflowing with talent, but the bridge to global opportunity was shaky. We set out to fix that.
                  </p>
                  <p className="text-white/40 leading-relaxed">
                    By combining localized insights with world-class tech, we've created a space where your work travels further than your borders ever could.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-1.5 rounded-[3rem] bg-gradient-to-br from-emerald-500/20 to-transparent shadow-2xl"
            >
              <div className="p-10 lg:p-14 rounded-[2.9rem] bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter">Where we're heading</h2>
                  <p className="text-white/50 text-lg leading-relaxed font-medium">
                    Our vision is clear: To become the primary engine for professional growth across the continent and beyond.
                  </p>
                  <p className="text-white/40 leading-relaxed">
                    We're building a future where your skills are your currency, and geography is no longer a debt you have to pay.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── VALUES SECTION ── */}
        <section className="px-6 lg:px-8 mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">What we stand for</h2>
              <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold font-black">No corporate lingo, just our honest promises to you.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all duration-500 shadow-xl"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-emerald-500 group-hover:text-black group-hover:scale-110 transition-all duration-500 mb-8">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4 group-hover:text-emerald-400 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-white/40 font-medium leading-relaxed group-hover:text-white/60 transition-colors">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-12 lg:p-20 rounded-[3.5rem] bg-emerald-500 overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.2)] text-center group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-black/10 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-black leading-[0.9] tracking-tighter uppercase whitespace-pre-line">
                  WANT TO BE PART <br />
                  <span className="text-white/40 italic">OF THE STORY?</span>
                </h2>
                <p className="text-black/60 font-bold uppercase tracking-widest text-sm max-w-sm mx-auto">
                  We're always looking for high-performers to join our community.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto px-12 py-6 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.34em] hover:bg-neutral-900 transition-all shadow-2xl active:scale-95 py-6"
                  >
                    Get in Touch
                  </Link>
                  <Link
                    href="/careers"
                    className="w-full sm:w-auto px-12 py-6 bg-white/20 text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.34em] hover:bg-white/40 transition-all py-6 backdrop-blur-md"
                  >
                    See Careers
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
