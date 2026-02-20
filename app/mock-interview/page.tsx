"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Star,
  Clock,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  Loader2,
} from "lucide-react";

const MockInterviewPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths?",
    "Describe a challenging project you worked on.",
    "Where do you see yourself in 5 years?",
    "Why do you want to work for our company?",
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsRecording(false);
    setIsPlaying(false);
    setIsAnalyzing(false);
    setCurrentQuestion(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Mock Interview Practice
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Practice your interview skills with AI-powered feedback and improve
            your confidence for real interviews.
          </p>
        </motion.div>

        {/* Main Interview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {questions[currentQuestion]}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recording Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleStartRecording}
                  disabled={isRecording || isAnalyzing}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
                <Button
                  onClick={handleStopRecording}
                  disabled={!isRecording}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full"
                >
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              </div>

              {/* Recording Status */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-red-400">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    Recording in progress...
                  </div>
                </motion.div>
              )}

              {/* Analysis Status */}
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your
                    response...
                  </div>
                </motion.div>
              )}

              {/* Playback Controls */}
              {!isRecording && !isAnalyzing && (
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handlePlayPause}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 mr-2" />
                    ) : (
                      <Play className="w-5 h-5 mr-2" />
                    )}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
              )}

              {/* Question Navigation */}
              <div className="flex justify-between">
                <Button
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  }
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentQuestion(
                      Math.min(questions.length - 1, currentQuestion + 1)
                    )
                  }
                  disabled={currentQuestion === questions.length - 1}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                AI Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Get detailed feedback on your answers, including suggestions for
                improvement and areas of strength.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Time Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Practice answering questions within realistic time limits to
                improve your pacing and delivery.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Track your improvement over time with detailed analytics and
                performance metrics.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Promotions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Get Certified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">
                Boost your profile with in-demand certifications.
              </p>
              <a
                href="/certifications/explore"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Explore Certifications
              </a>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Create a Course</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">
                Attract learners by publishing your own course.
              </p>
              <a
                href="/dealoforge/create-course"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Start Creating
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MockInterviewPage;
