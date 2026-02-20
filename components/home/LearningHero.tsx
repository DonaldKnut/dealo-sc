"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/hooks/use-safe-session";
import {
  GraduationCap,
  Award,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Play,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

/**
 * LearningHero - Focused hero section for Learning + Certifications
 * Core message: "Learn skills, get certified, land jobs in Nigeria"
 */
export default function LearningHero() {
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const user = sessionData?.user;

  const benefits = [
    "AI-Powered Learning Paths",
    "Industry-Recognized Certifications",
    "Job Placement Support",
    "Nigerian Market Focus",
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center"
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-green-300 font-semibold text-lg">
                Dealo Learning Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              Learn Skills,{" "}
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Get Certified
              </span>
              ,{" "}
              <br />
              Land Jobs in{" "}
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Nigeria
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Nigeria&apos;s premier platform for online learning, AI-powered
              certifications, and career growth. Master in-demand skills and get
              industry-recognized credentials that employers trust.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/courses")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Learning Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/certifications/explore")}
                className="px-8 py-4 border-2 border-green-500 text-green-400 hover:bg-green-500/10 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5" />
                View Certifications
              </motion.button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">
                  <span className="text-white font-bold">50K+</span> Students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">
                  <span className="text-white font-bold">10K+</span> Certifications
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">
                  <span className="text-white font-bold">95%</span> Success Rate
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Learning Journey Visual */}
            <div className="relative bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 rounded-3xl p-8 border border-green-400/30 shadow-2xl">
              {/* Journey Steps */}
              <div className="space-y-6">
                {/* Step 1: Learn */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-4 p-4 bg-green-500/10 rounded-xl border border-green-400/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      Step 1: Learn
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Access 10,000+ courses in programming, marketing, business,
                      and more
                    </p>
                  </div>
                </motion.div>

                {/* Step 2: Get Certified */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-4 p-4 bg-green-500/10 rounded-xl border border-green-400/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      Step 2: Get Certified
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Pass AI-powered assessments and earn industry-recognized
                      certifications
                    </p>
                  </div>
                </motion.div>

                {/* Step 3: Land Jobs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-4 p-4 bg-green-500/10 rounded-xl border border-green-400/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      Step 3: Land Jobs
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Get matched with employers looking for certified
                      professionals
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* CTA Arrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center mt-6"
              >
                <ArrowRight className="w-8 h-8 text-green-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


