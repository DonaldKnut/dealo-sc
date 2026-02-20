"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Users,
  Award,
  Zap,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Shield,
  Heart,
} from "lucide-react";

const DealoAdvert = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Learning",
      description: "Personalized courses with intelligent assessment",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Global Community",
      description: "Connect with professionals worldwide",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Industry Recognition",
      description: "Get certified and boost your career",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Your data and privacy are protected",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Active Learners",
      icon: <Users className="w-5 h-5" />,
    },
    {
      number: "10K+",
      label: "Courses Available",
      icon: <Award className="w-5 h-5" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    { number: "150+", label: "Countries", icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              >
                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                <span className="text-white font-medium font-outfit">
                  Trusted by 50K+ professionals
                </span>
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-display"
            >
              The Future of{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Professional
              </span>{" "}
              Growth
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-green-100 mb-8 max-w-lg"
            >
              Join the world&apos;s leading platform for learning, networking,
              and career advancement. Connect with experts, earn certifications,
              and build your future.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 font-outfit">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-green-100">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => window.open("/sign-in", "_blank")}
                className="bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span className="font-outfit">Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.open("/certifications/explore", "_blank")}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-colors duration-200"
              >
                <span className="font-outfit">Explore Courses</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Stats and Social Proof */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <div className="text-white">{stat.icon}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <p className="text-green-100 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  </motion.div>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-white mb-4 italic"
              >
                &ldquo;Dealo is transforming my career journey. The AI-powered
                learning and global community are helping me grow every day.
                I&apos;m on my way to my dream job!&rdquo;
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg"
                >
                  <Image
                    src="https://res.cloudinary.com/ddgzzjp4x/image/upload/v1756269552/images_xmcxzo.jpg"
                    alt="Aisha Bello"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div>
                  <p className="font-semibold text-white">Aisha Bello</p>
                  <p className="text-green-100 text-sm">
                    UI/UX Designer at TechFlow Solutions
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-sm font-medium">SSL Secured</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-sm font-medium">24/7 Support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <p className="text-white text-sm font-medium">Global Access</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DealoAdvert;
