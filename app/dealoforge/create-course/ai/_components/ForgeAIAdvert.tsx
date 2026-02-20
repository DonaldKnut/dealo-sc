"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Target, Globe, ArrowRight, Sparkles } from "lucide-react";

const ForgeAIAdvert = () => {
    const highlights = [
        {
            icon: <Zap className="w-5 h-5 text-emerald-400" />,
            title: "3x Faster Deployment",
            desc: "Go from concept to curriculum in minutes, not weeks."
        },
        {
            icon: <Target className="w-5 h-5 text-emerald-400" />,
            title: "Precision Engineering",
            desc: "AI-optimized modules tailored for maximum retention."
        },
        {
            icon: <Globe className="w-5 h-5 text-emerald-400" />,
            title: "Global Scalability",
            desc: "Built to support and reach 50k+ active learners."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 relative group"
        >
            {/* Cinematic Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-green-500/10 to-emerald-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 lg:p-16 overflow-hidden shadow-3xl">
                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />

                <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Heading */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            The Forge Advantage
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter">
                            Forge the Future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">
                                Digital Excellence
                            </span>
                        </h2>
                        <p className="text-lg text-white/40 font-medium max-w-xl leading-relaxed">
                            Our proprietary AI engine doesn&apos;t just generate text—it architects immersive learning experiences that set the industry standard.
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400 backdrop-blur-sm">
                                        AI
                                    </div>
                                ))}
                            </div>
                            <div className="text-white/20 text-xs font-bold uppercase tracking-widest">
                                Powered by Advanced LLM Nodes
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Highlights */}
                    <div className="lg:col-span-5 space-y-6">
                        {highlights.map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 10 }}
                                className="flex items-start gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                    <p className="text-white/30 text-xs font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar: Action/Callout */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <span className="text-white/60 font-bold text-sm tracking-tight">Ready to transcend traditional teaching?</span>
                    </div>

                    <div className="flex items-center gap-2 group/btn cursor-pointer">
                        <span className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em] group-hover/btn:mr-2 transition-all">Explore Documentation</span>
                        <ArrowRight className="w-4 h-4 text-emerald-500 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

            {/* Extreme Decorative Orb */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-1000" />
        </motion.div>
    );
};

export default ForgeAIAdvert;
