"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building,
  Users,
  Target,
  Clock,
  Briefcase,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  Award,
  MessageSquare,
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Welcome",
    description: "Let's get you started with bulk hiring",
    icon: Building,
  },
  {
    id: 2,
    title: "Your Needs",
    description: "Tell us about your hiring requirements",
    icon: Target,
  },
  {
    id: 3,
    title: "Team Details",
    description: "Specify the team size and skills needed",
    icon: Users,
  },
  {
    id: 4,
    title: "Timeline & Budget",
    description: "When and how much",
    icon: Clock,
  },
  {
    id: 5,
    title: "Review",
    description: "Review and submit your request",
    icon: CheckCircle,
  },
];

const hiringTypes = [
  {
    id: "full-time",
    title: "Full-Time Teams",
    description: "Permanent employees for long-term growth",
    icon: Briefcase,
    color: "from-green-400 to-green-600",
  },
  {
    id: "project-based",
    title: "Project-Based",
    description: "Specialists for specific projects",
    icon: Target,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "outsourcing",
    title: "Full Outsourcing",
    description: "Complete department management",
    icon: Globe,
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "contract",
    title: "Contract Teams",
    description: "Temporary teams for seasonal needs",
    icon: Clock,
    color: "from-orange-400 to-orange-600",
  },
];

const industries = [
  "Technology & IT",
  "Finance & Banking",
  "Healthcare",
  "E-commerce",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Marketing & Advertising",
  "Hospitality",
  "Logistics",
  "Other",
];

const teamSizes = [
  "5-10 professionals",
  "11-25 professionals",
  "26-50 professionals",
  "51+ professionals",
];

export default function BulkHiringOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    hiringType: "",
    teamSize: "",
    skills: "",
    timeline: "",
    budget: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.contactName && formData.email;
      case 2:
        return formData.industry && formData.hiringType;
      case 3:
        return formData.teamSize && formData.skills;
      case 4:
        return formData.timeline;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/bulk-hiring/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/employment/bulk-hiring/payment/success");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header with Progress */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Bulk Hiring Onboarding
              </h1>
              <span className="text-sm text-gray-400">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="hidden md:flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="flex items-center flex-1"
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  style={{ cursor: currentStep > step.id ? "pointer" : "default" }}
                >
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-green-500 text-white ring-4 ring-green-500/20"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        isActive ? "text-white font-medium" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        isCompleted ? "bg-green-500" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome & Company Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Welcome to Bulk Hiring
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Let's get to know your company and create a tailored hiring
                  solution for you
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-medium">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="company@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Hiring Type & Industry */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  What Type of Hiring?
                </h2>
                <p className="text-xl text-gray-300">
                  Select the hiring model that fits your business needs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {hiringTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.hiringType === type.id;

                  return (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, hiringType: type.id }))
                      }
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-500/10"
                          : "border-white/20 bg-white/5 hover:border-green-500/50"
                      }`}
                    >
                      <div
                        className={`w-14 h-14 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4 text-white`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {type.title}
                      </h3>
                      <p className="text-gray-300 text-sm">{type.description}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-4 flex items-center text-green-400"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">Selected</span>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Industry *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">
                    Select your industry
                  </option>
                  {industries.map((industry) => (
                    <option
                      key={industry}
                      value={industry}
                      className="bg-gray-800"
                    >
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 3: Team Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Team Requirements
                </h2>
                <p className="text-xl text-gray-300">
                  Tell us about the team size and skills you need
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-medium">
                    Team Size Needed *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {teamSizes.map((size) => {
                      const isSelected = formData.teamSize === size;
                      return (
                        <motion.button
                          key={size}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, teamSize: size }))
                          }
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? "border-green-500 bg-green-500/10 text-white"
                              : "border-white/20 bg-white/5 text-gray-300 hover:border-green-500/50"
                          }`}
                        >
                          <Users className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">{size}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">
                    Required Skills *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., JavaScript, React, Node.js, Project Management"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Separate multiple skills with commas
                  </p>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about your project, team requirements, and any specific needs..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Timeline & Budget */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Timeline & Budget
                </h2>
                <p className="text-xl text-gray-300">
                  When do you need the team and what's your budget?
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-medium">
                    Timeline *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: "urgent", label: "Urgent (1-2 weeks)", icon: Zap },
                      { value: "1-month", label: "Within 1 month", icon: Clock },
                      {
                        value: "2-3-months",
                        label: "2-3 months",
                        icon: TrendingUp,
                      },
                      {
                        value: "flexible",
                        label: "Flexible",
                        icon: MessageSquare,
                      },
                    ].map((option) => {
                      const Icon = option.icon;
                      const isSelected = formData.timeline === option.value;

                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              timeline: option.value,
                            }))
                          }
                          className={`p-6 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-green-500 bg-green-500/10"
                              : "border-white/20 bg-white/5 hover:border-green-500/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                isSelected
                                  ? "bg-green-500 text-white"
                                  : "bg-white/10 text-gray-400"
                              }`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-white font-medium">
                              {option.label}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">
                    Budget Range (Optional)
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., ₦1,000,000 - ₦5,000,000"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    This helps us provide a more accurate quote
                  </p>
                </div>

                {/* Benefits Preview */}
                <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/20">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-400" />
                    What You Get
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: Shield, text: "Pre-vetted professionals" },
                      { icon: Zap, text: "Fast deployment" },
                      { icon: TrendingUp, text: "60% cost savings" },
                    ].map((benefit, idx) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">
                            {benefit.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Review Your Request
                </h2>
                <p className="text-xl text-gray-300">
                  Please review all information before submitting
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-green-400" />
                      Company Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Company:</span>
                        <span className="text-white ml-2">
                          {formData.companyName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Contact:</span>
                        <span className="text-white ml-2">
                          {formData.contactName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white ml-2">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white ml-2">{formData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      Hiring Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Industry:</span>
                        <span className="text-white ml-2">
                          {formData.industry}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white ml-2 capitalize">
                          {formData.hiringType.replace("-", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Team Size:</span>
                        <span className="text-white ml-2">
                          {formData.teamSize}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Timeline:</span>
                        <span className="text-white ml-2 capitalize">
                          {formData.timeline.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Skills & Description
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Skills:</span>
                      <span className="text-white ml-2">{formData.skills}</span>
                    </div>
                    {formData.description && (
                      <div>
                        <span className="text-gray-400">Description:</span>
                        <p className="text-white mt-2">{formData.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {formData.budget && (
                  <div className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-300 text-sm">Budget Range</span>
                        <p className="text-white font-bold text-lg mt-1">
                          {formData.budget}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl hover:shadow-green-500/25"
                >
                  <MessageSquare className="w-5 h-5" />
                  Submit Request
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-gray-400 text-sm">
                  Our team will review your request and get back to you within 24
                  hours
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStep === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                canProceed()
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/25"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <Link
              href="/employment/bulk-hiring"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all"
            >
              Skip to Full Page
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


