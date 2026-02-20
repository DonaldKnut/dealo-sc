"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Award,
  Clock,
  Play,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  BarChart3,
} from "lucide-react";

const LMSAdvertisement = () => {
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const lmsFeatures = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Course Management",
      description: "Create, organize, and manage your courses with ease",
      color: "from-blue-500 to-cyan-500",
      benefits: [
        "Drag & drop builder",
        "Content organization",
        "Progress tracking",
      ],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student Management",
      description: "Track student progress and engagement",
      color: "from-green-500 to-emerald-500",
      benefits: [
        "Student analytics",
        "Engagement metrics",
        "Performance reports",
      ],
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certification System",
      description: "Issue certificates and track achievements",
      color: "from-purple-500 to-pink-500",
      benefits: [
        "Auto-generated certificates",
        "Achievement badges",
        "Progress milestones",
      ],
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reporting",
      color: "from-orange-500 to-red-500",
      benefits: ["Revenue tracking", "Student insights", "Course performance"],
    },
  ];

  const courseTypes = [
    {
      name: "Video Courses",
      icon: "🎥",
      count: "5K+",
      description: "High-quality video content",
    },
    {
      name: "Interactive Lessons",
      icon: "🎮",
      count: "2K+",
      description: "Engaging interactive content",
    },
    {
      name: "Live Sessions",
      icon: "📹",
      count: "1K+",
      description: "Real-time learning experiences",
    },
    {
      name: "Assessments",
      icon: "📝",
      count: "3K+",
      description: "Quizzes and evaluations",
    },
  ];

  const successStories = [
    {
      name: "Tech Academy Pro",
      students: "25K+",
      courses: "150+",
      revenue: "₦15M+",
      avatar: "🏫",
      rating: 4.9,
    },
    {
      name: "Design Mastery",
      students: "18K+",
      courses: "85+",
      revenue: "₦12M+",
      avatar: "🎨",
      rating: 4.8,
    },
    {
      name: "Business School",
      students: "32K+",
      courses: "200+",
      revenue: "₦25M+",
      avatar: "💼",
      rating: 4.9,
    },
  ];

  const platformStats = [
    {
      icon: Users,
      value: "100K+",
      label: "Active Students",
      color: "text-blue-400",
    },
    {
      icon: BookOpen,
      value: "5K+",
      label: "Courses Created",
      color: "text-green-400",
    },
    {
      icon: Award,
      value: "50K+",
      label: "Certificates Issued",
      color: "text-purple-400",
    },
    {
      icon: TrendingUp,
      value: "₦100M+",
      label: "Total Revenue",
      color: "text-yellow-400",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Build Your Learning{" "}
            <span className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] bg-clip-text text-transparent">
              Empire
            </span>
          </h2>
          <p className="text-body-large text-gray-300 max-w-3xl mx-auto font-body mb-8">
            Create, manage, and monetize your courses with our comprehensive
            Learning Management System. Everything you need to build a
            successful online education business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/dealoforge")}
              className="flex items-center gap-3 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/dealoforge")}
              className="flex items-center gap-3 border-2 border-[#70f69ae1] text-[#70f69ae1] px-8 py-4 rounded-xl font-semibold hover:bg-[#70f69ae1] hover:text-white transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {lmsFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-[#70f69ae1]/50 transition-all duration-300 group cursor-pointer"
              onClick={() => router.push("/dealoforge")}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-h4 text-white mb-4 font-ui">
                {feature.title}
              </h3>
              <p className="text-body text-gray-400 font-body mb-4">
                {feature.description}
              </p>
              <div className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#70f69ae1]" />
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Course Types */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Content Types Supported
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseTypes.map((type, index) => (
              <motion.div
                key={type.name}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
                onClick={() => router.push("/dealoforge")}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <h4 className="text-white font-semibold mb-2">{type.name}</h4>
                <p className="text-gray-400 text-sm mb-3">{type.description}</p>
                <div className="text-[#70f69ae1] font-semibold text-sm">
                  {type.count} Available
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{story.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{story.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-semibold">
                        {story.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-[#70f69ae1] font-bold text-lg">
                      {story.students}
                    </div>
                    <div className="text-gray-400 text-sm">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#70f69ae1] font-bold text-lg">
                      {story.courses}
                    </div>
                    <div className="text-gray-400 text-sm">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#70f69ae1] font-bold text-lg">
                      {story.revenue}
                    </div>
                    <div className="text-gray-400 text-sm">Revenue</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          className="bg-gradient-to-r from-[#70f69ae1]/10 to-[#5dd885]/10 rounded-3xl p-12 border border-[#70f69ae1]/20 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {platformStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Build Your Learning Platform?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who are already creating, teaching, and
            earning with our LMS platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/dealoforge")}
              className="flex items-center gap-3 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <Globe className="w-5 h-5" />
              Start Your Platform
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/dealoforge")}
              className="flex items-center gap-3 border-2 border-[#70f69ae1] text-[#70f69ae1] px-8 py-4 rounded-xl font-semibold hover:bg-[#70f69ae1] hover:text-white transition-all duration-300"
            >
              <Shield className="w-5 h-5" />
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LMSAdvertisement;

