"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plane,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  CreditCard,
  Calculator,
  FileText,
} from "lucide-react";
import SectionWrapper from "@/components/layouts/SectionWrapper";
import Link from "next/link";

/**
 * Travel Loans Landing Page
 * Advanced landing page for travel loans feature
 */
export default function TravelLoansLandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Approval",
      description: "Get approved in as little as 24 hours",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Flexible Repayment",
      description: "Choose a repayment plan that works for you",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Trusted",
      description: "Your financial information is protected",
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Low Interest Rates",
      description: "Competitive rates for Nigerian professionals",
    },
  ];

  const benefits = [
    "Finance your education and travel goals",
    "No collateral required for qualified applicants",
    "Flexible repayment terms up to 12 months",
    "Quick disbursement to your bank account",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Hero Section */}
      <SectionWrapper background="transparent" padding="xl" container={false}>
        <div className="relative min-h-[80vh] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-300 font-semibold text-lg">
                    Dealo Travel Loans
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                  Finance Your{" "}
                  <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    Education & Travel
                  </span>{" "}
                  Goals
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  Get quick access to funds for your education, travel, and
                  professional development. Flexible repayment plans designed for
                  Nigerian professionals.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/travel-loans/apply")}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Apply Now
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/travel-loans/calculator")}
                    className="px-8 py-4 border-2 border-green-500 text-green-400 hover:bg-green-500/10 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Loan
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 rounded-3xl p-8 border border-green-400/30 shadow-2xl">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-5xl font-black text-green-400 mb-2">
                        ₦500K - ₦5M
                      </div>
                      <p className="text-gray-400">Loan Amount Range</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-green-400/20">
                        <div className="text-2xl font-bold text-white mb-1">
                          24hrs
                        </div>
                        <p className="text-gray-400 text-sm">Approval Time</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-green-400/20">
                        <div className="text-2xl font-bold text-white mb-1">
                          12 months
                        </div>
                        <p className="text-gray-400 text-sm">Max Repayment</p>
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-400/30">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-white font-semibold">
                          Competitive Rates
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Interest rates starting from 5% per month
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Features Section */}
      <SectionWrapper background="dark" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Dealo Travel Loans
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Fast, flexible, and designed for Nigerian professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 rounded-2xl p-6 border border-green-400/20 hover:border-green-400/40 transition-all text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto text-green-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper background="transparent" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-gray-900 via-[#1a2a1a] to-gray-900 rounded-3xl p-12 border border-green-400/30"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to Finance Your Goals?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Apply now and get approved in 24 hours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/travel-loans/apply")}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Apply for Loan
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  );
}


