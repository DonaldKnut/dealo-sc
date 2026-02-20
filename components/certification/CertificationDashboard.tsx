"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  BookOpen,
  Code,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";

interface Certification {
  id: string;
  profession: string;
  level: string;
  score: number;
  status: "in_progress" | "completed" | "failed";
  progress: number;
  certificateUrl?: string;
  badgeUrl?: string;
  issuedAt?: Date;
  validUntil?: Date;
}

interface Profession {
  id: string;
  name: string;
  category: string;
  complexity: number;
  pricing: number;
  duration: string;
  description: string;
  icon: React.ReactNode;
}

const CertificationDashboard: React.FC = () => {
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<string | null>(
    null
  );
  const [isStartingAssessment, setIsStartingAssessment] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<any>(null);

  const professions: Profession[] = [
    {
      id: "software-developer",
      name: "Software Developer",
      category: "Technology",
      complexity: 4,
      pricing: 199,
      duration: "3-4 hours",
      description:
        "Comprehensive assessment covering coding, system design, and problem-solving skills.",
      icon: <Code className="w-6 h-6" />,
    },
    {
      id: "digital-marketer",
      name: "Digital Marketer",
      category: "Marketing",
      complexity: 2,
      pricing: 99,
      duration: "2-3 hours",
      description:
        "Assessment of digital marketing strategies, analytics, and campaign management.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      id: "data-scientist",
      name: "Data Scientist",
      category: "Technology",
      complexity: 5,
      pricing: 299,
      duration: "4-5 hours",
      description:
        "Advanced assessment covering machine learning, statistics, and data analysis.",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      id: "ux-designer",
      name: "UX Designer",
      category: "Design",
      complexity: 3,
      pricing: 149,
      duration: "3-4 hours",
      description:
        "Assessment of user experience design, research, and prototyping skills.",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  useEffect(() => {
    // Load user's certifications
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const response = await fetch("/api/certifications/user");
      const data = await response.json();
      if (data.success) {
        setCertifications(data.certifications);
      }
    } catch (error) {
      console.error("Error loading certifications:", error);
    }
  };

  const startAssessment = async (professionId: string) => {
    setIsStartingAssessment(true);
    try {
      const response = await fetch("/api/certifications/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ professionId }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentAssessment({
          id: data.assessmentId,
          professionId,
          status: "started",
        });
        setSelectedProfession(professionId);
      }
    } catch (error) {
      console.error("Error starting assessment:", error);
    } finally {
      setIsStartingAssessment(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Play className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Professional Certifications
          </h1>
          <p className="text-gray-600">
            Validate your skills with AI-powered professional certifications
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Certifications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    certifications.filter((c) => c.status === "completed")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    certifications.filter((c) => c.status === "in_progress")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {certifications.length > 0
                    ? Math.round(
                        certifications.reduce((sum, c) => sum + c.score, 0) /
                          certifications.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {certifications.length > 0
                    ? Math.round(
                        (certifications.filter((c) => c.status === "completed")
                          .length /
                          certifications.length) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Available Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Certifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professions.map((profession) => (
              <motion.div
                key={profession.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      {profession.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profession.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {profession.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {profession.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {profession.duration}
                      </span>
                      <span className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1" />
                        Level {profession.complexity}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      ${profession.pricing}
                    </span>
                  </div>

                  <button
                    onClick={() => startAssessment(profession.id)}
                    disabled={isStartingAssessment}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    {isStartingAssessment ? "Starting..." : "Start Assessment"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Current Certifications */}
        {certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Certifications
            </h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issued
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {certifications.map((cert) => (
                      <tr key={cert.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {cert.profession}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              cert.status
                            )}`}
                          >
                            {getStatusIcon(cert.status)}
                            <span className="ml-1 capitalize">
                              {cert.status.replace("_", " ")}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cert.score}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {cert.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cert.issuedAt
                            ? new Date(cert.issuedAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {cert.status === "completed" && (
                            <div className="flex space-x-2">
                              <a
                                href={cert.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Certificate
                              </a>
                              <a
                                href={cert.badgeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-900"
                              >
                                View Badge
                              </a>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CertificationDashboard;
