"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CTA = {
  label: string;
  href: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

type Stat = {
  label: string;
  value: string;
  sublabel?: string;
};

interface MarketingPageLayoutProps {
  hero: {
    eyebrow?: string;
    title: string;
    description: string;
    primaryCta: CTA;
    secondaryCta?: CTA;
    figure?: ReactNode;
    stats?: Stat[];
  };
  backgroundClassName?: string;
  children?: ReactNode;
  sidebar?: ReactNode;
  badges?: ReactNode;
}

const ctaClasses: Record<NonNullable<CTA["variant"]>, string> = {
  primary:
    "bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-green-500/20",
  secondary:
    "bg-transparent text-white border border-white/30 hover:border-white hover:text-white",
  ghost:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur",
};

export function MarketingPageLayout({
  hero,
  children,
  sidebar,
  badges,
  backgroundClassName = "bg-black",
}: MarketingPageLayoutProps) {
  const {
    eyebrow,
    title,
    description,
    primaryCta,
    secondaryCta,
    figure,
    stats,
  } = hero;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden text-white",
        backgroundClassName
      )}
    >
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-green-500/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 lg:flex-row lg:gap-20">
        <div className="relative z-10 flex-1 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {eyebrow && (
              <span className="inline-flex items-center rounded-full border border-green-400/40 bg-green-400/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-green-100">
                {eyebrow}
              </span>
            )}

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-lg text-gray-200">{description}</p>
            </div>

            {badges && <div className="flex flex-wrap gap-3">{badges}</div>}

            <div className="flex flex-wrap gap-4">
              <MarketingCTA {...primaryCta} variant={primaryCta.variant || "primary"} />
              {secondaryCta && (
                <MarketingCTA
                  {...secondaryCta}
                  variant={secondaryCta.variant || "secondary"}
                />
              )}
            </div>
          </motion.div>

          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <p className="text-3xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm uppercase tracking-wide text-gray-300">
                      {stat.label}
                    </p>
                    {stat.sublabel && (
                      <p className="text-xs text-gray-400">{stat.sublabel}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {figure && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-1 items-center justify-center"
          >
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500 via-transparent to-purple-500 opacity-30 blur-3xl" />
              <div className="relative rounded-3xl border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur">
                {figure}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 lg:flex-row lg:gap-20">
          {sidebar && (
            <aside className="w-full max-w-xs space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              {sidebar}
            </aside>
          )}
          <div className="flex-1 space-y-12">{children}</div>
        </div>
      </div>
    </section>
  );
}

function MarketingCTA({
  label,
  href,
  onClick,
  variant = "primary",
}: CTA & { variant: NonNullable<CTA["variant"]> }) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-full px-6 py-3 text-sm font-semibold transition",
          ctaClasses[variant]
        )}
      >
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        "rounded-full px-6 py-3 text-sm font-semibold transition",
        ctaClasses[variant]
      )}
    >
      {label}
    </a>
  );
}


