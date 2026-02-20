"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  DollarSign,
  Users,
  Award,
  TrendingUp,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Briefcase,
  ChevronRight,
} from "lucide-react";

import { useSession } from "next-auth/react";

/**
 * InstructorSection - Redesigned with a high-impact dark emerald aesthetic.
 * Focuses on professional credibility and clear conversion paths.
 */
const InstructorSection = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Optimized Revenue Share",
      description: "Keep 70% of every sale with instant payout options.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Global Audience Access",
      description: "Instantly connect with over 50k learners in Nigeria.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "AI-Powered Courseware",
      description: "Build curricula 3x faster with integrated LLM tools.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Deep insights into student behavior and ROI.",
    },
  ];

  const processSteps = [
    {
      id: "01",
      title: "Curate",
      desc: "Define your niche and objectives.",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: "02",
      title: "Generate",
      desc: "Use AI to build structured modules.",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "03",
      title: "Publish",
      desc: "Launch to a hungry marketplace.",
      icon: <ArrowRight className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-black via-[#0f1a0f] to-black relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_50%)]" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left Side: Value Proposition */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Elite Instructor Program
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                Lead the Next Group of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">
                  Global Professionals
                </span>
              </h2>
              <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-xl">
                Monetize your expertise by creating standardized, high-impact curricula. Join a network of industry leaders setting the pace for Nigeria&apos;s digital economy.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="space-y-3 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <h4 className="text-white font-bold text-lg">{benefit.title}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/instructor/apply")}
                className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
              >
                {session ? "Instructor Dashboard" : "Apply for Elite Access"}
              </motion.button>
              <button
                onClick={() => router.push("/instructor/guide")}
                className="px-8 py-5 text-gray-400 hover:text-white font-bold text-sm tracking-wide transition-colors flex items-center gap-2"
              >
                View Instructor Guide
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side: Credibility & Process */}
          <div className="relative">
            <div className="absolute -inset-10 bg-emerald-500/5 blur-[80px] rounded-full" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 space-y-12 shadow-2xl"
            >
              {/* Process Steps */}
              <div className="space-y-8">
                <h4 className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">Path to Revenue</h4>
                <div className="space-y-6">
                  {processSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-6 group">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-500 font-black text-[10px]">{step.id}</span>
                          <h5 className="text-white font-bold">{step.title}</h5>
                        </div>
                        <p className="text-gray-500 text-xs font-medium">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proof Section */}
              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800" />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 italic text-gray-400 text-sm leading-relaxed">
                  "I earned ₦2.5M in my first year teaching high-end development. The AI tools helped me curate world-class content 3x faster."
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-white font-bold block">Ngozi Okonkwo</span>
                    <span className="text-gray-500 text-xs font-medium">Standardized Curricula Expert</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Final Integrated CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-32 p-16 rounded-[4rem] relative overflow-hidden group shadow-3xl shadow-emerald-900/40"
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url("/Handsome young african man using lap.jpg")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-emerald-900/90" />

          <div className="relative z-10 text-center space-y-8">
            <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Ready to Build Your <br /> Digital Legacy?
            </h3>
            <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto">
              Open your classroom to 50,000+ hungry learners. Start creating today and earn at the scale you deserve.
            </p>
            <div className="flex justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/instructor/apply")}
                className="px-12 py-5 bg-white text-emerald-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-gray-50 transition-all"
              >
                {session ? "Go to Dashboard" : "Claim My Account"}
              </motion.button>
            </div>
          </div>

          {/* Animated decorative orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl opacity-20" />
        </motion.div>

      </div>
    </section>
  );
};

export default InstructorSection;
