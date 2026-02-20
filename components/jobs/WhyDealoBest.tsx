"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Users,
  TrendingUp,
  Target,
  Clock,
  Briefcase,
  Sparkles,
  BookOpen,
  Network,
  Globe2,
} from "lucide-react";

const WhyDealoBest = () => {
  const missionBenefits = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-POWERED MATCHING",
      description: "Neural algorithms align your distinct skillsets with high-impact opportunities instantly.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "VERIFIED EMPLOYERS",
      description: "Every entity undergoes rigorous validation to ensure mission legitimacy and secure engagement.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "ACTIVE COMMUNITY",
      description: "Join a network of 50,000+ elite professionals driving the boundaries of modern work.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "CAREER EVOLUTION",
      description: "Access a direct pipeline to certifications, advanced courses, and high-value networking.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "FREE KNOWLEDGE",
      description: "Redeem premium certifications and specialized training modules at zero cost.",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "NEURAL NETWORKING",
      description: "Establish direct synaptic links with industry leaders and accelerate your trajectory.",
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "GLOBAL DEPLOYMENT",
      description: "Target local missions or remote opportunities across international borders with ease.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "RAPID MANIFEST",
      description: "Initiate applications instantly with our high-speed, one-click manifest system.",
    },
  ];

  const stats = [
    { number: "50K+", label: "ACTIVE PROFESSIONALS", icon: <Users className="w-5 h-5" /> },
    { number: "12K+", label: "MISSION LISTINGS", icon: <Briefcase className="w-5 h-5" /> },
    { number: "95%", label: "SUCCESS QUOTIENT", icon: <Target className="w-5 h-5" /> },
    { number: "24/7", label: "SUPPORT AVAILABILITY", icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 mx-auto">
            <Sparkles className="w-3 h-3" />
            PLATFORM MASTERY
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
            WHY DEALO IS THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">PREMIUM CHOICE</span>
          </h2>
          <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-[10px] max-w-2xl mx-auto leading-relaxed">
            Beyond traditional boards. We are your complete career growth architecture,
            engineered for elite talent acquisition and deployment.
          </p>
        </motion.div>

        {/* Stats Section - High Impact Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group p-10 bg-white/[0.01] border border-white/[0.05] rounded-[2.5rem] text-center hover:bg-white/[0.03] transition-all duration-700"
            >
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 mx-auto border border-emerald-500/20 text-emerald-400">
                  {stat.icon}
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.number}</div>
                <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid - Cinematic Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missionBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] p-8 border border-white/[0.05] hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all duration-500 group flex flex-col h-full shadow-2xl"
            >
              <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mb-8 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 shadow-2xl">
                {benefit.icon}
              </div>
              <h3 className="text-[12px] font-black text-white mb-4 tracking-[0.2em] uppercase">{benefit.title}</h3>
              <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase tracking-wider">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyDealoBest;

