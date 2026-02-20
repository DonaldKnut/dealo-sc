"use client";

import { Briefcase } from "lucide-react";
import { formTheme, formContent } from "./formTheme";

interface FormHeaderProps {
  title?: string;
  description?: string;
  isAuthenticated?: boolean;
  theme?: typeof formTheme;
  content?: typeof formContent;
}

export default function FormHeader({
  title,
  description,
  isAuthenticated,
  theme = formTheme,
  content = formContent,
}: FormHeaderProps) {
  const displayTitle = title || content.header.title;
  const displayDescription =
    description ||
    (isAuthenticated
      ? content.header.description.authenticated
      : content.header.description.unauthenticated);

  return (
    <div className="text-center mb-16 relative">
      <div
        className={`inline-flex items-center justify-center ${theme.header.iconSize} ${theme.header.iconBackground} ${theme.header.iconBorder} rounded-2xl mb-8 shadow-2xl relative group-hover:scale-110 transition-transform duration-700`}
      >
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
        <Briefcase className="w-8 h-8 text-emerald-400 relative z-10" />
      </div>
      <h1
        className={`text-4xl md:text-5xl font-black ${theme.header.titleGradient} mb-4 tracking-tighter uppercase leading-none`}
      >
        {displayTitle}
      </h1>
      <p className="text-white/30 font-bold uppercase tracking-[0.25em] text-[10px] max-w-lg mx-auto leading-relaxed">
        {displayDescription}
      </p>
    </div>
  );
}

