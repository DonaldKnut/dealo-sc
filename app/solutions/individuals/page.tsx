"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award,
  Briefcase,
  BookOpen,
  Zap,
  Target,
  TrendingUp,
  Globe,
} from "lucide-react";
import Link from "next/link"

;

const IndividualsPage = () => {
  const travelVideoAdvert =
    "https://res.cloudinary.com/dyaetoldv/video/upload/v1724841886/fk9nebssz8bvgfkjbrat.mp4";

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description:
        "Personalized learning paths that adapt to your pace and style",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Industry Certifications",
      description:
        "Earn recognized certifications that boost your career prospects",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Professional Network",
      description:
        "Connect with industry experts and like-minded professionals",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Freelance Opportunities",
      description: "Find high-paying projects and build your portfolio",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Skill Development",
      description: "Master in-demand skills with hands-on projects",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Career Guidance",
      description: "Get personalized career advice and mentorship",
      color: "from-indigo-500 to-blue-600",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Active Learners",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "200+",
      label: "Expert Courses",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    { number: "150+", label: "Countries", icon: <Globe className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        src={travelVideoAdvert}
        autoPlay
        muted
        loop
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-10"></div>

      {/* Content */}
      <div className="relative z-20">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Transform Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 block">
                  Career Today
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Join thousands of professionals who are advancing their careers
                with AI-powered learning, industry certifications, and a global
                network of experts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/sign-in"
                className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center gap-2 group shadow-2xl hover:shadow-green-500/25"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/courses"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Explore Courses
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300">
                    <div className="text-green-400 mb-3 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Everything You Need to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  {" "}
                  Succeed
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our comprehensive platform combines cutting-edge technology with
                proven learning methodologies to accelerate your career growth.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all duration-300 h-full">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-3xl p-12 border border-green-500/30"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who are already advancing their
                careers with Dealo. Start your journey today and unlock your
                full potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 group shadow-2xl hover:shadow-green-500/25"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/courses"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Browse Courses
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IndividualsPage;
