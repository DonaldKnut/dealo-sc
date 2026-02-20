"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formTheme, formContent } from "./formTheme";

interface EmailSentSuccessProps {
  theme?: typeof formTheme;
  content?: typeof formContent;
}

export default function EmailSentSuccess({ theme = formTheme, content = formContent }: EmailSentSuccessProps) {
  return (
    <div className="relative">
      {/* Glow effect */}
      {theme.glowEffect.enabled && (
        <div
          className={`absolute -inset-1 ${theme.glowEffect.gradient} ${theme.glowEffect.borderRadius} ${theme.glowEffect.blur} ${theme.glowEffect.opacity}`}
        />
      )}

      {/* Main container */}
      <div
        className={`relative ${theme.formContainer.background} ${theme.formContainer.backdropBlur} ${theme.formContainer.borderRadius} ${theme.formContainer.shadow} ${theme.formContainer.border} ${theme.formContainer.padding} text-center overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.05] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 flex items-center justify-center mx-auto mb-10 shadow-2xl relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <Mail className="w-10 h-10 text-emerald-400 relative z-10" />
          </div>
          <h2 className={`text-4xl md:text-5xl font-black ${theme.header.titleGradient} mb-6 tracking-tighter uppercase leading-none`}>
            {content.success.title}
          </h2>
          <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-[10px] max-w-sm mx-auto leading-relaxed mb-12">
            {content.success.message}
          </p>
          <Link
            href="/employment"
            className={`${theme.buttons.primary} px-12 py-5 inline-flex items-center gap-4 group`}
          >
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">{content.success.backButton}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

