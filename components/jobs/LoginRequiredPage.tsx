"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Users,
  TrendingUp,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Target,
  Zap,
  Award,
  Globe,
} from "lucide-react";

const LoginRequiredPage = () => {
  const router = useRouter();

  const benefits = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Post Jobs Instantly",
      description: "Create and publish job listings in minutes",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Reach Top Talent",
      description: "Access 50,000+ active professionals",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Applications",
      description: "Manage candidates and applications easily",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Platform",
      description: "All candidates are verified professionals",
    },
  ];

  const features = [
    {
      icon: <Target className="w-5 h-5" />,
      text: "AI-powered candidate matching",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Quick application review process",
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "Access to certified professionals",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      text: "Global talent pool",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full"
                >
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300 font-medium">
                    Join Thousands of Employers
                  </span>
                </motion.div>

                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Start Hiring{" "}
                  <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    Top Talent
                  </span>{" "}
                  Today
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Sign in to post job listings and connect with qualified professionals
                  from around the world.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-3 text-white">
                      {benefit.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-1 text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-xs">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="space-y-3"
              >
                <p className="text-gray-300 font-medium">What you get:</p>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Sign In to Post Jobs
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all backdrop-blur-xl"
                >
                  Create Account
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Main Illustration Container */}
              <div className="relative">
                {/* Decorative Background Circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl"></div>

                {/* Illustration Card */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                  {/* Illustration Placeholder - You can replace with actual illustration */}
                  <div className="space-y-6">
                    {/* Top Section - Building/Company Icon */}
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                        <Building2 className="w-16 h-16 text-green-400" />
                      </div>
                    </div>

                    {/* Middle Section - Job Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((item) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 1 + item * 0.1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 2,
                          }}
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                        >
                          <div className="w-full h-16 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-lg mb-2"></div>
                          <div className="h-2 bg-white/20 rounded w-3/4 mb-1"></div>
                          <div className="h-2 bg-white/10 rounded w-1/2"></div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom Section - Stats */}
                    <div className="flex items-center justify-around pt-4 border-t border-white/10">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">50K+</div>
                        <div className="text-xs text-gray-400">Active Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">12K+</div>
                        <div className="text-xs text-gray-400">Job Listings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">95%</div>
                        <div className="text-xs text-gray-400">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-r from-green-500/30 to-green-600/30 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-green-500/30 shadow-xl"
                >
                  <Briefcase className="w-10 h-10 text-green-400" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center backdrop-blur-xl border border-blue-500/30 shadow-xl"
                >
                  <Users className="w-8 h-8 text-blue-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Advert Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-20 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-green-500/20 rounded-3xl p-8 lg:p-12"
          >
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Join Nigeria's Leading Job Platform
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  Post jobs for free and connect with top talent. No credit card required.
                  Start hiring today!
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm text-gray-300">Free to post jobs</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm text-gray-300">AI-powered matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm text-gray-300">Verified candidates</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredPage;



