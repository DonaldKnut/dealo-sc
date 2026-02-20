"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Palette, Wand2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function GraphicsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-6">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Graphics & Design</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find talented graphic designers and design services
          </p>
        </motion.div>

        <div className="text-center bg-gradient-to-br from-purple-50 to-white rounded-xl p-12 mb-12">
          <Wand2 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">Browse our marketplace for graphics and design services</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Visit Marketplace
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


