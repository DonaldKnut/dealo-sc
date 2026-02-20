"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Globe2,
  BookOpen,
  Network,
  Award,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const DealoAdvantages = () => {
  const advantages = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "SMART MATCHING",
      subtitle: "AI-POWERED ALIGNMENT",
      description: "Receive high-precision recommendations optimized for your unique professional profile.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "FREE LEARNING",
      subtitle: "SKILL ACQUISITION",
      description: "Access a library of premium certifications and courses while navigating the market.",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "BUILD CONNECTIONS",
      subtitle: "NEURAL NETWORKING",
      description: "Establish direct links with industry leaders and accelerate your career trajectory.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "TRUSTED PLATFORM",
      subtitle: "VERIFICATION NEXUS",
      description: "Engage exclusively with pre-vetted entities for 100% secure professional deployment.",
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "WORLDWIDE ACCESS",
      subtitle: "GLOBAL REACH",
      description: "Target local missions or remote opportunities across international borders.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "QUICK APPLY",
      subtitle: "STREAMLINED PROTOCOL",
      description: "Initiate applications instantly with our high-speed, one-click manifest system.",
    },
  ];

  const comparison = [
    { feature: "AI JOB MATCHING", dealo: true, others: false },
    { feature: "FREE COURSES INCLUDED", dealo: true, others: false },
    { feature: "PROFESSIONAL NETWORKING", dealo: true, others: false },
    { feature: "VERIFIED EMPLOYERS", dealo: true, others: "LIMITED" },
    { feature: "CAREER GROWTH TOOLS", dealo: true, others: false },
    { feature: "LOCAL MARKET OPTIMIZATION", dealo: true, others: false },
  ];

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
            PLATFORM <span className="text-emerald-500">SUPERIORITY</span>
          </h2>
          <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-[10px] max-w-xl mx-auto">
            Benchmark your professional journey against industry standards.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] p-10 lg:p-20 border border-white/[0.05] relative overflow-hidden group/matrix shadow-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          <h3 className="text-2xl md:text-3xl font-black text-white mb-16 text-center tracking-tight uppercase">
            ECOSYSTEM <span className="text-emerald-500/60">COMPARISON MATRIX</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="text-left pb-10 px-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Feature Set</th>
                  <th className="text-center pb-10 px-6 text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em]">Dealo Nexus</th>
                  <th className="text-center pb-10 px-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Legacy Boards</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group/row"
                  >
                    <td className="py-8 px-6 text-[11px] font-bold text-white uppercase tracking-[0.3em] group-hover/row:text-emerald-400 transition-colors">
                      {item.feature}
                    </td>
                    <td className="py-8 px-6 text-center">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    </td>
                    <td className="py-8 px-6 text-center">
                      {item.others === "LIMITED" ? (
                        <span className="text-[9px] font-black text-orange-500/50 uppercase tracking-widest border border-orange-500/20 px-3 py-1 rounded-full">LIMITED</span>
                      ) : (
                        <XCircle className="w-5 h-5 text-white/10 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-24 text-center"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-6 bg-white text-black px-16 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:bg-emerald-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] group/cta"
            >
              Initialize Deployment
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-2 transition-transform" />
            </Link>
            <p className="mt-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
              Zero-Cost Authorization Required
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DealoAdvantages;

