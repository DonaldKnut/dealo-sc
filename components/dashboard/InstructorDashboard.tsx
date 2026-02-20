"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, DollarSign, Star } from "lucide-react";

interface InstructorDashboardProps {
  user: any;
}

const InstructorDashboard = ({ user }: InstructorDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-white">14</p>
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
              <p className="text-gray-400 text-sm">Active Students</p>
              <p className="text-2xl font-bold text-white">1,245</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-white">$12,540</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
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
              <p className="text-gray-400 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-white">4.8</p>
            </div>
            <Star className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorDashboard;








