"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plane,
  DollarSign,
  Clock,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

const TravelLoansSection = () => {
  const router = useRouter();

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Low Interest Rates",
      description: "Starting from 5% APR",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Approval",
      description: "24-48 hours processing",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "No Hidden Fees",
      description: "Transparent terms",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Flexible Repayment",
      description: "Choose your schedule",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-green-800 via-green-900 to-green-950">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="w-8 h-8 bg-[#70f69ae1] rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#70f69ae1] font-semibold">Travel Loans</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            Invest in Your{" "}
            <span className="text-[#70f69ae1]">Professional Growth</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Don&apos;t let financial constraints hold you back from attending
            conferences, workshops, and networking events. Our travel loans
            support your development.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Why Choose Dealo Travel Loans?
            </h3>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#70f69ae1]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <div className="text-[#70f69ae1]">{benefit.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <motion.button
                onClick={() => router.push("/travel-loans")}
                className="px-8 py-4 bg-[#70f69ae1] text-white rounded-xl font-semibold hover:bg-[#5dd885] transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="text-center mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Loan Amounts
                </h4>
                <p className="text-gray-600">
                  Choose the right amount for your needs
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { amount: "₦100K", description: "Local Events" },
                  { amount: "₦250K", description: "Regional Conferences" },
                  { amount: "₦500K", description: "International Events" },
                ].map((loan, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#70f69ae1]/5 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-2xl font-bold text-[#70f69ae1]">
                        {loan.amount}
                      </div>
                      <div className="text-sm text-gray-600">
                        {loan.description}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#70f69ae1]/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-[#70f69ae1]" />
                  <span className="font-semibold text-gray-900">
                    Eligibility
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Active Dealo member for 3+ months</li>
                  <li>• Good payment history</li>
                  <li>• Valid event registration</li>
                  <li>• Nigerian resident</li>
                </ul>
              </div>
            </div>

            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-[#70f69ae1] rounded-full shadow-lg flex items-center justify-center"
            >
              <Star className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TravelLoansSection;
