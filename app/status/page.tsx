"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Activity } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function StatusPage() {
  const services = [
    { name: "Platform", status: "operational", uptime: "99.9%" },
    { name: "API", status: "operational", uptime: "99.8%" },
    { name: "Payments", status: "operational", uptime: "100%" },
    { name: "Video Streaming", status: "operational", uptime: "99.7%" },
    { name: "Email Service", status: "operational", uptime: "99.9%" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Activity className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-lg text-gray-600">All systems operational</p>
        </motion.div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(service.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                {service.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}


