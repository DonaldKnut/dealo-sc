"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";
import Form from "./_components/Form";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useRouter } from "next/navigation";
import { Work } from "./(data)/validationSchemas";
import { motion } from "framer-motion";
import { Globe, Zap, Shield, TrendingUp, Users, Star, CheckCircle, ArrowRight, Sparkles, Lock } from "lucide-react";
import Link from "next/link";

const CreateWork = () => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const router = useRouter();

  const handleSubmit = async (data: Work) => {
    try {
      const response = await fetch("/api/work/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          creator: sessionData?.user?.id || "",
        }),
      });

      if (response.ok) {
        router.push(`/marketplace/shop?id=${sessionData?.user?.id}`);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error: any) {
      console.error("Publish Work failed", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Form Section — z-[110] sits above the fixed header (z-[100]) */}
      <div className="relative z-[110]">
        <Form type="Create" handleSubmit={handleSubmit} />
      </div>

      {/* ─────────────────────────────────────────────────────────
          ADVERT SECTION 1 — Global Reach
      ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 px-6">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/20 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">Global Reach</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.95]">
                YOUR SKILLS,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                  EVERY CONTINENT
                </span>
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
                The moment you publish your service, it's instantly visible to clients across 120+ countries. No borders. No limits. Just opportunity.
              </p>

              <div className="space-y-4">
                {[
                  "Instant global visibility on publish",
                  "Multi-currency payment support",
                  "Localised client matching by timezone",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Visual Globe Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "Active Countries", value: "120+", icon: Globe, color: "text-emerald-400" },
                { label: "Monthly Clients", value: "84K+", icon: Users, color: "text-green-400" },
                { label: "Avg. Response Rate", value: "98%", icon: TrendingUp, color: "text-emerald-300" },
                { label: "Top Rated Services", value: "12K+", icon: Star, color: "text-yellow-400" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 group hover:border-emerald-500/30 transition-all duration-500"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                  <p className="text-4xl font-black mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          ADVERT SECTION 2 — AI Matching Engine
      ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 px-6 bg-white/[0.01]">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">AI Matching Engine</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
              THE RIGHT CLIENT,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                FINDS YOU FIRST
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Our proprietary AI analyses your skills, portfolio, and delivery history to surface your service to the clients most likely to convert — before they even search.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Smart Profiling",
                desc: "AI builds a dynamic talent profile from your service data, reviews, and completion rate.",
                glow: "from-emerald-500/10",
              },
              {
                icon: TrendingUp,
                title: "Demand Prediction",
                desc: "Real-time market signals surface your service when client demand for your niche spikes.",
                glow: "from-green-500/10",
              },
              {
                icon: Users,
                title: "Client Fit Score",
                desc: "Every client inquiry is scored for compatibility before it reaches your inbox.",
                glow: "from-emerald-600/10",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i }}
                whileHover={{ y: -8 }}
                className={`relative bg-gradient-to-b ${card.glow} to-transparent border border-white/10 rounded-[2.5rem] p-10 group hover:border-emerald-500/30 transition-all duration-500 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <card.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          ADVERT SECTION 3 — Secure Escrow & Trust
      ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a1a0a] to-black" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left — Shield Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Central Shield */}
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-full h-full bg-white/[0.03] backdrop-blur-2xl border border-emerald-500/30 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/10">
                  <Shield className="w-24 h-24 text-emerald-400" />
                </div>
              </div>

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-4 -right-4 bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 shadow-xl"
              >
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Funds Protected</p>
                <p className="text-2xl font-black">$2.4M+</p>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute bottom-4 -left-4 bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 shadow-xl"
              >
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Dispute Rate</p>
                <p className="text-2xl font-black">0.3%</p>
              </motion.div>
            </motion.div>

            {/* Right — Copy */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">Secure Escrow</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.95]">
                GET PAID.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                  EVERY TIME.
                </span>
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
                Client funds are locked in escrow the moment a project starts. You deliver, they approve, you get paid — instantly. No chasing invoices. No payment anxiety.
              </p>

              <div className="space-y-4 mb-12">
                {[
                  "Funds held in escrow before work begins",
                  "Instant payout on client approval",
                  "Dispute resolution within 24 hours",
                  "Bank-grade 256-bit encryption",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{point}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/marketplace"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-500 shadow-2xl shadow-emerald-900/40 group"
              >
                Explore the Marketplace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Strip */}
      <div className="border-t border-white/5 py-8 text-center">
        <p className="text-gray-700 font-bold uppercase tracking-[0.4em] text-[10px]">
          © 2025 Dealo Talent Network • Forge with Excellence
        </p>
      </div>
    </div>
  );
};

export default CreateWork;
