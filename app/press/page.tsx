"use client";

import { motion } from "framer-motion";
import { FileText, Mail, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Press Kit</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Resources for media and journalists.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h3>
            <p className="text-gray-600 mb-4">
              Dealo is an AI-powered professional development platform based in Lagos, Nigeria.
            </p>
            <p className="text-gray-600">
              For media inquiries, please contact us at press@dealo.africa
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Press Releases</h3>
            <p className="text-gray-600">No press releases available at this time.</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Press Team
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


