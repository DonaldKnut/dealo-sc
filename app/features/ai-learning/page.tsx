"use client";

import { motion } from "framer-motion";
import { Sparkles, BookOpen, Brain, Zap, Target, TrendingUp, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AILearningPage() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Content Generation",
      description: "Generate personalized learning content tailored to your skill level and goals.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Learning Paths",
      description: "AI recommends the optimal learning sequence based on your progress.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Adaptive Assessments",
      description: "Get real-time feedback and adaptive quizzes that adjust to your performance.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Analytics",
      description: "Track your learning journey with detailed analytics and insights.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Certification Support",
      description: "Prepare for industry-recognized certifications with AI-guided practice.",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "24/7 AI Tutor",
      description: "Get instant answers and explanations from our AI tutor anytime.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">AI Learning Platform</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of education with AI-powered personalized learning that adapts to your pace and style.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-green-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/certifications/explore"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Explore AI Courses
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


