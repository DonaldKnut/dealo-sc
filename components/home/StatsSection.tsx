"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import SectionWrapper from "@/components/layouts/SectionWrapper";

interface Stat {
  number: string;
  label: string;
  icon: ReactNode;
}

interface StatsSectionProps {
  stats: Stat[];
  title?: string | ReactNode;
  subtitle?: string;
  background?: "default" | "dark" | "gradient" | "transparent";
  columns?: 2 | 3 | 4;
}

/**
 * StatsSection - Reusable statistics display component
 * Displays stats in a responsive grid with animations
 */
export default function StatsSection({
  stats,
  title,
  subtitle,
  background = "dark",
  columns = 4,
}: StatsSectionProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  const isDark = background === "dark" || background === "gradient";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const subtextColor = isDark ? "text-gray-400" : "text-gray-600";
  const titleColor = isDark ? "text-white" : "text-gray-900";

  return (
    <SectionWrapper background={background} padding="lg">
      {(title || subtitle) && (
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {title && (
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black ${titleColor} mb-6 leading-tight tracking-tight`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={`text-xl ${subtextColor}`}>{subtitle}</p>
          )}
        </motion.div>
      )}

      <div className={`grid ${gridCols[columns]} gap-8`}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className={`w-16 h-16 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} rounded-2xl flex items-center justify-center mx-auto mb-4 border ${isDark ? 'border-emerald-500/20' : 'border-emerald-200'}`}>
              <div className="text-emerald-500">{stat.icon}</div>
            </div>
            <div className={`text-3xl md:text-4xl font-black ${textColor} mb-2`}>
              {stat.number}
            </div>
            <p className={`${subtextColor} font-medium uppercase text-xs tracking-widest`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
