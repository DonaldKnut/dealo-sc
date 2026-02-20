"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ShoppingBag, Home } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "payment";

  const successMessages: Record<string, { title: string; description: string }> = {
    payment: {
      title: "Payment Successful!",
      description: "Thank you for your purchase. Your transaction has been processed successfully.",
    },
    application: {
      title: "Application Submitted!",
      description: "Your application has been received. We'll review it and get back to you soon.",
    },
    registration: {
      title: "Registration Complete!",
      description: "Welcome to Dealo! Your account has been created successfully.",
    },
    contact: {
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you as soon as possible.",
    },
  };

  const message = successMessages[type] || successMessages.payment;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              {message.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8"
            >
              {message.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Go Home</span>
              </Link>
              {type === "payment" && (
                <Link
                  href="/marketplace"
                  className="flex-1 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Continue Shopping</span>
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
