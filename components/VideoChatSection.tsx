"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Video,
  Users,
  MessageCircle,
  Clock,
  Shield,
  Zap,
  Star,
  Play,
  Mic,
  Camera,
  Phone,
} from "lucide-react";
import Image from "next/image";

const VideoChatSection = () => {
  const router = useRouter();

  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "HD Video Calls",
      description: "Crystal clear video quality for professional meetings",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Real-time Chat",
      description: "Instant messaging during video sessions",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "End-to-end encryption for all communications",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule",
    },
  ];

  const testimonials = [
    {
      name: "Fatima Adebayo",
      role: "UI/UX Designer",
      content:
        "The video chat feature made client meetings so much easier. Professional quality and reliable connection.",
      rating: 5,
      avatar:
        "https://res.cloudinary.com/ddgzzjp4x/image/upload/v1756269626/istockphoto-1394347322-612x612_gaxfzi.jpg",
    },
    {
      name: "Emeka Okafor",
      role: "Full Stack Developer",
      content:
        "Perfect for code reviews and pair programming sessions. The screen sharing is excellent.",
      rating: 5,
      avatar:
        "https://res.cloudinary.com/ddgzzjp4x/image/upload/v1756269683/blackman_malik_kq94ts.png",
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
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#70f69ae1] font-semibold">Video Chat</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-outfit">
              Connect Face-to-Face with{" "}
              <span className="text-[#70f69ae1]">Professionals</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              High-quality video calls for client meetings, consultations,
              interviews, and professional networking. Built for the modern
              professional who values personal connection.
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
                onClick={() => router.push("/video-chat")}
                className="px-8 py-4 bg-[#70f69ae1] text-white rounded-xl font-semibold hover:bg-[#5dd885] transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Start Video Chat
              </motion.button>
              <motion.button
                onClick={() => router.push("/video-chat/demo")}
                className="px-8 py-4 border-2 border-[#70f69ae1] text-[#70f69ae1] rounded-xl font-semibold hover:bg-[#70f69ae1] hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-300">Video Calls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-300">Uptime</div>
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
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Professional Meeting
                      </h3>
                      <p className="text-sm text-gray-300">3 participants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Live</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600">
                    <Mic className="w-6 h-6 mx-auto mb-2 text-[#70f69ae1]" />
                    <p className="text-sm font-medium text-white">Audio</p>
                    <p className="text-xs text-gray-300">HD Quality</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600">
                    <Camera className="w-6 h-6 mx-auto mb-2 text-[#70f69ae1]" />
                    <p className="text-sm font-medium text-white">Video</p>
                    <p className="text-xs text-gray-300">1080p</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <Phone className="w-5 h-5 text-white rotate-90" />
                  </button>
                  <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                    <Mic className="w-5 h-5 text-gray-300" />
                  </button>
                  <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                    <Video className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <Zap className="w-6 h-6 text-[#70f69ae1]" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <Star className="w-4 h-4 text-[#70f69ae1]" />
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
            What Professionals Say
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
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-300">{testimonial.role}</p>
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

export default VideoChatSection;
