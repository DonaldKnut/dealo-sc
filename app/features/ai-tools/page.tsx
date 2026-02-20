"use client";

import { motion } from "framer-motion";
import { Wand2, FileText, Image as ImageIcon, Video, Code, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AIToolsPage() {
  const tools = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "AI Resume Builder",
      description: "Create professional resumes with AI assistance.",
      href: "/dealoforge/dashboard?page=resume-builder",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Code Generation",
      description: "Generate code snippets and solutions instantly.",
      href: "/dealoforge",
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      title: "Image Generation",
      description: "Create images with AI for your projects.",
      href: "/dealoforge",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Tools",
      description: "AI-powered video editing and generation.",
      href: "/dealoforge",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Content Writing",
      description: "Generate articles, blog posts, and more.",
      href: "/dealoforge",
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "AI Assistant",
      description: "Get help with any task using our AI assistant.",
      href: "/dealoforge",
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl mb-6">
            <Wand2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">AI Tools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful AI tools to boost your productivity and creativity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl border border-indigo-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-indigo-600 mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <Link
                href={tool.href}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Try Now →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}


