"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Video,
  Users,
  ScreenShare,
  Circle as Record,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Clock,
  Globe,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import SectionWrapper from "@/components/layouts/SectionWrapper";
import Link from "next/link";

export default function VideoChatLandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "HD Video Calls",
      description: "Crystal clear video quality for professional meetings",
    },
    {
      icon: <ScreenShare className="w-8 h-8" />,
      title: "Screen Sharing",
      description: "Share your screen for presentations and collaboration",
    },
    {
      icon: <Record className="w-8 h-8" />,
      title: "Record Meetings",
      description: "Record important sessions for later review",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Calls",
      description: "Host meetings with up to 50 participants",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "End-to-end encryption for all your conversations",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Connection",
      description: "No downloads required, works in your browser",
    },
  ];

  const useCases = [
    {
      title: "Online Tutoring",
      description: "Conduct one-on-one or group tutoring sessions",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      title: "Client Meetings",
      description: "Professional video calls with clients and partners",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      title: "Team Collaboration",
      description: "Connect with your team members remotely",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Job Interviews",
      description: "Conduct remote interviews with candidates",
      icon: <CheckCircle className="w-6 h-6" />,
    },
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
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-300 font-semibold text-lg">
                    Dealo Video Chat
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                  Professional{" "}
                  <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    Video Meetings
                  </span>{" "}
                  Made Simple
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  Connect with clients, students, and team members through
                  high-quality video calls. No downloads, no hassle — just
                  professional video communication.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/video-chat")}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Video Call
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/video-chat")}
                    className="px-8 py-4 border-2 border-green-500/40 text-green-400 hover:bg-green-500/10 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    Try Demo
                  </motion.button>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400">
                      <span className="text-white font-bold">99.9%</span>{" "}
                      Uptime
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400">
                      <span className="text-white font-bold">10K+</span> Calls
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400">
                      <span className="text-white font-bold">Global</span>{" "}
                      Access
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white/[0.03] rounded-3xl p-8 border border-green-500/15 shadow-2xl shadow-green-500/5 backdrop-blur-sm">
                  <div className="aspect-video bg-gradient-to-br from-emerald-500/10 to-green-600/10 rounded-xl flex items-center justify-center mb-6 border border-green-500/10">
                    <Video className="w-24 h-24 text-green-500/40" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        Participants
                      </span>
                      <span className="text-white font-semibold">
                        Up to 50
                      </span>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Quality</span>
                      <span className="text-white font-semibold">
                        HD 1080p
                      </span>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Security</span>
                      <span className="text-white font-semibold">
                        Encrypted
                      </span>
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
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Professional Video Calls
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Powerful features built for Nigerian professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.07] hover:border-green-500/20 hover:bg-white/[0.05] transition-all group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-400 group-hover:from-emerald-500/20 group-hover:to-green-600/20 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Use Cases Section */}
      <SectionWrapper background="transparent" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Perfect for Every{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Professional Need
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/[0.03] rounded-2xl p-8 border border-white/[0.07] hover:border-green-500/20 hover:bg-white/[0.05] transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-green-400 group-hover:from-emerald-500/20 group-hover:to-green-600/20 transition-all">
                  {useCase.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper background="dark" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-emerald-600/10 via-green-600/5 to-emerald-600/10 rounded-3xl p-12 border border-green-500/15"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to Start Your Video Call?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of professionals using Dealo Video Chat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/video-chat")}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 flex items-center justify-center gap-2"
            >
              Start Video Call
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-white/10 text-gray-300 hover:border-white/20 hover:text-white rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </SectionWrapper>
    </div>
  );
}
