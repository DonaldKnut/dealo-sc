"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Gift,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import SectionWrapper from "@/components/layouts/SectionWrapper";
import Link from "next/link";

/**
 * Scratch Cards Landing Page
 * Advanced landing page for scratch cards feature
 */
export default function ScratchCardsLandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Instant Rewards",
      description: "Win prizes immediately when you scratch",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Course Discounts",
      description: "Get up to 50% off on premium courses",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Cash Prizes",
      description: "Win real money and credits",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Easy to Play",
      description: "Simple scratch and win mechanics",
    },
  ];

  const prizes = [
    {
      type: "Course Discount",
      amount: "50% OFF",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      type: "Cash Prize",
      amount: "₦10,000",
      color: "from-green-400 to-green-700",
    },
    {
      type: "Free Course",
      amount: "100% FREE",
      color: "from-lime-400 to-emerald-500",
    },
    {
      type: "Platform Credits",
      amount: "₦5,000",
      color: "from-teal-400 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#022c22] via-[#052e16] to-black">
      {/* Hero Section */}
      <SectionWrapper background="transparent" padding="xl" container={false}>
        <div className="relative min-h-[80vh] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-emerald-300 font-semibold text-lg">
                    Dealo Scratch Cards
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                  Scratch &{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-600 bg-clip-text text-transparent">
                    Win Rewards
                  </span>{" "}
                  on Every Purchase
                </h1>

                <p className="text-xl md:text-2xl text-emerald-100 leading-relaxed">
                  Every course purchase comes with a free scratch card. Win
                  discounts, cash prizes, free courses, and platform credits.
                  The more you learn, the more you win!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/scratch-cards")}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-600 hover:from-emerald-500 hover:via-lime-400 hover:to-emerald-700 text-black rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Scratch Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/courses")}
                    className="px-8 py-4 border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-500/10 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    Browse Courses
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-300" />
                    <span className="text-emerald-100/80">
                      <span className="text-emerald-300 font-bold">10K+</span> Winners
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-emerald-300" />
                    <span className="text-emerald-100/80">
                      <span className="text-emerald-300 font-bold">₦5M+</span> Won
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-300" />
                    <span className="text-emerald-100/80">
                      <span className="text-emerald-300 font-bold">Daily</span> Prizes
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Refactored scratch card illustration */}
                <div className="relative bg-gradient-to-br from-emerald-900 via-[#022c22] to-black rounded-3xl p-8 border border-emerald-500/40 shadow-[0_20px_60px_rgba(16,185,129,0.35)] overflow-hidden">
                  <div className="pointer-events-none absolute -top-24 -right-10 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-24 -left-10 w-64 h-64 rounded-full bg-lime-400/10 blur-3xl" />

                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                        Interactive Scratch Card
                      </p>
                      <p className="text-sm text-emerald-100/80">
                        Reveal guaranteed rewards on every card
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 border border-emerald-400/40">
                      <Zap className="w-4 h-4 text-emerald-300" />
                      <span className="text-xs text-emerald-100/90 font-medium">
                        100% Win Rate
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {prizes.map((prize, index) => (
                      <motion.div
                        key={prize.type}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`relative bg-gradient-to-br ${prize.color} rounded-xl p-5 text-left border border-white/15 shadow-lg shadow-emerald-900/40 overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.3),transparent_55%)] opacity-60" />
                        <div className="relative">
                          <div className="text-xs uppercase tracking-[0.18em] text-emerald-100/90 mb-1">
                            {prize.type}
                          </div>
                          <div className="text-2xl font-black text-white mb-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
                            {prize.amount}
                          </div>
                          <p className="text-[11px] text-emerald-50/90">
                            Auto-applied to your next Dealo purchase.
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 text-xs text-emerald-100/80">
                    <p>Scratch cards refresh with every eligible transaction.</p>
                    <p className="text-emerald-300/90 font-medium">
                      No empty cards. Always win something.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Features Section */}
      <SectionWrapper background="dark" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-600 bg-clip-text text-transparent">
              Scratch Cards
            </span>{" "}
            Work
          </h2>
          <p className="text-xl text-gray-400">
            Simple, fun, and rewarding
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 rounded-2xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto text-yellow-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* How It Works */}
      <SectionWrapper background="transparent" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Get Your{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
              Free Scratch Card
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-300">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Purchase a Course
            </h3>
            <p className="text-emerald-100/80">
              Buy any course and automatically receive a free scratch card
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-300">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Scratch & Win</h3>
            <p className="text-emerald-100/80">
              Scratch your card to reveal your instant reward
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-300">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Claim Your Prize
            </h3>
            <p className="text-emerald-100/80">
              Use your reward immediately - discounts, credits, or cash
            </p>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper background="dark" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-emerald-900 via-[#022c22] to-black rounded-3xl p-12 border border-emerald-500/40 shadow-[0_20px_60px_rgba(16,185,129,0.35)]"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to Scratch & Win?
          </h2>
          <p className="text-xl text-emerald-100/90 mb-8">
            Purchase a course and get your free scratch card today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/courses")}
              className="px-8 py-4 bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-600 hover:from-emerald-500 hover:via-lime-400 hover:to-emerald-700 text-black rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              Browse Courses
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-emerald-500/60 text-emerald-100 hover:border-emerald-400 hover:text-white rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  );
}


