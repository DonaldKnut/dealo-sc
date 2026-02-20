"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Shield,
  Zap,
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";

const ScratchCardSection = () => {
  const router = useRouter();

  const examTypes = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "WAEC",
      description: "West African Examinations Council",
      price: "₦2,500",
      features: ["Instant delivery", "Official scratch card", "24/7 support"],
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "NECO",
      description: "National Examinations Council",
      price: "₦2,200",
      features: ["Secure payment", "Email delivery", "Refund guarantee"],
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "JAMB",
      description: "Joint Admissions and Matriculation Board",
      price: "₦6,200",
      features: ["Official portal", "SMS notification", "Customer support"],
    },
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Secure",
      description: "Bank-grade security for all transactions",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Delivery",
      description: "Get your scratch card immediately after payment",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Verified Cards",
      description: "All cards are officially verified and authentic",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support available",
    },
  ];

  const testimonials = [
    {
      name: "Aisha Okechukwu",
      role: "Student",
      content:
        "Bought my WAEC scratch card here and it was delivered instantly. Very reliable and secure platform!",
      rating: 5,
      avatar:
        "https://res.cloudinary.com/ddgzzjp4x/image/upload/v1756270309/young-black-woman-with-braids-posing-in-studio-with-neutral-background_dgvhv9.webp",
    },
    {
      name: "Chukwudi Nwankwo",
      role: "Parent",
      content:
        "Purchased JAMB cards for my children. The process was smooth and the support team was very helpful.",
      rating: 5,
      avatar:
        "https://res.cloudinary.com/ddgzzjp4x/image/upload/v1756269236/Screenshot_2025-08-06_at_7.23.04_PM_hhetda.png",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#70f69ae1] rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#70f69ae1] font-semibold">
                Scratch Cards
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-outfit">
              Purchase{" "}
              <span className="text-[#70f69ae1]">Exam Scratch Cards</span>{" "}
              Instantly
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Get your WAEC, NECO, and JAMB scratch cards instantly with secure
              payment. Official cards delivered to your email with 24/7 customer
              support. Your academic journey starts here.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-[#70f69ae1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-[#70f69ae1]">{feature.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => router.push("/scratch-cards")}
                className="px-8 py-4 bg-[#70f69ae1] text-white rounded-xl font-semibold hover:bg-[#5dd885] transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CreditCard className="w-5 h-5" />
                Buy Scratch Cards
              </motion.button>
              <motion.button
                onClick={() => router.push("/scratch-cards/prices")}
                className="px-8 py-4 border-2 border-[#70f69ae1] text-[#70f69ae1] rounded-xl font-semibold hover:bg-[#70f69ae1] hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Prices
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-300">Cards Sold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-sm text-gray-300">Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-[#70f69ae1] to-[#5dd885] rounded-3xl p-8 shadow-2xl">
              <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#70f69ae1] rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Scratch Card Purchase
                      </h3>
                      <p className="text-sm text-gray-300">Secure & Instant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Live</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {examTypes.map((exam, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl border border-gray-600"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#70f69ae1]/10 rounded-lg flex items-center justify-center">
                          <div className="text-[#70f69ae1]">{exam.icon}</div>
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {exam.title}
                          </p>
                          <p className="text-xs text-gray-300">
                            {exam.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#70f69ae1]">
                          {exam.price}
                        </p>
                        <p className="text-xs text-gray-400">Instant</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button className="w-12 h-12 bg-[#70f69ae1] rounded-full flex items-center justify-center hover:bg-[#5dd885] transition-colors">
                    <CreditCard className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                    <Shield className="w-5 h-5 text-gray-300" />
                  </button>
                  <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                    <Zap className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <DollarSign className="w-6 h-6 text-[#70f69ae1]" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <TrendingUp className="w-4 h-4 text-[#70f69ae1]" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-12 font-outfit">
            What Students & Parents Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-[#70f69ae1]/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.2 + i * 0.1,
                      }}
                      viewport={{ once: true }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="text-gray-700 mb-4 leading-relaxed"
                >
                  &ldquo;{testimonial.content}&rdquo;
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-md"
                  >
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScratchCardSection;
