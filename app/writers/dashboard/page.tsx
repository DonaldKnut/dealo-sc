"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PenTool, Plus, BarChart3, DollarSign, Eye, Edit, FileText } from "lucide-react"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

const WritersDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Total Views", value: "2,139", icon: Eye, color: "from-blue-500 to-blue-600" },
    { title: "Total Earnings", value: "₦7,700", icon: DollarSign, color: "from-green-500 to-green-600" },
    { title: "Published Posts", value: "2", icon: FileText, color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Writers Dashboard</h1>
                <p className="text-gray-400">Manage your content and track your earnings</p>
              </div>
            </div>
            <motion.button
              onClick={() => router.push("/writers/create-blog")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              New Post
            </motion.button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            onClick={() => router.push("/writers/create-blog")}
            className="p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl text-left hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Create New Post</h4>
            <p className="text-gray-400 text-sm">Start writing your next article</p>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("analytics")}
            className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl text-left hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">View Analytics</h4>
            <p className="text-gray-400 text-sm">Check your performance metrics</p>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("earnings")}
            className="p-6 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl text-left hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Track Earnings</h4>
            <p className="text-gray-400 text-sm">Monitor your revenue growth</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WritersDashboard;
