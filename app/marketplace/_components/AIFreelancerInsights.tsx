"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Star,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Brain,
  Zap,
  Target,
  ThumbsUp,
  MessageCircle,
  Calendar,
} from "lucide-react";
import UserRoleBadge from "./UserRoleBadge";

interface FreelancerData {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role?: string;
  title?: string;
  isVerified?: boolean;
  verificationBadge?: string;
  location?: string;
  rating: number;
  completedProjects: number;
  responseTime: string;
  completionRate: number;
  totalEarnings: number;
  skills: string[];
  portfolioLinks?: string[];
  socialPresence?: {
    linkedin?: string;
    github?: string;
    behance?: string;
    dribbble?: string;
  };
  recentReviews?: {
    rating: number;
    comment: string;
    client: string;
    date: string;
  }[];
  specialties?: string[];
  availability?: string;
  languages?: string[];
}

interface AIFreelancerInsightsProps {
  isOpen: boolean;
  onClose: () => void;
  freelancerData: FreelancerData;
  onContactFreelancer: () => void;
}

const AIFreelancerInsights: React.FC<AIFreelancerInsightsProps> = ({
  isOpen,
  onClose,
  freelancerData,
  onContactFreelancer,
}) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);

  const calculateOverallScore = useCallback((data: FreelancerData) => {
    const ratingScore = (data.rating / 5) * 40;
    const completionScore = (data.completionRate / 100) * 30;
    const projectScore = Math.min(data.completedProjects * 2, 20);
    const responseScore = data.responseTime.includes("hour") ? 10 : 5;

    return Math.round(
      ratingScore + completionScore + projectScore + responseScore
    );
  }, []);

  const generateStrengths = useCallback((data: FreelancerData) => {
    const strengths = [];
    if (data.rating >= 4.5) strengths.push("High client satisfaction");
    if (data.completionRate >= 90) strengths.push("Excellent completion rate");
    if (data.completedProjects >= 50) strengths.push("Extensive experience");
    if (data.responseTime.includes("hour"))
      strengths.push("Quick response time");
    return strengths.slice(0, 3);
  }, []);

  const generateRecommendations = useCallback((data: FreelancerData) => {
    const recommendations = [];
    if (data.rating < 4.0)
      recommendations.push("Focus on improving client communication");
    if (data.completionRate < 80)
      recommendations.push("Work on project delivery consistency");
    if (data.completedProjects < 10)
      recommendations.push("Build more portfolio projects");
    return recommendations.slice(0, 2);
  }, []);

  const generateMarketPosition = useCallback(
    (data: FreelancerData) => {
      const score = calculateOverallScore(data);
      if (score >= 85) return "Top-tier professional";
      if (score >= 70) return "Experienced professional";
      if (score >= 50) return "Emerging professional";
      return "Developing talent";
    },
    [calculateOverallScore]
  );

  const generateRiskAssessment = useCallback((data: FreelancerData) => {
    const risks = [];
    if (data.rating < 3.5) risks.push("Low client satisfaction");
    if (data.completionRate < 70) risks.push("Inconsistent delivery");
    if (data.responseTime.includes("day")) risks.push("Slow communication");
    return risks.length === 0 ? ["Low risk"] : risks;
  }, []);

  const generateBestFor = useCallback((data: FreelancerData) => {
    const bestFor = [];
    if (data.rating >= 4.5) bestFor.push("High-priority projects");
    if (data.completionRate >= 90) bestFor.push("Time-sensitive work");
    if (data.completedProjects >= 30) bestFor.push("Complex projects");
    if (data.responseTime.includes("hour"))
      bestFor.push("Quick turnaround needs");
    return bestFor.slice(0, 3);
  }, []);

  const generateAISummary = useCallback(
    (data: FreelancerData) => {
      const score = calculateOverallScore(data);
      const position = generateMarketPosition(data);

      if (score >= 85) {
        return `This is an exceptional freelancer with a ${score}/100 AI score. ${
          data.firstName
        } has demonstrated consistent excellence with ${
          data.completedProjects
        } completed projects and a ${
          data.rating
        }/5 rating. They're positioned as a ${position.toLowerCase()} and would be an excellent choice for your project.`;
      } else if (score >= 70) {
        return `This is a solid professional with a ${score}/100 AI score. ${data.firstName} shows good performance with ${data.completedProjects} projects completed and maintains a ${data.rating}/5 rating. They're a reliable choice for most projects.`;
      } else {
        return `This freelancer shows potential with a ${score}/100 AI score. ${data.firstName} has completed ${data.completedProjects} projects with a ${data.rating}/5 rating. Consider them for smaller projects or if you're looking for emerging talent.`;
      }
    },
    [calculateOverallScore, generateMarketPosition]
  );

  const generateAIInsights = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate AI insights based on freelancer data
      const aiInsights = {
        overallScore: calculateOverallScore(freelancerData),
        strengths: generateStrengths(freelancerData),
        recommendations: generateRecommendations(freelancerData),
        marketPosition: generateMarketPosition(freelancerData),
        riskAssessment: generateRiskAssessment(freelancerData),
        bestFor: generateBestFor(freelancerData),
        aiSummary: generateAISummary(freelancerData),
      };

      setInsights(aiInsights);
    } catch (error) {
      console.error("Failed to generate AI insights:", error);
    } finally {
      setLoading(false);
    }
  }, [
    freelancerData,
    calculateOverallScore,
    generateStrengths,
    generateRecommendations,
    generateMarketPosition,
    generateRiskAssessment,
    generateBestFor,
    generateAISummary,
  ]);

  useEffect(() => {
    if (isOpen) {
      generateAIInsights();
    }
  }, [isOpen, generateAIInsights]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const insightsData = [
    {
      title: "AI Analysis",
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-600/20",
      content: insights?.aiSummary,
    },
    {
      title: "Strengths",
      icon: Zap,
      color: "text-green-400",
      bgColor: "bg-green-600/20",
      content: insights?.strengths,
    },
    {
      title: "Recommendations",
      icon: Target,
      color: "text-blue-400",
      bgColor: "bg-blue-600/20",
      content: insights?.recommendations,
    },
    {
      title: "Best For",
      icon: Award,
      color: "text-orange-400",
      bgColor: "bg-orange-600/20",
      content: insights?.bestFor,
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-gray-900 rounded-3xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-600">
                <Image
                  src={freelancerData.avatar || "/default-avatar.jpg"}
                  alt={`${freelancerData.firstName} ${freelancerData.lastName}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {freelancerData.firstName} {freelancerData.lastName}
                  </h2>
                  {freelancerData.role && (
                    <UserRoleBadge
                      role={freelancerData.role as any}
                      title={freelancerData.title}
                      isVerified={freelancerData.isVerified}
                      verificationBadge={freelancerData.verificationBadge}
                      size="md"
                    />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>{freelancerData.rating}/5</span>
                  </div>
                  <span>•</span>
                  <span>{freelancerData.completedProjects} projects</span>
                  <span>•</span>
                  <span>{freelancerData.responseTime} response</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  AI Analyzing Profile...
                </h3>
                <p className="text-gray-400">
                  Our AI is analyzing {freelancerData.firstName}&apos;s
                  performance, ratings, and market presence
                </p>
              </div>
            ) : insights ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-400/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">AI Score</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        {insights.overallScore}/100
                      </div>
                      <div className="text-sm text-gray-400">
                        {insights.marketPosition}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${insights.overallScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                    />
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {insights.aiSummary}
                  </p>
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insightsData.map((insight, index) => {
                    const IconComponent = insight.icon;

                    return (
                      <motion.div
                        key={insight.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${insight.bgColor} rounded-2xl p-4 border border-white/10`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent
                            className={`w-5 h-5 ${insight.color}`}
                          />
                          <h4 className="font-semibold text-white">
                            {insight.title}
                          </h4>
                        </div>

                        {Array.isArray(insight.content) ? (
                          <ul className="space-y-2">
                            {insight.content.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-sm text-gray-300"
                              >
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {insight.content}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Risk Assessment */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <insights.riskAssessment.icon
                        className={`w-5 h-5 ${insights.riskAssessment.color}`}
                      />
                      <h4 className="font-semibold text-white">
                        Risk Assessment
                      </h4>
                    </div>
                    <span
                      className={`font-semibold ${insights.riskAssessment.color}`}
                    >
                      {insights.riskAssessment.level} Risk
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {freelancerData.completionRate}%
                    </div>
                    <div className="text-xs text-gray-400">Completion Rate</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {freelancerData.completedProjects}
                    </div>
                    <div className="text-xs text-gray-400">Projects Done</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {formatPrice(freelancerData.totalEarnings)}
                    </div>
                    <div className="text-xs text-gray-400">Total Earnings</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {freelancerData.responseTime}
                    </div>
                    <div className="text-xs text-gray-400">Response Time</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <div className="text-sm text-gray-400">
              AI insights generated based on performance data and market
              analysis
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onContactFreelancer();
                  onClose();
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIFreelancerInsights;
