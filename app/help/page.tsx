"use client";

import { motion } from "framer-motion";
import { HelpCircle, Search, BookOpen, MessageCircle, Mail, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function HelpPage() {
  const categories = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Getting Started",
      questions: [
        "How do I create an account?",
        "How do I complete my profile?",
        "How do I start learning?",
      ],
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Account & Settings",
      questions: [
        "How do I change my password?",
        "How do I update my profile?",
        "How do I manage notifications?",
      ],
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Payments & Billing",
      questions: [
        "How do I pay for courses?",
        "What payment methods are accepted?",
        "How do I get a refund?",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">Find answers to common questions</p>
        </motion.div>

        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="flex-1 outline-none bg-transparent text-gray-700"
            />
          </div>
        </div>

        <div className="space-y-8 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4 text-green-600">
                {category.icon}
                <h2 className="text-xl font-semibold">{category.title}</h2>
              </div>
              <ul className="space-y-2">
                {category.questions.map((question, qIndex) => (
                  <li key={qIndex}>
                    <button className="text-gray-700 hover:text-green-600 transition-colors text-left w-full">
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Still need help?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


