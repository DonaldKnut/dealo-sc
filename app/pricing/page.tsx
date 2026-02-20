"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Star, Zap, Crown, Rocket, Shield, Users, ArrowRight,
  Sparkles, Globe, BarChart3, Headphones, Lock, CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Rocket,
    monthlyPrice: 12,
    annualPrice: 9,
    tagline: "Perfect for solo professionals",
    color: "from-blue-500 to-blue-600",
    glowColor: "blue-500",
    features: [
      "50+ premium courses",
      "Basic certifications",
      "Community access",
      "Email support",
      "1 active service listing",
      "Standard profile badge",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    icon: Crown,
    monthlyPrice: 39,
    annualPrice: 29,
    tagline: "For serious freelancers & creators",
    color: "from-emerald-500 to-green-600",
    glowColor: "emerald-500",
    features: [
      "Unlimited courses",
      "Premium certifications",
      "1-on-1 mentoring sessions",
      "Job placement assistance",
      "Priority support",
      "10 active service listings",
      "Verified Pro badge",
      "Advanced analytics",
    ],
    popular: true,
    cta: "Go Professional",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Users,
    monthlyPrice: 129,
    annualPrice: 99,
    tagline: "For teams & growing businesses",
    color: "from-violet-500 to-purple-600",
    glowColor: "violet-500",
    features: [
      "Team management dashboard",
      "Custom content creation",
      "Full API access",
      "White-label options",
      "Dedicated account manager",
      "Unlimited service listings",
      "Enterprise security & compliance",
      "Custom integrations",
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

const FAQS = [
  { q: "Can I switch plans at any time?", a: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated." },
  { q: "Is there a free trial?", a: "Every plan comes with a 14-day free trial. No credit card required to start." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, bank transfers, and mobile money (M-Pesa, Flutterwave, Paystack)." },
  { q: "Can I cancel anytime?", a: "Absolutely. Cancel anytime with no penalties. Your access continues until the end of your billing period." },
];

const TRUST_ITEMS = [
  { icon: Shield, label: "Bank-grade Security" },
  { icon: Globe, label: "120+ Countries" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: Lock, label: "SOC 2 Compliant" },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* ─────────────────────────────────────────────────────────
          HERO SECTION — CINEMATIC DEPTH
      ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20 px-6">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-green-500/5 blur-[150px] rounded-full"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20 mb-10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Next-Gen Billing Infrastructure</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase"
          >
            Invest in your<br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-green-500 animate-gradient-x py-2">
              Future Today
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed"
          >
            Simple, transparent architecture for creators and enterprises. Zero hidden fees. Infinite possibilities.
          </motion.p>

          {/* Premium Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative inline-flex p-1.5 bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-2xl"
          >
            <div className="relative flex items-center">
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className="absolute h-full bg-emerald-500 rounded-[1.75rem]"
                style={{
                  width: "50%",
                  left: isAnnual ? "50%" : "0%",
                }}
              />
              <button
                onClick={() => setIsAnnual(false)}
                className={`relative z-10 px-8 py-3.5 text-sm font-black uppercase tracking-widest transition-colors duration-500 ${!isAnnual ? "text-black" : "text-gray-500"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`relative z-10 px-8 py-3.5 pr-20 text-sm font-black uppercase tracking-widest transition-colors duration-500 ${isAnnual ? "text-black" : "text-gray-500"}`}
              >
                Annual
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black px-2 py-1 rounded-full border ${isAnnual ? "bg-black/20 border-black/10" : "bg-emerald-500/20 border-emerald-500/20 text-emerald-400"}`}>
                  -25%
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Background Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -100] }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
              className="absolute w-1 h-1 bg-emerald-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          PRICING CARDS — PREMIUM GLASS
      ───────────────────────────────────────────────────────── */}
      <section className="pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex flex-col ${plan.popular ? "md:-mt-8 md:mb-8" : ""}`}
              >
                {/* Popular Highlight Effect */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full opacity-50 pointer-events-none" />
                )}

                <div className={`flex flex-col h-full bg-white/[0.02] backdrop-blur-3xl border ${plan.popular ? "border-emerald-500/40" : "border-white/10"} rounded-[3rem] p-10 hover:border-emerald-500/30 transition-all duration-700 relative overflow-hidden`}>

                  {/* Internal Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Header */}
                  <div className="relative z-10 mb-12">
                    <div className="flex justify-between items-start mb-8">
                      <div className={`w-16 h-16 rounded-[1.75rem] bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500`}>
                        <plan.icon className="w-8 h-8 text-white" />
                      </div>
                      {plan.popular && (
                        <div className="px-4 py-1.5 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                          Signature
                        </div>
                      )}
                    </div>
                    <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">{plan.name}</h3>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">{plan.tagline}</p>
                  </div>

                  {/* Pricing Display */}
                  <div className="relative z-10 mb-12">
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        key={isAnnual ? "a" : "m"}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-6xl font-black tracking-tighter"
                      >
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </motion.span>
                      <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">/ Month</span>
                    </div>
                    <AnimatePresence>
                      {isAnnual && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.2em] mt-3"
                        >
                          Billed Annually · Save ${(plan.monthlyPrice - plan.annualPrice) * 12} / Year
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Feature List */}
                  <div className="relative z-10 mb-12 flex-grow">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Key Capabilities</p>
                    <ul className="space-y-4">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-4 group/item">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:border-emerald-500/30 transition-colors">
                            <Check className="w-3 h-3 text-emerald-500" />
                          </div>
                          <span className="text-gray-400 text-sm font-medium group-hover/item:text-white transition-colors">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Area */}
                  <div className="relative z-10">
                    <Link
                      href={plan.id === "enterprise" ? "/contact" : "/sign-in"}
                      className={`w-full py-6 px-10 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-3 group/btn ${plan.popular
                        ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-2xl shadow-emerald-500/20"
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                        }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TRUST STRIP — MINIMALIST
      ───────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 py-12 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-16">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 group cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center group-hover:border-emerald-500/30 transition-all">
                <item.icon className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-400" />
              </div>
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          COMPARISON TABLE — GLASS ARCHITECTURE
      ───────────────────────────────────────────────────────── */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
              Compare <span className="text-emerald-500">Stacks</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium">Granular breakdown of our infrastructure capabilities.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-0 border-b border-white/10 bg-white/[0.02]">
              <div className="p-10 col-span-1" />
              {PLANS.map((plan) => (
                <div key={plan.id} className={`p-10 text-center border-l border-white/10 ${plan.popular ? "bg-emerald-500/[0.03]" : ""}`}>
                  <p className="font-black text-white text-xs uppercase tracking-widest">{plan.name}</p>
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {[
              { feature: "Service Listings", values: ["1", "10", "Unlimited"] },
              { feature: "Courses Access", values: ["50+", "Unlimited", "Unlimited"] },
              { feature: "Certifications", values: ["Basic", "Premium", "Custom"] },
              { feature: "Mentoring", values: [false, true, true] },
              { feature: "Analytics", values: ["Basic", "Advanced", "Custom"] },
              { feature: "API Access", values: [false, false, true] },
              { feature: "White-label", values: [false, false, true] },
              { feature: "Support", values: ["Email", "Priority", "Dedicated"] },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-4 gap-0 group/row border-b border-white/5 last:border-0 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                <div className="p-8 col-span-1 flex items-center">
                  <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest group-hover/row:text-white transition-colors">{row.feature}</span>
                </div>
                {row.values.map((val, j) => (
                  <div key={j} className={`p-8 text-center border-l border-white/5 flex items-center justify-center ${PLANS[j].popular ? "bg-emerald-500/[0.02]" : ""}`}>
                    {typeof val === "boolean" ? (
                      val ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shadow-glow" />
                      ) : (
                        <div className="w-5 h-px bg-white/10 rounded-full" />
                      )
                    ) : (
                      <span className="text-white text-xs font-black uppercase tracking-tight">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FAQ SECTION — ACCORDION FLOW
      ───────────────────────────────────────────────────────── */}
      <section className="py-40 px-6 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20 text-balance">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
              Common <span className="text-emerald-500">Queries</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left"
                >
                  <span className="font-black text-white text-sm uppercase tracking-widest leading-relaxed">{faq.q}</span>
                  <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${openFaq === i ? "bg-emerald-500 border-emerald-500 text-black rotate-45" : "bg-white/5 text-emerald-500 group-hover:border-emerald-500/50"}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-8 pb-8 pt-2">
                        <div className="h-px w-full bg-white/5 mb-6" />
                        <p className="text-gray-400 text-lg font-medium leading-relaxed italic">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FINAL CTA — IMMERSIVE
      ───────────────────────────────────────────────────────── */}
      <section className="py-48 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/10 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] uppercase">
              Ready to <br />
              <span className="text-emerald-500">Scale Up?</span>
            </h2>
            <p className="text-gray-400 text-xl md:text-2xl font-medium mb-20 max-w-2xl mx-auto leading-relaxed">
              Join 28,000+ professionals building their legacy on the world's most advanced workforce platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link
                href="/sign-in"
                className="group px-20 py-7 bg-emerald-500 text-black font-black uppercase tracking-[0.25em] text-[11px] rounded-[2.5rem] hover:bg-emerald-400 hover:scale-105 transition-all duration-500 shadow-2xl shadow-emerald-500/20 flex items-center gap-4"
              >
                Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-16 py-7 bg-white/10 border border-white/20 text-white font-black uppercase tracking-[0.25em] text-[11px] rounded-[2.5rem] hover:bg-white/20 hover:border-white/30 transition-all duration-500">
                Contact Strategy
              </button>
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-16">No credit card required · Cancel anytime</p>
          </motion.div>
        </div>
      </section>


      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .shadow-glow {
          filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.5));
        }
      `}</style>
    </div>
  );
}
