"use client";

import { motion } from "framer-motion";
import { Briefcase, Shield, DollarSign, Users, Clock, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function MarketplacePage() {
  const features = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Find Freelance Work",
      description: "Browse thousands of projects across all categories.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Protected transactions with escrow and milestone payments.",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Fair Pricing",
      description: "Set your rates and compete fairly in the marketplace.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client Matching",
      description: "AI-powered matching connects you with perfect clients.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Project Management",
      description: "Built-in tools to manage projects and deadlines.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Reviews & Ratings",
      description: "Build your reputation through client reviews.",
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Freelance Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with clients, showcase your skills, and grow your freelance career.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Visit Marketplace
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


