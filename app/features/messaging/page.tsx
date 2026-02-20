"use client";

import { motion } from "framer-motion";
import { MessageSquare, Video, Phone, Mail, Bell, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function MessagingPage() {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Instant messaging with your network and clients.",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Calls",
      description: "HD video calls for meetings and interviews.",
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Voice Calls",
      description: "Crystal clear voice communication.",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Integration",
      description: "Seamlessly connect with your email.",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notifications",
      description: "Stay updated with smart notifications.",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure & Private",
      description: "End-to-end encryption for all conversations.",
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl mb-6">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Messaging Platform</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Communicate seamlessly with messaging, video calls, and more.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-xl border border-teal-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-teal-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/messenger"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-medium transition-colors"
          >
            Open Messenger
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}


