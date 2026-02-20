"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Building2, Users, Target, TrendingUp, Shield, Zap,
  CheckCircle, ArrowRight, Star, BarChart3, Globe,
  Award, Sparkles, MoveRight, Layers, Fingerprint,
  ZapIcon, Calendar, Check,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRef } from "react";

const FEATURES = [
  { icon: Users, title: "Talent Acquisition", desc: "Access 28,000+ verified African professionals. Filter by skill, location, rating, and availability.", color: "from-emerald-500/10" },
  { icon: Target, title: "Project Management", desc: "Built-in milestone tracking, deliverable reviews, and real-time progress dashboards.", color: "from-blue-500/10" },
  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade 256-bit encryption, SOC 2 compliance, and role-based access control.", color: "from-violet-500/10" },
  { icon: Zap, title: "Workflow Automation", desc: "Automate onboarding, invoicing, and contract signing. Save 10+ hours per hire.", color: "from-orange-500/10" },
  { icon: BarChart3, title: "Advanced Analytics", desc: "Real-time spend tracking, team performance metrics, and ROI reporting.", color: "from-pink-500/10" },
  { icon: Globe, title: "Global Payments", desc: "Pay talent in 50+ currencies. Escrow protection on every transaction.", color: "from-teal-500/10" },
];

const STATS = [
  { value: "40%", label: "Productivity Increase", color: "text-emerald-400" },
  { value: "30%", label: "Faster Delivery", color: "text-green-400" },
  { value: "95%", label: "Client Satisfaction", color: "text-emerald-300" },
  { value: "24/7", label: "Dedicated Support", color: "text-yellow-400" },
];

const TESTIMONIALS = [
  { name: "Sarah Johnson", role: "CEO, TechStart Inc.", content: "Dealo transformed how we hire and manage remote talent across Africa. We cut our time-to-hire by 60%.", rating: 5, initials: "SJ", color: "from-emerald-500 to-green-600" },
  { name: "Michael Chen", role: "CTO, InnovateCorp", content: "The automation features alone saved us 15 hours a week. The quality of talent is genuinely world-class.", rating: 5, initials: "MC", color: "from-blue-500 to-cyan-600" },
  { name: "Emily Rodriguez", role: "Project Manager, GrowthCo", content: "The analytics dashboard gives us visibility we never had before. Every spend is justified and tracked.", rating: 5, initials: "ER", color: "from-violet-500 to-purple-600" },
];

const BENEFITS = [
  "Increase team productivity by 40%",
  "Reduce project completion time by 30%",
  "Improve cross-department collaboration",
  "Secure data management & compliance",
  "Real-time analytics and reporting",
  "24/7 dedicated customer support",
];

export default function BusinessesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-emerald-500/30">

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 origin-left z-[1000]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ─────────────────────────────────────────────────────────
          HERO SECTION — CINEMATIC DEPTH
      ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20 px-6">
        {/* Advanced Background System */}
        <div className="absolute inset-0 z-0">
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]"
          />
          {/* Animated Aurora Blobs */}
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full"
          />
          <motion.div
            animate={{
              x: [0, -50, 0],
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/5 blur-[120px] rounded-full"
          />
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-20" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-10 shadow-2xl shadow-emerald-500/5"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400/90">Enterprise Solutions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase"
          >
            <span className="block text-white">Scale your</span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-green-500 animate-gradient-x py-2">
              Future Today
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed font-medium tracking-tight"
          >
            Empower your enterprise with Africa's premier talent network.
            Built for velocity, transparency, and global scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/sign-in"
              className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-[2rem] overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-3">
                Begin Transformation <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <button className="px-12 py-5 bg-white/5 border border-white/10 backdrop-blur-xl text-white font-black uppercase tracking-widest text-[11px] rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all duration-500">
              Request VIP Demo
            </button>
          </motion.div>
        </div>

        {/* Floating Metrics Section Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent h-40 pointer-events-none z-20" />
      </section>

      {/* ─────────────────────────────────────────────────────────
          IMPACT STATS — INTEGRATED INFINITY
      ───────────────────────────────────────────────────────── */}
      <section className="relative z-30 -mt-10 mb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 text-center group hover:border-emerald-500/40 transition-all duration-500"
              >
                <p className={`text-5xl font-black mb-2 tracking-tighter ${s.color} group-hover:scale-110 transition-transform duration-500`}>
                  {s.value}
                </p>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          CORE CAPABILITIES — BORDER GLOW CARDS
      ───────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
                BUILT FOR THE<br />
                <span className="text-emerald-500">MODERN ENTERPRISE</span>
              </h2>
              <p className="text-gray-500 text-lg font-medium">
                Our ecosystem provides the infrastructure to discover, manage, and scale your workforce with zero friction.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 select-none"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400">2.8k+ Companies Joined</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-12 transition-all duration-500 group-hover:translate-y-[-8px] group-hover:border-emerald-500/30">
                  <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500`}>
                    <f.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight text-white uppercase">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>

                  <div className="mt-10 pt-10 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                      Learn System Architecture <MoveRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          ROADMAP SECTION — ASYMMETRIC STORYTELLING
      ───────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
                  <Layers className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className="text-5xl font-black tracking-tighter mb-8 leading-none">
                  INTEGRATION<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">WITHOUT FRICTION</span>
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "One-Click Compliance", desc: "Automated tax forms and legal background checks." },
                    { title: "Instant Payout Escrow", desc: "Global currency conversion handled automatically." },
                    { title: "AI-Driven Matching", desc: "Get curated shortlists in under 24 hours." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white mb-1 uppercase tracking-tight">{item.title}</p>
                        <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-white/[0.03] rounded-[3rem] border border-white/10 p-4 md:p-12 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Fingerprint, label: "Biometric KYC", val: "Verified" },
                    { icon: ZapIcon, label: "Response Time", val: "2min avg" },
                    { icon: Globe, label: "Active Regions", val: "Global" },
                    { icon: Calendar, label: "Uptime SLA", val: "99.9%" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl group/item hover:border-emerald-500/30 transition-all">
                      <stat.icon className="w-6 h-6 text-emerald-500/50 mb-6 group-hover/item:text-emerald-400 transition-colors" />
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-white">{stat.val}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TESTIMONIALS — SPOTLIGHT CAROUSEL
      ───────────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black tracking-tighter mb-4">
              TRUSTED BY <span className="text-emerald-500">MARKET LEADERS</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 hover:border-emerald-500/30 transition-all duration-500"
              >
                <div className="flex gap-1 mb-10">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                  ))}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-10 italic font-medium">"{t.content}"</p>
                <div className="mt-auto flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-500/10`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-black text-white text-sm uppercase tracking-tight">{t.name}</p>
                    <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FINAL CALL TO ACTION — IMMERSIVE
      ───────────────────────────────────────────────────────── */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[150px] rounded-full" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase">
              The infrastructure for your <br />
              <span className="text-emerald-500">Global Ambition</span>
            </h2>
            <p className="text-gray-400 text-xl font-medium mb-16 max-w-2xl mx-auto">
              Join 12,000+ businesses scaling with Dealo. No credit card required to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/sign-in"
                className="group px-16 py-6 bg-emerald-500 text-black font-black uppercase tracking-widest text-[12px] rounded-[2.5rem] hover:bg-emerald-400 hover:scale-105 transition-all duration-500 shadow-2xl shadow-emerald-500/20 flex items-center gap-3"
              >
                Launch Enterprise Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[12px] rounded-[2.5rem] hover:bg-white/10 transition-all duration-500">
                Contact Strategy Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>


      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
