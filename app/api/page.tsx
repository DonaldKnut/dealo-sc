"use client";

import { motion } from "framer-motion";
import { Code, Key, Webhook, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function APIPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6">
            <Code className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate with our platform using our REST API.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 p-8 rounded-xl border border-blue-200">
            <Key className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication</h3>
            <p className="text-gray-600 mb-4">Learn how to authenticate API requests.</p>
            <Link href="/docs" className="text-blue-600 hover:text-blue-700 font-medium">
              View Docs →
            </Link>
          </div>
          <div className="bg-blue-50 p-8 rounded-xl border border-blue-200">
            <Webhook className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Webhooks</h3>
            <p className="text-gray-600 mb-4">Set up webhook integrations.</p>
            <Link href="/docs" className="text-blue-600 hover:text-blue-700 font-medium">
              View Docs →
            </Link>
          </div>
        </div>

        <div className="text-center bg-gray-50 rounded-xl p-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">For complete API documentation, visit our docs.</p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            View Documentation
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


