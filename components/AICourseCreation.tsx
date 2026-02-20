"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  Zap,
  Target,
  Sparkles,
  Video,
  BarChart3,
  CheckCircle,
  Play,
  Cpu,
} from "lucide-react";

/**
 * AICourseCreation - Intelligence Core v2.0. Dark theme, no slider images.
 */
const AICourseCreation = () => {
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Content Generation",
      description: "Transform raw ideas into structured learning paths instantly.",
      benefits: [
        "Auto-generate outlines",
        "Smart content suggestions",
        "SEO optimization",
      ],
      accent: "from-purple-500 to-blue-500",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Interactive Video Creation",
      description: "Produce cinematic lessons with built-in professional tools.",
      benefits: ["Screen recording", "Video editing", "Interactive elements"],
      accent: "from-emerald-400 to-green-500",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Assessment Builder",
      description: "Validate knowledge with AI-driven testing modules.",
      benefits: [
        "Auto-generated questions",
        "Multiple question types",
        "Instant feedback",
      ],
      accent: "from-emerald-500 to-green-600",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Deep-dive into performance data to optimize outcomes.",
      benefits: [
        "Student engagement",
        "Performance metrics",
        "Revenue tracking",
      ],
      accent: "from-green-600 to-emerald-700",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden min-h-[800px] flex items-center bg-black">

      {/* Dark theme background (no slider images) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.04] rounded-full blur-[150px] -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/[0.06] rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.18] brightness-100 contrast-150 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Left: Content and Primary Action */}
          <div className="lg:w-1/2 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md text-emerald-400 text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20"
            >
              <Cpu className="w-3.5 h-3.5" />
              Intelligence Core v2.0
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
                Create Courses <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-300">
                  with AI Power
                </span>
              </h2>
              <p className="text-xl text-white font-medium leading-relaxed max-w-xl drop-shadow-lg">
                Transform your expertise into engaging, high-retention courses with our proprietary AI engine. Build, teach, and earn effortlessly on Nigeria&apos;s most advanced platform.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/dealoforge/create-course")}
                className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/dealoforge")}
                className="px-8 py-5 border border-white/20 backdrop-blur-md text-white rounded-2xl font-bold text-sm hover:bg-white/10 hover:border-emerald-300/50 transition-all flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                </div>
                Watch Demo
              </motion.button>
            </div>
          </div>

          {/* Right: Interactive Feature Grid */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl hover:bg-black/60 hover:border-emerald-500/30 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500 ring-4 ring-white/5`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-black text-white tracking-tight mb-3 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="space-y-3 mt-auto">
                    {feature.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" style={{ transitionDelay: `${bIdx * 50}ms` }}>
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-gray-200 uppercase tracking-wide">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 group-hover:rotate-45 transition-all">
                  <Sparkles className="w-8 h-8 text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AICourseCreation;
