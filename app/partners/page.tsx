"use client";

import { motion } from "framer-motion";
import {
  Handshake,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  Globe,
  Zap,
  ShieldCheck,
  ChevronRight,
  Target,
  BarChart3,
  Rocket
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PartnersPage() {
  const router = useRouter();

  const partnerTypes = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Corporate Partners",
      description: "Upskill your workforce with industry-leading certifications and AI-driven training paths.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/20"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Education Partners",
      description: "Empower your students with professional credentials that actually matter in the modern economy.",
      color: "text-blue-400",
      bg: "bg-blue-500/5",
      border: "border-blue-500/20"
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Technology Partners",
      description: "Integrate our AI assessment engine into your platform to provide instant validation.",
      color: "text-purple-400",
      bg: "bg-purple-500/5",
      border: "border-purple-500/20"
    },
  ];

  const adverts = [
    {
      label: "Global Standards",
      title: "Unified Certification Framework",
      description: "Our certifications are recognized globally, ensuring that your teams and students meet the highest international standards of excellence.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
      stats: ["98% Recognition", "150+ Countries"],
      align: "left"
    },
    {
      label: "Advanced AI",
      title: "Real-time Skill Assessment",
      description: "Leverage our proprietary AI engine to evaluate technical skills with clinical precision. No more manual grading, just pure data.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000",
      stats: ["Instant Results", "Anti-Cheat Tech"],
      align: "right"
    },
    {
      label: "Seamless Integration",
      title: "Partner API Ecosystem",
      description: "Connect your LMS or corporate portal to Dealo effortlessly. Our robust API allows for deep white-labeling and custom reporting.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
      stats: ["99.9% Uptime", "Developer First"],
      align: "left"
    }
  ];

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

      <div className="relative z-10 w-full">
        {/* ── HERO SECTION ── */}
        <section className="pt-40 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
              Strategic Growth
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]"
            >
              ACCELERATE WITH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                DEALO PARTNERS
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Join a network of industry leaders, educators, and innovators building the next generation of professional standards.
            </motion.p>
          </div>
        </section>

        {/* ── PARTNER CATEGORIES GRID ── */}
        <section className="px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${type.bg} ${type.border} border rounded-[2.5rem] p-10 hover:bg-white/[0.05] transition-all group relative overflow-hidden`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 ${type.color}`}>
                    {type.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:translate-x-1 transition-transform">{type.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-8">
                    {type.description}
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white hover:text-emerald-400 transition-colors">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ADVERT COMPONENTS ── */}
        <div className="space-y-32 py-32 overflow-hidden">
          {adverts.map((ad, index) => (
            <section key={index} className="px-6 lg:px-8">
              <div className={`max-w-7xl mx-auto flex flex-col ${ad.align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32`}>
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: ad.align === 'right' ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex-1 space-y-8"
                >
                  <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">{ad.label}</span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">{ad.title}</h2>
                  <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                    {ad.description}
                  </p>
                  <div className="flex flex-wrap gap-8">
                    {ad.stats.map(stat => (
                      <div key={stat} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">{stat}</span>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-3 text-emerald-400 font-black text-sm uppercase tracking-widest"
                  >
                    Explore Case Study <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                {/* Cinematic Image/Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateY: ad.align === 'right' ? -10 : 10 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex-1 w-full aspect-[4/3] rounded-[3rem] overflow-hidden relative group shadow-2xl border border-white/10 min-h-[200px]"
                >
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-60" />
                  {/* Floating Element Over Image */}
                  <div className="absolute bottom-10 left-10 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl max-w-xs group-hover:-translate-y-2 transition-transform">
                    <Zap className="w-8 h-8 text-emerald-400 mb-3" />
                    <p className="text-sm font-bold leading-snug">Empowering the next generation of digital leaders through data-driven partnerships.</p>
                  </div>
                </motion.div>
              </div>
            </section>
          ))}
        </div>

        {/* ── PARTNER MARQUEE ── */}
        <section className="py-20 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
          <div className="max-w-7xl mx-auto text-center mb-12">
            <span className="text-gray-600 font-black text-[10px] uppercase tracking-[0.4em]">Trusted By Industry Giants</span>
          </div>
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-20 whitespace-nowrap px-10"
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 font-black text-4xl opacity-10 uppercase tracking-tighter">
                <span>TECHCORP</span>
                <span>EDUGLUE</span>
                <span>FINSYNC</span>
                <span>MODERNUI</span>
                <span>CYBERSEC</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section className="px-6 lg:px-8 py-32 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">READY TO <br /><span className="text-emerald-500">SCALE IMPACT?</span></h2>
            <p className="text-gray-400 text-xl font-medium mb-12 max-w-2xl mx-auto">
              Whether you're a startup or a Fortune 500, we have the infrastructure to support your growth.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/contact")}
              className="px-16 py-6 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-emerald-400 transition-colors flex items-center gap-4 mx-auto"
            >
              Start Partnership
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
}
