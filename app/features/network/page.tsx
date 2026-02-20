"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Search, Globe, Handshake, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NetworkPage() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Professional Directory",
      description: "Connect with professionals in your industry.",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Direct Messaging",
      description: "Communicate directly with your network.",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Advanced Search",
      description: "Find professionals by skills, location, and more.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Connect with professionals worldwide.",
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Mentorship",
      description: "Find mentors and mentees in your field.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Career Opportunities",
      description: "Discover job openings and collaborations.",
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Professional Network</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build meaningful professional connections and grow your career network.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-purple-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/search/professionals"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Explore Network
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


