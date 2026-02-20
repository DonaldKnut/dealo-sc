"use client";

import React from "react";
import { WifiOff, RefreshCcw, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const ConnectionErrorPage = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[150px] rounded-full delay-700 animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full relative z-10"
            >
                <div className="bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1)] text-center">

                    {/* Icon Section */}
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-black border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-white/10">
                            <WifiOff className="w-12 h-12 text-emerald-400" />
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-2 -right-2 text-red-500"
                        >
                            <ShieldAlert className="w-8 h-8 opacity-50" />
                        </motion.div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent tracking-tight">
                        System Synchronization Interrupted
                    </h1>

                    <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
                        Our neural core is having trouble reaching the database. This is usually a temporary sync issue with the network cluster.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-lg rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            RETRY CONNECTION
                        </button>

                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium rounded-2xl transition-all border border-white/5"
                        >
                            RETURN TO ORBIT (HOME)
                        </Link>
                    </div>

                    {/* Technical Info */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-emerald-500/50" />
                            <span>Network: ECONNREFUSED</span>
                        </div>
                        <div className="hidden md:block w-1 h-1 bg-white/10 rounded-full" />
                        <div className="flex items-center gap-2">
                            <span>Cluster: CLUSTER0.ATLAS</span>
                        </div>
                    </div>
                </div>

                {/* Floating Accents */}
                <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 border-l border-b border-emerald-500/20 rounded-bl-3xl opacity-20" />
                <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 border-r border-t border-emerald-500/20 rounded-tr-3xl opacity-20" />
            </motion.div>
        </div>
    );
};

export default ConnectionErrorPage;
