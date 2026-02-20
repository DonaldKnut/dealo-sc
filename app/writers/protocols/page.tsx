"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield, FileText, Lock, Globe } from "lucide-react";
import Link from "next/link";

export default function WriterProtocolsPage() {
    const protocols = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Operational Integrity",
            content: "Writers must maintain the highest standards of factual accuracy and professional ethics. All intelligence deployed must be verified and cross-referenced with primary sources.",
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Confidentiality Directive",
            content: "Operational secrets, internal workflows, and sensitive data encountered during the content creation process are classified. Disclosure without authorization is strictly prohibited.",
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Intellectual Property Hub",
            content: "Upon transmission, all content becomes the property of the Intelligence Unit. Writers retain credit for their contributions while granting exclusive deployment rights to the collective library.",
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Global Neutrality",
            content: "Content must remain objective and professionally aligned. We aim for universal impact, avoiding regional biases or inflammatory rhetoric that could compromise operational security.",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-hidden flex flex-col p-6 relative">
            {/* ── BACKGROUND ARCHITECTURE ── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-emerald-500/5 blur-[160px] rounded-full animate-pulse" />
                <div className="absolute bottom-[0%] right-[20%] w-[60%] h-[60%] bg-green-500/5 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-125 contrast-150" />
            </div>

            <header className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between mb-16 md:mb-24">
                <Link
                    href="/writers/signup"
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Retreat to Signup
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-8 h-px bg-emerald-500/30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Security Documentation</span>
                </div>
            </header>

            <main className="relative z-10 w-full max-w-4xl mx-auto flex-1">
                <div className="mb-16 md:mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <div className="w-12 h-px bg-emerald-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">Classification: Level-1</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic"
                    >
                        Writer <br />
                        <span className="text-emerald-500">Protocols</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed"
                    >
                        These directives govern the conduct, deployment, and contribution of specialists within the Intelligence Unit.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {protocols.map((protocol, i) => (
                        <motion.div
                            key={protocol.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-px bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors rounded-[2rem]" />
                            <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] p-10 h-full">
                                <div className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform">
                                    {protocol.icon}
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4">{protocol.title}</h3>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                                    {protocol.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            <footer className="relative z-10 w-full max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 italic">
                    Codified for implementation by the Intelligence Collective • 2026
                </p>
            </footer>
        </div>
    );
}
