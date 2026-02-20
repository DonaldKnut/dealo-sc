"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
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
  Download,
  Share2,
  Calendar,
  Trophy,
  Eye,
  ExternalLink,
  Shield,
  Share,
} from "lucide-react";

type CertificationLevel = "beginner" | "intermediate" | "advanced" | "expert";
type CertificationField =
  | "programming"
  | "design"
  | "marketing"
  | "business"
  | "data-science"
  | "cybersecurity";

interface UserCertification {
  _id: string;
  title: string;
  description: string;
  field: CertificationField;
  level: CertificationLevel;
  certificateId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  certificateUrl?: string;
  tags: string[];
}

const MyCertificationsPage = () => {
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const router = useRouter();
  const [certifications, setCertifications] = useState<UserCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  // Mock data for user certifications
  const mockUserCertifications: UserCertification[] = useMemo(
    () => [
      {
        _id: "1",
        title: "Full Stack Web Development",
        description:
          "Master modern web development with React, Node.js, and MongoDB",
        field: "programming",
        level: "intermediate",
        certificateId: "CERT-2024-001",
        score: 85,
        maxScore: 100,
        completedAt: new Date("2024-01-15"),
        expiresAt: new Date("2026-01-15"),
        isActive: true,
        certificateUrl: "/certificates/cert-2024-001.pdf",
        tags: ["React", "Node.js", "MongoDB", "JavaScript"],
      },
      {
        _id: "2",
        title: "UI/UX Design Fundamentals",
        description:
          "Learn the principles of user interface and user experience design",
        field: "design",
        level: "beginner",
        certificateId: "CERT-2024-002",
        score: 92,
        maxScore: 100,
        completedAt: new Date("2024-02-20"),
        expiresAt: new Date("2026-02-20"),
        isActive: true,
        certificateUrl: "/certificates/cert-2024-002.pdf",
        tags: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      },
      {
        _id: "3",
        title: "Digital Marketing Strategy",
        description:
          "Develop comprehensive digital marketing strategies for business growth",
        field: "marketing",
        level: "advanced",
        certificateId: "CERT-2023-003",
        score: 78,
        maxScore: 100,
        completedAt: new Date("2023-11-10"),
        expiresAt: new Date("2025-11-10"),
        isActive: true,
        certificateUrl: "/certificates/cert-2023-003.pdf",
        tags: ["SEO", "Social Media", "Content Marketing", "Analytics"],
      },
      {
        _id: "4",
        title: "Cybersecurity Fundamentals",
        description:
          "Learn essential cybersecurity concepts and best practices",
        field: "cybersecurity",
        level: "beginner",
        certificateId: "CERT-2023-004",
        score: 88,
        maxScore: 100,
        completedAt: new Date("2023-08-05"),
        expiresAt: new Date("2024-08-05"),
        isActive: false,
        certificateUrl: "/certificates/cert-2023-004.pdf",
        tags: ["Network Security", "Ethical Hacking", "Risk Management"],
      },
    ],
    []
  );

  useEffect(() => {
    setCertifications(mockUserCertifications);
    setLoading(false);
  }, [mockUserCertifications]);

  const getFieldIcon = (field: CertificationField) => {
    switch (field) {
      case "programming":
        return <Zap className="h-5 w-5" />;
      case "design":
        return <Target className="h-5 w-5" />;
      case "marketing":
        return <TrendingUp className="h-5 w-5" />;
      case "business":
        return <BarChart3 className="h-5 w-5" />;
      case "data-science":
        return <BarChart3 className="h-5 w-5" />;
      case "cybersecurity":
        return <Shield className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: CertificationLevel) => {
    switch (level) {
      case "beginner":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "intermediate":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "advanced":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "expert":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getFieldColor = (field: CertificationField) => {
    switch (field) {
      case "programming":
        return "text-blue-500";
      case "design":
        return "text-purple-500";
      case "marketing":
        return "text-green-500";
      case "business":
        return "text-orange-500";
      case "data-science":
        return "text-indigo-500";
      case "cybersecurity":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90)
      return "text-green-400 bg-green-500/10 border-green-500/20";
    if (score >= 80) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (score >= 70)
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  const filteredCertifications = certifications.filter((cert) => {
    if (filter === "active") return cert.isActive;
    if (filter === "expired") return !cert.isActive;
    return true;
  });

  const stats = {
    total: certifications.length,
    active: certifications.filter((c) => c.isActive).length,
    expired: certifications.filter((c) => !c.isActive).length,
    averageScore: Math.round(
      certifications.reduce((acc, cert) => acc + cert.score, 0) /
        certifications.length
    ),
  };

  const handleDownloadCertificate = (certification: UserCertification) => {
    // Mock download functionality
    console.log(`Downloading certificate: ${certification.certificateId}`);
    // In a real app, this would trigger a download
  };

  const handleShareCertificate = (certification: UserCertification) => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: certification.title,
        text: `I earned the ${certification.title} certification with a score of ${certification.score}%!`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(
        `I earned the ${certification.title} certification with a score of ${certification.score}%!`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#70f69ae1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              My Certifications
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Track your professional achievements and showcase your validated
              skills
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
            <div className="w-12 h-12 bg-[#70f69ae1]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-[#70f69ae1]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {stats.total}
            </h3>
            <p className="text-gray-400">Total Certifications</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {stats.active}
            </h3>
            <p className="text-gray-400">Active Certifications</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {stats.expired}
            </h3>
            <p className="text-gray-400">Expired Certifications</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {stats.averageScore}%
            </h3>
            <p className="text-gray-400">Average Score</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-[#70f69ae1] text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === "active"
                ? "bg-[#70f69ae1] text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter("expired")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === "expired"
                ? "bg-[#70f69ae1] text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Expired ({stats.expired})
          </button>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((certification) => (
            <motion.div
              key={certification._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-[#70f69ae1]/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#70f69ae1]/20 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-[#70f69ae1]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {certification.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {certification.field}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getScoreBadge(
                    certification.score
                  )}`}
                >
                  {certification.score}%
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Level:</span>
                  <span className="text-white font-medium">
                    {certification.level}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Completed:</span>
                  <span className="text-white font-medium">
                    {new Date(certification.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`font-medium ${
                      certification.isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {certification.isActive ? "Active" : "Expired"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadCertificate(certification)}
                  className="flex-1 px-4 py-2 bg-[#70f69ae1] text-white rounded-lg font-medium hover:bg-[#5dd885] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => handleShareCertificate(certification)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Share className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCertifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              No certifications found
            </div>
            <p className="text-gray-500">
              Start earning certifications to see them here
            </p>
            <button
              onClick={() => router.push("/certifications/explore")}
              className="mt-4 px-6 py-3 bg-[#70f69ae1] text-white rounded-lg font-medium hover:bg-[#5dd885] transition-colors"
            >
              Explore Certifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificationsPage;
