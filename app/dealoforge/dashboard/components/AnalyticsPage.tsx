"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Clock,
  DollarSign,
  Target,
} from "lucide-react";

const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [topSkills, setTopSkills] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real analytics data from API
    const fetchAnalytics = async () => {
      try {
        // These endpoints would need to be created
        // const res = await fetch("/api/dashboard/analytics");
        // const data = await res.json();
        // setMetrics(data.metrics || []);
        // setWeeklyData(data.weeklyData || []);
        // setTopSkills(data.topSkills || []);
        // setGoals(data.goals || []);
        // setAchievements(data.achievements || []);
        
        // For now, set empty arrays
        setMetrics([]);
        setWeeklyData([]);
        setTopSkills([]);
        setGoals([]);
        setAchievements([]);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">
          Track your learning progress and performance
        </p>
      </div>

      {/* Metrics Grid */}
      {metrics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{metric.title}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p
                  className={`text-sm ${
                    metric.changeType === "positive"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {metric.change} from last month
                </p>
              </div>
              <metric.icon className={`w-8 h-8 ${metric.color}`} />
            </div>
          </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700 text-center">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-12 h-12 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Analytics Not Created Yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Be the first to start learning! Your analytics will appear here once you begin taking courses and earning certifications.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dealoforge/dashboard?page=courses"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Start Learning
            </a>
            <a
              href="/dealoforge/dashboard?page=certifications"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Earn Certifications
            </a>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {weeklyData.length > 0 || topSkills.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          {weeklyData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Weekly Activity
              </h3>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-12 text-gray-400 text-sm">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-white text-sm">
                          {day.hours}h learning
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(day.hours / 8) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skills Progress */}
          {topSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Top Skills</h3>
              <div className="space-y-4">
                {topSkills.map((skill, index) => (
                  <div key={skill.skill}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{skill.skill}</span>
                      <span className="text-gray-400 text-sm">
                        {skill.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`${skill.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Weekly Activity Not Created Yet</h3>
            <p className="text-gray-400 text-sm mb-4">Start learning to see your weekly activity chart</p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Skills Progress Not Created Yet</h3>
            <p className="text-gray-400 text-sm mb-4">Complete courses to track your skill development</p>
          </div>
        </div>
      )}

      {/* Goals Section */}
      {goals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Learning Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((goal, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-white font-medium mb-1">{goal.title}</h4>
                <p className="text-gray-400 text-sm">{goal.progress}% completed</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Learning Goals Not Created Yet</h3>
          <p className="text-gray-400 mb-4">Be the first to set learning goals and track your progress</p>
          <a
            href="/dealoforge/dashboard?page=courses"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Set Your First Goal
          </a>
        </div>
      )}

      {/* Recent Achievements */}
      {achievements.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Recent Achievements
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{achievement.title}</h4>
                  <p className="text-gray-400 text-sm">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Achievements Not Created Yet</h3>
          <p className="text-gray-400 mb-4">Be the first to earn achievements by completing courses and reaching milestones</p>
          <a
            href="/dealoforge/dashboard?page=certifications"
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Start Earning Achievements
          </a>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
