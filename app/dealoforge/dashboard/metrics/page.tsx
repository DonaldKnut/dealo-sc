"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, DollarSign } from "lucide-react";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

const MetricsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Analytics & Metrics
        </h1>
        <p className="text-gray-400">
          Track your platform performance and user engagement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">12,543</p>
              <p className="text-green-400 text-sm">+12% from last month</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">$45,231</p>
              <p className="text-green-400 text-sm">+8% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Courses Completed</p>
              <p className="text-2xl font-bold text-white">3,247</p>
              <p className="text-green-400 text-sm">+15% from last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-white">1,892</p>
              <p className="text-green-400 text-sm">+5% from last month</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart visualization coming soon</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Revenue Trends
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart visualization coming soon</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
            <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">New user registration</p>
              <p className="text-gray-400 text-sm">
                John Doe joined the platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
            <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Course completion</p>
              <p className="text-gray-400 text-sm">
                Sarah completed React Fundamentals
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
            <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">Payment received</p>
              <p className="text-gray-400 text-sm">
                $299 from premium subscription
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MetricsPage;
