"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  X,
  Star,
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  Award,
} from "lucide-react";
import AIFreelancerInsights from "./AIFreelancerInsights";

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

interface FreelancerInsightsTriggerProps {
  freelancerData: FreelancerData;
  onContactFreelancer: () => void;
  triggerDelay?: number; // Delay before showing the modal (in ms)
}

const FreelancerInsightsTrigger: React.FC<FreelancerInsightsTriggerProps> = ({
  freelancerData,
  onContactFreelancer,
  triggerDelay = 3000, // 3 seconds default
}) => {
  const [showTrigger, setShowTrigger] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only show if user has viewed the freelancer's content for a while
    const timer = setTimeout(() => {
      if (!hasShown) {
        setShowTrigger(true);
      }
    }, triggerDelay);

    return () => clearTimeout(timer);
  }, [triggerDelay, hasShown]);

  const handleYes = () => {
    setShowTrigger(false);
    setShowInsights(true);
    setHasShown(true);
  };

  const handleNo = () => {
    setShowTrigger(false);
    setHasShown(true);
  };

  const handleCloseInsights = () => {
    setShowInsights(false);
  };

  return (
    <>
      {/* Trigger Modal */}
      <AnimatePresence>
        {showTrigger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-sm rounded-3xl border border-purple-400/30 w-full max-w-md p-8 text-center"
            >
              {/* Animated Brain Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Brain className="w-10 h-10 text-white" />
              </motion.div>

              {/* Sparkles Animation */}
              <div className="relative mb-6">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + (i % 2) * 20}px`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                Wanna know more about{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  {freelancerData.firstName}?
                </span>
              </h2>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Our AI has analyzed {freelancerData.firstName}&apos;s profile,
                ratings, and performance. Get intelligent insights about their
                expertise, reliability, and market position.
              </p>

              {/* Quick Stats Preview */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {freelancerData.rating}/5
                  </div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {freelancerData.completedProjects}
                  </div>
                  <div className="text-xs text-gray-400">Projects</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {freelancerData.completionRate}%
                  </div>
                  <div className="text-xs text-gray-400">Success</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleNo}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleYes}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Yes, Tell Me More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={handleNo}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights Modal */}
      <AIFreelancerInsights
        isOpen={showInsights}
        onClose={handleCloseInsights}
        freelancerData={freelancerData}
        onContactFreelancer={onContactFreelancer}
      />
    </>
  );
};

export default FreelancerInsightsTrigger;
