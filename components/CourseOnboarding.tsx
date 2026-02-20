"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  TrendingUp,
  Brain,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  color: string;
}

const CourseOnboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to Dealo Learning",
      description:
        "Discover your personalized learning journey with AI-powered course recommendations",
      icon: BookOpen,
      features: [
        "AI-powered course recommendations",
        "Personalized learning paths",
        "Interactive assessments",
        "Progress tracking",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "What interests you?",
      description:
        "Select the topics you&apos;d like to explore to get personalized recommendations",
      icon: Target,
      features: [
        "Technology & Programming",
        "Business & Marketing",
        "Design & Creative Arts",
        "Data Science & Analytics",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "What&apos;s your experience level?",
      description:
        "Help us understand your current skill level to recommend appropriate courses",
      icon: TrendingUp,
      features: [
        "Beginner - Just getting started",
        "Intermediate - Some experience",
        "Advanced - Looking to master skills",
        "Expert - Want to teach others",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      title: "What&apos;s your learning goal?",
      description:
        "Tell us what you want to achieve to create your perfect learning plan",
      icon: Award,
      features: [
        "Career advancement",
        "Learn new skills",
        "Start a side project",
        "Personal development",
      ],
      color: "from-orange-500 to-red-500",
    },
  ];

  const interests = [
    { id: "tech", name: "Technology", icon: "💻" },
    { id: "business", name: "Business", icon: "💼" },
    { id: "design", name: "Design", icon: "🎨" },
    { id: "marketing", name: "Marketing", icon: "📈" },
    { id: "data", name: "Data Science", icon: "📊" },
    { id: "writing", name: "Writing", icon: "✍️" },
    { id: "photography", name: "Photography", icon: "📸" },
    { id: "music", name: "Music", icon: "🎵" },
  ];

  const levels = [
    { id: "beginner", name: "Beginner", description: "Just getting started" },
    {
      id: "intermediate",
      name: "Intermediate",
      description: "Some experience",
    },
    {
      id: "advanced",
      name: "Advanced",
      description: "Looking to master skills",
    },
    { id: "expert", name: "Expert", description: "Want to teach others" },
  ];

  const goals = [
    {
      id: "career",
      name: "Career Advancement",
      description: "Move up in my current role",
    },
    {
      id: "skills",
      name: "Learn New Skills",
      description: "Expand my skill set",
    },
    {
      id: "project",
      name: "Start a Project",
      description: "Build something new",
    },
    {
      id: "personal",
      name: "Personal Growth",
      description: "Develop personally",
    },
  ];

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and redirect to courses
      router.push(
        `/courses?interests=${selectedInterests.join(
          ","
        )}&level=${selectedLevel}&goal=${selectedGoal}`
      );
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return selectedInterests.length > 0;
      case 2:
        return selectedLevel !== "";
      case 3:
        return selectedGoal !== "";
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-8">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Dealo Learning
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Let&apos;s create your personalized learning experience. This will
              only take a few minutes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {steps[0].features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              What interests you?
            </h2>
            <p className="text-gray-300 mb-8 text-center">
              Select all that apply
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedInterests.includes(interest.id)
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-4xl mb-3">{interest.icon}</div>
                  <div className="text-white font-semibold">
                    {interest.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              What&apos;s your experience level?
            </h2>
            <p className="text-gray-300 mb-8 text-center">
              Choose the level that best describes you
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedLevel === level.id
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-white font-semibold text-lg mb-2">
                    {level.name}
                  </div>
                  <div className="text-gray-300">{level.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              What&apos;s your learning goal?
            </h2>
            <p className="text-gray-300 mb-8 text-center">
              What do you want to achieve?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedGoal === goal.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-white font-semibold text-lg mb-2">
                    {goal.name}
                  </div>
                  <div className="text-gray-300">{goal.description}</div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/courses")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Skip onboarding and browse all courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default CourseOnboarding;
