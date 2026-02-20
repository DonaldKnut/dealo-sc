"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Target,
  BarChart3,
} from "lucide-react";

type CertificationLevel = "beginner" | "intermediate" | "advanced" | "expert";

interface Certification {
  _id: string;
  title: string;
  description: string;
  field: string;
  level: CertificationLevel;
  duration: string;
  questions: number;
  passingScore: number;
  isCompleted?: boolean;
  userScore?: number;
  completedAt?: Date;
}

interface CertificationStats {
  totalCertifications: number;
  activeCertifications: number;
  averageScore: number;
  completionRate: number;
}

const CertificationPage = () => {
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const router = useRouter();
  const [stats, setStats] = useState<CertificationStats | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/certifications/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field.toLowerCase()) {
      case "programming":
        return <Zap className="h-5 w-5" />;
      case "design":
        return <Target className="h-5 w-5" />;
      case "marketing":
        return <TrendingUp className="h-5 w-5" />;
      case "business":
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: CertificationLevel) => {
    switch (level) {
      case "beginner":
        return "text-green-500 bg-green-100";
      case "intermediate":
        return "text-blue-500 bg-blue-100";
      case "advanced":
        return "text-purple-500 bg-purple-100";
      case "expert":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getLevelDescription = (level: CertificationLevel) => {
    switch (level) {
      case "beginner":
        return "Perfect for newcomers";
      case "intermediate":
        return "For those with some experience";
      case "advanced":
        return "For experienced professionals";
      case "expert":
        return "For industry experts";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (sessionData?.user) {
      fetchUserStats();
    }
    setLoading(false);
  }, [session, sessionData?.user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#70f69ae1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Professional Certifications
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Validate your skills and stand out in the competitive market with
              our industry-recognized certifications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/certifications/explore")}
                className="bg-[#70f69ae1] text-white px-8 py-3 rounded-lg hover:bg-[#5dd885] transition-colors font-semibold"
              >
                Explore Certifications
              </button>
              <button
                onClick={() => router.push("/certifications/my-certifications")}
                className="border border-[#70f69ae1] text-[#70f69ae1] px-8 py-3 rounded-lg hover:bg-[#70f69ae1] hover:text-white transition-colors font-semibold"
              >
                My Certifications
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-[#70f69ae1]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-[#70f69ae1]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {stats.totalCertifications}
              </h3>
              <p className="text-gray-400">Total Certifications</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {stats.activeCertifications}
              </h3>
              <p className="text-gray-400">Active Certifications</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {stats.averageScore}%
              </h3>
              <p className="text-gray-400">Average Score</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {stats.completionRate}%
              </h3>
              <p className="text-gray-400">Completion Rate</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose Our Certifications?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our certification system is designed to help you validate your
            skills and build credibility in your field
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-[#70f69ae1]/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-[#70f69ae1]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Industry Recognition
            </h3>
            <p className="text-gray-400">
              Our certifications are recognized by leading companies and
              professionals in the industry
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Flexible Learning
            </h3>
            <p className="text-gray-400">
              Study at your own pace with our comprehensive learning materials
              and practice tests
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Community Support
            </h3>
            <p className="text-gray-400">
              Connect with other professionals and get support from our
              community of experts
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who have already earned their
            certifications and advanced their careers
          </p>
          <button
            onClick={() => router.push("/certifications/explore")}
            className="bg-white text-[#70f69ae1] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Your Certification Journey
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificationPage;
