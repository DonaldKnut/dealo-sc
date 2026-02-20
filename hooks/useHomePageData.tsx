"use client";

import { useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Users,
  Zap,
  Code,
  Palette,
  Megaphone,
  BarChart3,
  Cpu,
  Shield,
  BookOpen,
  Star,
  DollarSign,
} from "lucide-react";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
}

interface Stat {
  number: string;
  label: string;
  icon: JSX.Element;
}

interface Category {
  name: string;
  icon: JSX.Element;
  color: string;
}

/**
 * useHomePageData - Centralized hook for homepage data
 * Prevents duplication and provides consistent data structure
 */
export function useHomePageData() {
  // Show content immediately; no artificial delay so the page doesn't appear stuck
  const [isLoading, setIsLoading] = useState(false);

  const features: Feature[] = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description: "Personalized courses and certifications with AI assessment",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Freelance Marketplace",
      description: "Connect with clients and grow your business globally",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Professional Network",
      description: "Build meaningful connections and expand your network",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Tools & Resources",
      description: "Access cutting-edge AI tools to enhance your work",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats: Stat[] = [
    {
      number: "50K+",
      label: "Active Professionals",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "10K+",
      label: "Courses Available",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <Star className="w-6 h-6" />,
    },
    {
      number: "₦500M+",
      label: "Earnings Generated",
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  const categories: Category[] = [
    {
      name: "Programming",
      icon: <Code className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      name: "Design",
      icon: <Palette className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      name: "Marketing",
      icon: <Megaphone className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      name: "Business",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "bg-orange-500",
    },
    {
      name: "AI & Data",
      icon: <Cpu className="w-6 h-6" />,
      color: "bg-red-500",
    },
    {
      name: "Cybersecurity",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-indigo-500",
    },
  ];

  return {
    isLoading,
    features,
    stats,
    categories,
  };
}

