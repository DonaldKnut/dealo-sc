"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeSession } from "@/hooks/use-safe-session";
import {
  User,
  Briefcase,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Zap,
  Target,
  Users,
} from "lucide-react";

interface OnboardingData {
  role: string;
  interests: string[];
  experience: string;
  goals: string[];
  availability: string;
}

const OnboardingPage = () => {
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    role: "",
    interests: [],
    experience: "",
    goals: [],
    availability: "",
  });

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Learning and building skills",
      icon: BookOpen,
    },
    {
      id: "freelancer",
      title: "Freelancer",
      description: "Offering services and expertise",
      icon: Briefcase,
    },
    {
      id: "instructor",
      title: "Instructor",
      description: "Teaching and mentoring others",
      icon: Award,
    },
    {
      id: "professional",
      title: "Professional",
      description: "Career development and growth",
      icon: User,
    },
  ];

  const interests = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Design",
    "Marketing",
    "Business",
    "AI/ML",
    "Cybersecurity",
    "DevOps",
    "Product Management",
  ];

  const goals = [
    "Learn new skills",
    "Earn certifications",
    "Find freelance work",
    "Build a portfolio",
    "Network with professionals",
    "Advance my career",
    "Start a business",
    "Teach others",
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Onboarding failed");
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleArrayField = (field: keyof OnboardingData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? (prev[field] as string[]).filter((item) => item !== value)
        : [...(prev[field] as string[]), value],
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Dealo!
            </h2>
            <p className="text-gray-400 mb-8">
              Let&apos;s get to know you better to personalize your experience
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === role.id
                      ? "border-[#70f69ae1] bg-[#70f69ae1]/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                  onClick={() => updateFormData("role", role.id)}
                >
                  <role.icon className="h-8 w-8 text-[#70f69ae1] mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{role.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              What interests you?
            </h2>
            <p className="text-gray-400 mb-8">
              Select the areas you&apos;d like to explore or work in
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map((interest) => (
                <motion.button
                  key={interest}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg border transition-all ${
                    formData.interests.includes(interest)
                      ? "border-[#70f69ae1] bg-[#70f69ae1]/10 text-[#70f69ae1]"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                  }`}
                  onClick={() => toggleArrayField("interests", interest)}
                >
                  {interest}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              What&apos;s your experience level?
            </h2>
            <p className="text-gray-400 mb-8">
              This helps us recommend the right content for you
            </p>
            <div className="space-y-4">
              {[
                {
                  value: "beginner",
                  label: "Beginner",
                  desc: "New to the field",
                },
                {
                  value: "intermediate",
                  label: "Intermediate",
                  desc: "Some experience",
                },
                {
                  value: "advanced",
                  label: "Advanced",
                  desc: "Experienced professional",
                },
                { value: "expert", label: "Expert", desc: "Industry expert" },
              ].map((level) => (
                <motion.div
                  key={level.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.experience === level.value
                      ? "border-[#70f69ae1] bg-[#70f69ae1]/10"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                  onClick={() => updateFormData("experience", level.value)}
                >
                  <h3 className="text-white font-semibold">{level.label}</h3>
                  <p className="text-gray-400 text-sm">{level.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              What are your goals?
            </h2>
            <p className="text-gray-400 mb-8">
              Select what you want to achieve on Dealo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goals.map((goal) => (
                <motion.button
                  key={goal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.goals.includes(goal)
                      ? "border-[#70f69ae1] bg-[#70f69ae1]/10 text-[#70f69ae1]"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                  }`}
                  onClick={() => toggleArrayField("goals", goal)}
                >
                  {goal}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              You&apos;re all set!
            </h2>
            <p className="text-gray-400 mb-8">
              Let&apos;s get you started on your journey
            </p>
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Your Profile Summary
              </h3>
              <div className="space-y-3 text-left">
                <div>
                  <span className="text-gray-400">Role:</span>
                  <span className="text-white ml-2">{formData.role}</span>
                </div>
                <div>
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white ml-2">{formData.experience}</span>
                </div>
                <div>
                  <span className="text-gray-400">Interests:</span>
                  <span className="text-white ml-2">
                    {formData.interests.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Goals:</span>
                  <span className="text-white ml-2">
                    {formData.goals.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">
              Step {currentStep} of 5
            </span>
            <span className="text-sm text-gray-400">
              {Math.round((currentStep / 5) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={currentStep === 5 ? handleSubmit : handleNext}
            className="px-8 py-3 bg-gradient-to-r from-[#70f69ae1] to-[#5dd885] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#70f69ae1]/25 transition-all"
          >
            {currentStep === 5 ? "Get Started" : "Next"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
