"use client";

import { motion } from "framer-motion";

interface ClientDashboardProps {
  user: any;
}

export default function ClientDashboard({ user }: ClientDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-gray-800/50 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Client Dashboard</h2>
        <p className="text-gray-300">
          Welcome to the client dashboard. Client-specific features will be
          available here.
        </p>
      </div>
    </motion.div>
  );
}
