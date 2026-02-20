"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  User,
  Building,
  Shield,
  CheckCircle,
  Star,
  Award,
  Zap,
} from "lucide-react";

interface UserRoleBadgeProps {
  role: "student" | "freelancer" | "instructor" | "company" | "admin";
  title?: string;
  isVerified?: boolean;
  verificationBadge?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  role,
  title,
  isVerified = false,
  verificationBadge,
  size = "md",
  showIcon = true,
}) => {
  const getRoleConfig = () => {
    switch (role) {
      case "student":
        return {
          icon: GraduationCap,
          label: "Student",
          bgColor: "bg-blue-600",
          textColor: "text-blue-100",
          borderColor: "border-blue-500",
        };
      case "freelancer":
        return {
          icon: Briefcase,
          label: "Freelancer",
          bgColor: "bg-green-600",
          textColor: "text-green-100",
          borderColor: "border-green-500",
        };
      case "instructor":
        return {
          icon: User,
          label: "Instructor",
          bgColor: "bg-purple-600",
          textColor: "text-purple-100",
          borderColor: "border-purple-500",
        };
      case "company":
        return {
          icon: Building,
          label: "Company",
          bgColor: "bg-orange-600",
          textColor: "text-orange-100",
          borderColor: "border-orange-500",
        };
      case "admin":
        return {
          icon: Shield,
          label: "Admin",
          bgColor: "bg-red-600",
          textColor: "text-red-100",
          borderColor: "border-red-500",
        };
      default:
        return {
          icon: User,
          label: "User",
          bgColor: "bg-gray-600",
          textColor: "text-gray-100",
          borderColor: "border-gray-500",
        };
    }
  };

  const getVerificationConfig = () => {
    switch (verificationBadge) {
      case "Verified":
        return { icon: CheckCircle, color: "text-blue-400" };
      case "Top Rated":
        return { icon: Star, color: "text-yellow-400" };
      case "Pro":
        return { icon: Award, color: "text-purple-400" };
      case "Expert":
        return { icon: Zap, color: "text-green-400" };
      case "Elite":
        return { icon: Star, color: "text-gold-400" };
      default:
        return { icon: CheckCircle, color: "text-gray-400" };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          container: "px-2 py-1 text-xs",
          icon: "w-3 h-3",
          text: "text-xs",
        };
      case "lg":
        return {
          container: "px-4 py-2 text-sm",
          icon: "w-5 h-5",
          text: "text-sm",
        };
      default: // md
        return {
          container: "px-3 py-1.5 text-sm",
          icon: "w-4 h-4",
          text: "text-sm",
        };
    }
  };

  const roleConfig = getRoleConfig();
  const verificationConfig = getVerificationConfig();
  const sizeClasses = getSizeClasses();
  const IconComponent = roleConfig.icon;

  return (
    <div className="flex items-center gap-2">
      {/* Role Badge */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center gap-1.5 ${roleConfig.bgColor} ${roleConfig.textColor} ${sizeClasses.container} rounded-full border ${roleConfig.borderColor} font-medium`}
      >
        {showIcon && <IconComponent className={sizeClasses.icon} />}
        <span className={sizeClasses.text}>{title || roleConfig.label}</span>
      </motion.div>

      {/* Verification Badge */}
      {isVerified && verificationBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-1 ${verificationConfig.color} ${sizeClasses.container} bg-white/10 backdrop-blur-sm rounded-full border border-white/20`}
        >
          <verificationConfig.icon className={sizeClasses.icon} />
          <span className={`${sizeClasses.text} font-medium`}>
            {verificationBadge}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default UserRoleBadge;