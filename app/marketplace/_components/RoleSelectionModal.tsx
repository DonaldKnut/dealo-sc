"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  User,
  Building,
  Shield,
  X,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelected: (role: string, title: string) => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onRoleSelected,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSafeSession();

  const roles = [
    {
      id: "student",
      icon: GraduationCap,
      title: "Student",
      description: "Learning and building skills",
      color: "bg-blue-600",
      textColor: "text-blue-100",
      borderColor: "border-blue-500",
    },
    {
      id: "freelancer",
      icon: Briefcase,
      title: "Freelancer",
      description: "Offering services and skills",
      color: "bg-green-600",
      textColor: "text-green-100",
      borderColor: "border-green-500",
    },
    {
      id: "instructor",
      icon: User,
      title: "Instructor",
      description: "Teaching and mentoring others",
      color: "bg-purple-600",
      textColor: "text-purple-100",
      borderColor: "border-purple-500",
    },
    {
      id: "company",
      icon: Building,
      title: "Company",
      description: "Hiring talent and services",
      color: "bg-orange-600",
      textColor: "text-orange-100",
      borderColor: "border-orange-500",
    },
  ];

  const handleRoleSelect = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/users/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          title: customTitle || roles.find((r) => r.id === selectedRole)?.title,
        }),
      });

      if (response.ok) {
        onRoleSelected(
          selectedRole,
          customTitle || roles.find((r) => r.id === selectedRole)?.title || ""
        );
        onClose();
      }
    } catch (error) {
      console.error("Failed to set role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-3xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Choose Your Role
              </h2>
              <p className="text-gray-400 mt-1">
                Help others understand who you are on the platform
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <motion.button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? `${role.color} ${role.textColor} ${role.borderColor}`
                        : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-white/20" : "bg-white/10"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{role.title}</h3>
                        <p
                          className={`text-sm ${
                            isSelected ? "opacity-80" : "text-gray-400"
                          }`}
                        >
                          {role.description}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Selected</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Custom Title Input */}
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <label className="block text-white font-medium mb-2">
                  Custom Title (Optional)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={`e.g., "Senior Developer", "Marketing Expert", "UI/UX Designer"`}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-gray-400 text-sm mt-2">
                  This will appear next to your name in the marketplace
                </p>
              </motion.div>
            )}

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-4 border border-green-400/30"
            >
              <h3 className="font-semibold text-white mb-2">
                Why choose a role?
              </h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Helps others understand your expertise</li>
                <li>• Improves your visibility in search results</li>
                <li>• Builds trust with potential clients</li>
                <li>• Enables role-specific features and tools</li>
              </ul>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              You can change this later in your profile settings
            </p>
            <button
              onClick={handleRoleSelect}
              disabled={!selectedRole || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoleSelectionModal;
