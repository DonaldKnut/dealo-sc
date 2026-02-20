"use client";

import { motion } from "framer-motion";
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";

interface StudentDashboardProps {
  user: any;
}

const StudentDashboard = ({ user }: StudentDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Courses Enrolled</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-400" />
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
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
            <Award className="w-8 h-8 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Study Hours</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
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
              <p className="text-gray-400 text-sm">Progress</p>
              <p className="text-2xl font-bold text-white">67%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-white">Completed React Fundamentals course</p>
              <p className="text-gray-400 text-sm">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div>
              <p className="text-white">Enrolled in Advanced JavaScript</p>
              <p className="text-gray-400 text-sm">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div>
              <p className="text-white">Earned Python Certification</p>
              <p className="text-gray-400 text-sm">3 days ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
