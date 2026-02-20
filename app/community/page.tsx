"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Calendar, Trophy } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function CommunityPage() {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Discussion Forums",
      description: "Join conversations and get help from community members.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Study Groups",
      description: "Form study groups and learn together.",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Events",
      description: "Attend virtual and in-person events.",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Challenges",
      description: "Participate in coding and skill challenges.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Community</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect, learn, and grow with professionals from around the world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl border border-indigo-200"
            >
              <div className="text-indigo-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center bg-gray-50 rounded-xl p-8">
          <p className="text-gray-600 mb-4">Community features coming soon!</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Visit Blog
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


