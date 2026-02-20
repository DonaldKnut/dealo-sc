"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Video,
  Mic,
  Brain,
  Target,
  Award,
  Play,
  Users,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  MessageCircle,
  Camera,
  Volume2,
} from "lucide-react";

const MockInterviewAdvert = () => {
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const interviewFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Questions",
      description: "Adaptive questions based on your responses",
      color: "from-purple-500 to-blue-500",
      benefits: [
        "Dynamic questioning",
        "Industry-specific",
        "Real-time analysis",
      ],
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Webcam Integration",
      description: "Practice with real video interview simulation",
      color: "from-blue-500 to-cyan-500",
      benefits: [
        "Face-to-face practice",
        "Body language feedback",
        "Professional setup",
      ],
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Recognition",
      description: "Natural speech interaction with AI interviewer",
      color: "from-green-500 to-emerald-500",
      benefits: ["Speech analysis", "Confidence scoring", "Fluency assessment"],
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Detailed feedback and improvement suggestions",
      color: "from-orange-500 to-red-500",
      benefits: [
        "Weakness identification",
        "Strength highlighting",
        "Progress tracking",
      ],
    },
  ];

  const interviewTypes = [
    {
      name: "Technical Interviews",
      icon: "💻",
      count: "500+",
      description: "Coding, system design, algorithms",
    },
    {
      name: "Behavioral Interviews",
      icon: "🤝",
      count: "300+",
      description: "STAR method, leadership, teamwork",
    },
    {
      name: "Case Studies",
      icon: "📊",
      count: "200+",
      description: "Business cases, problem solving",
    },
    {
      name: "Industry Specific",
      icon: "🏢",
      count: "400+",
      description: "Finance, healthcare, tech, consulting",
    },
  ];

  const successStories = [
    {
      name: "Alex Chen",
      role: "Software Engineer",
      company: "Google",
      improvement: "+85%",
      avatar: "👨‍💻",
      testimonial:
        "The AI mock interview helped me land my dream job at Google!",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "Microsoft",
      improvement: "+92%",
      avatar: "👩‍💼",
      testimonial:
        "Perfect practice for behavioral questions. Highly recommend!",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Data Scientist",
      company: "Amazon",
      improvement: "+78%",
      avatar: "👨‍🔬",
      testimonial: "The technical questions were spot-on for my field.",
      rating: 5,
    },
  ];

  const interviewProcess = [
    {
      step: "01",
      title: "Choose Your Role",
      description: "Select your target position and industry",
      icon: <Target className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02",
      title: "Enable Camera & Mic",
      description: "Set up your webcam and microphone",
      icon: <Camera className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      step: "03",
      title: "Start Interview",
      description: "AI asks questions, you respond naturally",
      icon: <Play className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      step: "04",
      title: "Get Feedback",
      description: "Receive detailed analysis and tips",
      icon: <Award className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
    },
  ];

  const mockInterviewData = [
    {
      question: "Tell me about a challenging project you worked on",
      category: "Behavioral",
      difficulty: "Medium",
      timeLimit: "3 min",
    },
    {
      question: "How would you optimize this algorithm?",
      category: "Technical",
      difficulty: "Hard",
      timeLimit: "5 min",
    },
    {
      question: "Describe your leadership experience",
      category: "Leadership",
      difficulty: "Medium",
      timeLimit: "2 min",
    },
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
            Ace Interviews with{" "}
            <span className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] bg-clip-text text-transparent">
              AI Practice
            </span>
          </h2>
          <p className="text-body-large text-gray-300 max-w-3xl mx-auto font-body mb-8">
            Practice with AI-powered mock interviews featuring real-time
            feedback, webcam integration, and adaptive questioning to boost your
            confidence and performance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/mock-interview")}
              className="flex items-center gap-3 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <Video className="w-5 h-5" />
              Start Mock Interview
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/mock-interview")}
              className="flex items-center gap-3 border-2 border-[#70f69ae1] text-[#70f69ae1] px-8 py-4 rounded-xl font-semibold hover:bg-[#70f69ae1] hover:text-white transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {interviewFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-[#70f69ae1]/50 transition-all duration-300 group cursor-pointer"
              onClick={() => router.push("/mock-interview")}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-h4 text-white mb-4 font-ui">
                {feature.title}
              </h3>
              <p className="text-body text-gray-400 font-body mb-4">
                {feature.description}
              </p>
              <div className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#70f69ae1]" />
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interview Types */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Interview Types Available
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {interviewTypes.map((type, index) => (
              <motion.div
                key={type.name}
                className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
                onClick={() =>
                  router.push(`/mock-interview?type=${type.name.toLowerCase()}`)
                }
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <h4 className="text-white font-semibold mb-2">{type.name}</h4>
                <p className="text-gray-400 text-sm mb-3">{type.description}</p>
                <div className="text-[#70f69ae1] font-semibold text-sm">
                  {type.count} Questions
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mock Interview Preview */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Sample Interview Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockInterviewData.map((question, index) => (
              <motion.div
                key={question.question}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-[#70f69ae1]/50 transition-all duration-300 group cursor-pointer"
                onClick={() => router.push("/mock-interview")}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#70f69ae1]/20 text-[#70f69ae1] text-sm rounded-full">
                    {question.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {question.timeLimit}
                  </span>
                </div>

                <h4 className="text-white font-semibold mb-3 group-hover:text-[#70f69ae1] transition-colors">
                  {question.question}
                </h4>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        question.difficulty === "Easy"
                          ? "bg-green-500"
                          : question.difficulty === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-gray-400 text-sm">
                      {question.difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interview Process */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {interviewProcess.map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{step.icon}</div>
                </div>
                <div className="text-[#70f69ae1] font-bold text-lg mb-2">
                  {step.step}
                </div>
                <h4 className="text-white font-semibold mb-3">{step.title}</h4>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{story.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{story.name}</h4>
                    <p className="text-gray-400 text-sm">{story.role}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-white font-semibold mb-1">
                    {story.company}
                  </h5>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">
                      {story.rating}/5
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 text-sm italic">
                  &ldquo;{story.testimonial}&rdquo;
                </p>

                <div className="text-center">
                  <div className="text-[#70f69ae1] font-bold text-xl">
                    {story.improvement}
                  </div>
                  <div className="text-gray-400 text-sm">Confidence Boost</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="bg-gradient-to-r from-[#70f69ae1]/10 to-[#5dd885]/10 rounded-3xl p-12 border border-[#70f69ae1]/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#70f69ae1] mb-2">
                10K+
              </div>
              <div className="text-gray-300">Interviews Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#70f69ae1] mb-2">
                85%
              </div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#70f69ae1] mb-2">
                1.4K+
              </div>
              <div className="text-gray-300">Questions Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#70f69ae1] mb-2">
                4.9
              </div>
              <div className="text-gray-300">User Rating</div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their interview
            skills and landed their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/mock-interview")}
              className="flex items-center gap-3 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <Video className="w-5 h-5" />
              Start Your Mock Interview
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/certifications/explore")}
              className="flex items-center gap-3 border-2 border-[#70f69ae1] text-[#70f69ae1] px-8 py-4 rounded-xl font-semibold hover:bg-[#70f69ae1] hover:text-white transition-all duration-300"
            >
              <Award className="w-5 h-5" />
              Get Certified First
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MockInterviewAdvert;
