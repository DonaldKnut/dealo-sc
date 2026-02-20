"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/hooks/use-safe-session";
import {
  Brain,
  CheckCircle,
  Star,
  Play,
  Users,
  Globe,
  Shield,
  User,
} from "lucide-react";
import Image from "next/image";

const ProfessionalHero = () => {
  const router = useRouter();
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const professionals = [
    {
      id: "1",
      name: "Zainab Hassan",
      profession: "UI/UX Designer",
      image:
        "https://res.cloudinary.com/dxojy40bv/image/upload/v1755861472/rtlstuwhxbnq3qabkf9y_jjuik3.webp",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      earnings: "₦2.5M+",
      rating: 4.9,
      category: "creative",
    },
    {
      id: "2",
      name: "Michael Olayemi",
      profession: "Full Stack Developer",
      image:
        "https://res.cloudinary.com/dxojy40bv/image/upload/v1755861471/Full-Stack_Development_Guide___Web_App_Dev_Essentials_1_z4uhpx.jpg",
      skills: ["React", "Node.js", "Python"],
      earnings: "₦3.2M+",
      rating: 4.8,
      category: "technical",
    },
    {
      id: "3",
      name: "Uju Okechukwu",
      profession: "Traditional Bead Maker",
      image:
        "https://res.cloudinary.com/dxojy40bv/image/upload/v1755861473/Mix_Seed_Beads-_Multicolored-_4mm-_6_0_Glass_Seed_Beads_For_Jewelry_Making_DIY_Waist_beads_Bracelet_Necklace_Earrings_-_D_dsbt9t.jpg",
      skills: ["Bead Weaving", "Pattern Design", "Cultural Art"],
      earnings: "₦800K+",
      rating: 4.9,
      category: "artisan",
    },
    {
      id: "4",
      name: "Oluwaseun Adebayo",
      profession: "Corporate Lawyer",
      image:
        "https://res.cloudinary.com/dxojy40bv/image/upload/v1755862810/3-1024x512_v0y7xo.jpg",
      skills: ["Contract Law", "Corporate Governance", "M&A"],
      earnings: "₦4.1M+",
      rating: 4.7,
      category: "business",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % professionals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [professionals.length]);

  const currentProfessional = professionals[currentIndex];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center"
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-green-300 font-semibold text-lg font-ui">
                  Dealo AI Forge
                </span>
              </div>

              {/* User Avatar */}
              {sessionData?.user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm text-gray-300 hidden sm:block">
                    Welcome, {sessionData?.user.name || "User"}
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    {sessionData?.user.image ? (
                      <Image
                        src={sessionData?.user.image}
                        alt={sessionData?.user.name || "User"}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border-2 border-green-500/50 shadow-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center border-2 border-green-500/50 shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"
                    />
                  </motion.div>
                </motion.div>
              )}
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
              Where{" "}
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Every Skill
              </span>{" "}
              Becomes a{" "}
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Career
              </span>
            </h1>

            <p className="text-body-large text-gray-300 mb-8 font-body">
              From traditional artisans to cutting-edge tech professionals,
              Dealo AI Forge certifies and empowers every skill. Our AI-powered
              platform transforms your expertise into a thriving freelance
              career.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                onClick={() => router.push("/certifications/explore")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Get AI Certified
              </motion.button>
              <motion.button
                onClick={() => router.push("/search/freelance")}
                className="px-8 py-4 border-2 border-green-500 text-green-300 rounded-xl font-semibold hover:bg-green-500 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Freelancing
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300 mb-1">
                  50K+
                </div>
                <div className="text-sm text-gray-400">Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300 mb-1">
                  ₦2B+
                </div>
                <div className="text-sm text-gray-400">Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300 mb-1">
                  98%
                </div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProfessional.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-coral-800/90 via-coral-900/90 to-red-900/90 backdrop-blur-xl rounded-3xl p-8 border border-coral-700/50 shadow-2xl">
                  <div className="relative mb-6">
                    <div className="w-full h-64 bg-gradient-to-br from-coral-700 to-coral-800 rounded-2xl overflow-hidden">
                      <Image
                        src={currentProfessional.image}
                        alt={currentProfessional.name}
                        width={400}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white text-xs font-semibold">
                      {currentProfessional.category.charAt(0).toUpperCase() +
                        currentProfessional.category.slice(1)}
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-2xl font-bold text-white mb-1 font-display"
                      >
                        {currentProfessional.name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-green-300 font-semibold font-outfit"
                      >
                        {currentProfessional.profession}
                      </motion.p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2 font-outfit">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentProfessional.skills.map((skill, index) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              delay: index * 0.15,
                              duration: 0.5,
                              ease: "easeOut",
                            }}
                            className="px-3 py-1 bg-green-500/10 text-green-300 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="grid grid-cols-3 gap-4 pt-4 border-t border-coral-700"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          {currentProfessional.earnings}
                        </div>
                        <div className="text-xs text-gray-400">Earnings</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-lg font-bold text-white">
                            {currentProfessional.rating}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-300">
                          AI
                        </div>
                        <div className="text-xs text-gray-400">Certified</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="bg-gradient-to-r from-coral-500/10 to-red-600/10 rounded-xl p-4 border border-coral-500/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-coral-400" />
                        <span className="text-sm font-semibold text-white font-outfit">
                          AI Certification
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 font-sans">
                        AI-Certified {currentProfessional.profession}
                      </p>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center"
                >
                  <Globe className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-green-500" />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {professionals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-green-500 scale-125"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalHero;
