"use client";

import { motion } from "framer-motion";
import { BookOpen, Code, Terminal, Key, Webhook, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarketingPageLayout } from "@/components/layouts/MarketingPageLayout";

const sections = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Getting Started",
    description: "Provision keys, choose an environment, send your first request.",
    href: "/docs/getting-started",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "API Reference",
    description: "Endpoints, schemas, and error codes generated from swagger.json.",
    href: "/docs/api",
  },
  {
    icon: <Terminal className="w-6 h-6" />,
    title: "SDKs",
    description: "Install Dealo SDKs for Node, Python, and Kotlin.",
    href: "/docs/sdks",
  },
  {
    icon: <Webhook className="w-6 h-6" />,
    title: "Webhooks",
    description: "Receive job events, payouts, and verification updates in real time.",
    href: "/docs/webhooks",
  },
  {
    icon: <Key className="w-6 h-6" />,
    title: "Authentication",
    description: "API keys, OAuth flows, rotating secrets, and SSO posture.",
    href: "/docs/auth",
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-24">
      {/* ── HERO SECTION ── */}
      <section className="relative">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Developer Hub
              </span>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-white">
                  INTEGRATE IN <br />
                  <span className="text-emerald-500">HOURS, NOT WEEKS.</span>
                </h1>
                <p className="max-w-xl text-lg font-medium text-white/40 leading-relaxed">
                  Automate bulk hiring, credential sharing, payouts, and verification flows with our GraphQL-ready REST API and SDK suite.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/docs/api" className="px-8 py-3.5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-white/5">
                  View API Reference
                </Link>
                <Link href="/dashboard" className="px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Generate API Keys
                </Link>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                { label: "Requests / month", value: "1B+", sublabel: "Across hiring & learning" },
                { label: "Avg. latency", value: "180ms", sublabel: "Global edge network" },
              ].map((stat) => (
                <div key={stat.label} className="p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-inner">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mt-1">{stat.label}</p>
                  <p className="text-[10px] text-white/20 font-bold mt-1">{stat.sublabel}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Code Figure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full group-hover:bg-emerald-500/30 transition-all" />
              <div className="relative space-y-6 font-mono text-sm">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Sample request</p>
                  <pre className="overflow-x-auto rounded-3xl bg-black/80 border border-white/5 p-6 shadow-2xl text-emerald-400">
                    {`curl https://api.dealo.africa/v1/hiring/jobs \\
  -H "Authorization: Bearer <token>" \\
  -d '{ "title": "AI Tutor", "location": "Remote" }'`}
                  </pre>
                </div>
                <div className="space-y-3 translate-x-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Response</p>
                  <pre className="overflow-x-auto rounded-3xl bg-black/80 border border-white/5 p-6 shadow-2xl text-blue-400">
                    {`{
  "id": "job_9sd902",
  "status": "draft",
  "analytics": { "matches": 128 }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section>
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Core Resources</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {sections.map((section, index) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative flex flex-col rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/[0.04] cursor-pointer"
              onClick={() => window.location.href = section.href}
            >
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                {section.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">
                {section.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/40 group-hover:text-white/60 transition-colors">
                {section.description}
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                Open Guide <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}


