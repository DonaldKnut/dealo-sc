"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Target, 
  Award,
  ArrowRight,
  CheckCircle,
  Zap,
  Users,
  BarChart3,
  Shield
} from "lucide-react";

const AIFreelancerInsightsAdvertisement: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get instant insights about freelancer performance, reliability, and expertise",
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-600/20",
      borderColor: "border-purple-400/30",
    },
    {
      icon: Target,
      title: "Smart Recommendations",
      description: "AI suggests the perfect freelancer for your specific project needs",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-600/20",
      borderColor: "border-green-400/30",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Know the risk level before hiring with our intelligent risk analysis",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-600/20",
      borderColor: "border-orange-400/30",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track freelancer success rates, completion times, and client satisfaction",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-600/20",
      borderColor: "border-blue-400/30",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Freelancers Analyzed",
      color: "text-blue-400",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Accuracy Rate",
      color: "text-green-400",
    },
    {
      icon: Award,
      value: "₦2M+",
      label: "Saved in Bad Hires",
      color: "text-purple-400",
    },
    {
      icon: Zap,
      value: "2.3s",
      label: "Analysis Time",
      color: "text-yellow-400",
    },
  ];

  const benefits = [
    "Reduce hiring time by 70%",
    "Minimize project risks",
    "Increase project success rates",
    "Save money on bad hires",
    "Get data-driven insights",
    "Access real-time analytics",
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Hire Smarter with{" "}
            <span className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] bg-clip-text text-transparent">
              AI Insights
            </span>
          </h2>
          <p className="text-body-large text-gray-300 max-w-3xl mx-auto font-body mb-8">
            Make data-driven hiring decisions with our AI-powered freelancer analysis. Get instant insights on performance, reliability, and project fit.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
          <motion.div
              key={feature.title}
              className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-[#70f69ae1]/50 transition-all duration-300 group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-h4 text-white mb-4 font-ui">
                {feature.title}
              </h3>
              <p className="text-body text-gray-400 font-body">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Demo Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-8">
                See AI Insights in Action
            </h3>
              <div className="space-y-6">
                {features.map((feature, index) => (
                <motion.div
                  key={index}
                    className={`p-6 rounded-xl border ${feature.bgColor} ${feature.borderColor} cursor-pointer transition-all duration-300 ${
                      currentFeature === index ? 'ring-2 ring-[#70f69ae1]' : ''
                    }`}
                  onClick={() => setCurrentFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                        <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
              </motion.div>
            ))}
                    </div>
                  </div>

          {/* Right Side - Demo/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Mock AI Analysis Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white">AI Analysis Complete</h4>
                  <p className="text-gray-400 text-sm">Sarah Johnson - Web Developer</p>
                </div>
              </div>

              {/* AI Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">AI Score</span>
                  <span className="text-2xl font-bold text-green-400">92/100</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                  />
                </div>
              </div>

              {/* Insights */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm">Top-tier freelancer</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm">98% completion rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm">Perfect for React projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white text-sm">Low risk assessment</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-6 p-4 bg-green-600/20 border border-green-400/30 rounded-xl">
                <p className="text-green-400 text-sm font-medium">
                  💡 AI Recommendation: Excellent choice for complex web development projects
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Star className="w-4 h-4 text-yellow-800 fill-current" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
        </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Why Choose AI-Powered Insights?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl border border-purple-400/30 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Make Smarter Hiring Decisions?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of clients who trust our AI to find the perfect freelancer for their projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                Try AI Insights
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIFreelancerInsightsAdvertisement;