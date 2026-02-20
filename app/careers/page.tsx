"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Rocket,
  Heart,
  Globe,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CareersPage() {
  const router = useRouter();

  const values = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Innovation First",
      description: "We're building the future of AI-driven education and certification.",
      color: "text-emerald-400"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Impact Driven",
      description: "Our work directly empowers thousands of professionals globally.",
      color: "text-rose-400"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Remote Culture",
      description: "Work from anywhere in the world with a diverse, global team.",
      color: "text-blue-400"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Excellence",
      description: "We set high standards and push the boundaries of what's possible.",
      color: "text-amber-400"
    }
  ];

  const openings = [
    {
      title: "Senior Full-Stack Developer",
      location: "Remote / Lagos, Nigeria",
      type: "Full-time",
      department: "Engineering",
      salary: "Competitive",
      tags: ["React", "Express", "AI"]
    },
    {
      title: "Product Designer",
      location: "Remote / Abuja, Nigeria",
      type: "Full-time",
      department: "Design",
      salary: "Market Rate",
      tags: ["Figma", "UX", "Visual"]
    },
    {
      title: "Content Marketing Manager",
      location: "Remote",
      type: "Full-time",
      department: "Marketing",
      salary: "Competitive",
      tags: ["SEO", "Growth", "Social"]
    },
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
              Join the Mission
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]"
            >
              BUILD THE FUTURE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
                WITH DEALO
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed"
            >
              We're looking for visionary thinkers and bold creators to help us revolutionize professional growth through AI.
            </motion.p>
          </div>
        </section>

        {/* ── VALUES SECTION ── */}
        <section className="px-6 lg:px-8 py-20 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-black mb-3">{value.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOB OPENINGS SECTION ── */}
        <section className="px-6 lg:px-8 py-20 bg-white/[0.02] border-y border-white/[0.05] relative">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase tracking-widest">Open Positions</h2>
                <div className="h-1 w-20 bg-emerald-500 mt-2 rounded-full" />
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{openings.length} Active Slots</span>
              </div>
            </div>

            <div className="space-y-4">
              {openings.map((opening, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#0a0a0a] border border-white/[0.06] rounded-[2rem] p-8 hover:border-emerald-500/30 transition-all cursor-pointer shadow-2xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/[0.03] text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/[0.05]">
                          {opening.department}
                        </span>
                        {opening.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-emerald-500/5 text-emerald-500/60 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                        {opening.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-6 text-gray-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">{opening.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">{opening.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[10px] text-gray-700 font-black uppercase tracking-widest">Base Comp</span>
                        <span className="text-emerald-400 font-bold">{opening.salary}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        <ArrowRight className="w-5 h-5 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section className="px-6 lg:px-8 py-32 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase tracking-widest">Didn't see a fit?</h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium mb-12">
              We're always looking for talented rebels. Send us a general application and tell us how you can help.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/contact")}
              className="px-12 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-400 transition-colors flex items-center gap-3 mx-auto"
            >
              Get in Touch
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
}
