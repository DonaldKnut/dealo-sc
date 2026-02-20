"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Rocket,
  CheckCircle,
  ArrowRight,
  Cpu,
  User,
  Layout,
  Star,
  Globe,
  Award,
  Zap,
  ShieldCheck,
  TrendingUp,
  Users,
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Forge from "@/components/ForgeComponent";

const CreateCourseEntryPage = () => {
  const router = useRouter();

  const adverts = [
    {
      icon: <Globe className="w-6 h-6 text-emerald-500" />,
      title: "Global Reach",
      desc: "Distribute your content to students in over 180 countries instantly.",
      stat: "2M+ Students"
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-500" />,
      title: "Elite Standards",
      desc: "Our platform ensures your courses meet premium pedagogical standards.",
      stat: "Top 1% Creators"
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      title: "Fastest Growth",
      desc: "Scale your revenue and influence with our automated marketing tools.",
      stat: "40% MoM Growth"
    }
  ];

  return (
    <div className="min-h-screen bg-emerald-950 selection:bg-emerald-500/30 font-sans relative overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-50"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Rocket className="w-6 h-6 text-emerald-950" />
          </div>
          {/* Branding removed as per user request */}
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push("/dealoforge/dashboard")}
          className="text-emerald-100/60 hover:text-white hover:bg-white/5"
        >
          Cancel & Exit
        </Button>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
            Design Your <span className="text-emerald-500 italic uppercase">Legacy</span>
          </h1>
          <p className="text-emerald-50/40 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Choose your creation path. Use our advanced AI for speed, or build your own custom curriculum manually.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mb-24">
          {/* AI Mode Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dealoforge/create-course/ai")}
            className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] text-left hover:border-emerald-500/50 transition-all duration-500 shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-32 h-32 text-emerald-500" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-8 h-8 text-emerald-950" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white">AI-Powered Flow</h3>
                <p className="text-emerald-50/60 leading-relaxed text-lg">
                  Let our advanced AI generate a full curriculum, chapter outlines, and interactive content in seconds based on your topic.
                </p>
                <div className="pt-4 flex items-center gap-2 text-emerald-400 font-bold group-hover:gap-4 transition-all uppercase tracking-widest text-sm">
                  Start AI Journey <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
          </motion.button>

          {/* Manual Mode Card */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dealoforge/create-custom-course")}
            className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] text-left hover:border-emerald-500/50 transition-all duration-500 shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layout className="w-32 h-32 text-emerald-500" />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white">Personalized Manual</h3>
                <p className="text-emerald-50/60 leading-relaxed text-lg">
                  Build your course from scratch. Upload your own videos, define your own sequence, and create a truly unique learning experience.
                </p>
                <div className="pt-4 flex items-center gap-2 text-white/40 font-bold group-hover:text-white transition-all uppercase tracking-widest text-sm">
                  Build Manually <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-colors" />
          </motion.button>
        </div>

        {/* --- ADVERT COMPONENTS --- */}
        <section className="w-full max-w-6xl">
          <div className="relative mb-24">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-[0.5em] text-emerald-500/40 px-10 bg-emerald-950">
              The Forge Advantage
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {adverts.map((ad, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                  {ad.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{ad.title}</h4>
                <p className="text-emerald-50/40 text-sm leading-relaxed mb-6">{ad.desc}</p>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">{ad.stat}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Big Highlight Advert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-24 relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 rounded-[50px] p-12 md:p-20 text-emerald-950"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="w-64 h-64" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/10 border border-emerald-950/20 text-emerald-950 text-xs font-black uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Trusted Infrastructure
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                  Join the <br /> <span className="underline decoration-white/30">Next Generation</span> <br /> of Educators.
                </h2>
                <p className="text-emerald-950/60 font-medium text-lg max-w-md">
                  From AI automation to white-label custom portals, we provide everything you need to create, sell, and scale.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Users className="w-5 h-5" /> 50K+ Instructors
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <MessageSquare className="w-5 h-5" /> 24/7 VIP Support
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/10 backdrop-blur-md rounded-[40px] p-8 border border-emerald-950/10 space-y-6 transform lg:rotate-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Revenue Growth</div>
                  <div className="text-3xl font-black">+$24,500.00</div>
                </div>
                <div className="h-24 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      className="flex-grow bg-emerald-950/20 rounded-t-lg"
                    />
                  ))}
                </div>
                <p className="text-xs font-bold italic">"Moving to DealoForge increased my student conversion rate by 150% in the first month."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950/20" />
                  <div>
                    <div className="text-xs font-black">Sarah Jenkins</div>
                    <div className="text-[10px] opacity-40 uppercase tracking-widest">Lead Web Instructor</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-32 flex flex-wrap justify-center gap-8 text-emerald-50/20 font-bold uppercase tracking-[0.3em] text-[10px]"
        >
          <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3" /> Professional Standards</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3" /> Advanced AI Support</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3" /> Secure Video Hosting</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3" /> Global Distribution</div>
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="py-20 text-center relative z-10 border-t border-white/5">
        <div className="flex justify-center items-center gap-6 mb-4">
          <Star className="w-5 h-5 text-emerald-500" />
          <span className="text-emerald-100/20 font-bold uppercase tracking-widest text-xs">Innovation in Education</span>
          <Star className="w-5 h-5 text-emerald-500" />
        </div>
        <p className="text-emerald-50/10 text-[10px] font-medium">&copy; 2026 DEALO FORGE • POWERED BY ADVANCED AI SYSTEMS</p>
      </footer>
      <Forge />
    </div>
  );
};

export default CreateCourseEntryPage;
