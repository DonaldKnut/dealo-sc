"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/components/ui/Notification";
import AuthInput from "@/components/ui/AuthInput";
import Link from "next/link";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const [isResetStep, setIsResetStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { addNotification } = useNotification();

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleForgotPassword = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      console.log("Requesting password reset for:", values.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      addNotification({
        type: "success",
        message: "Password reset link sent to your email! Check your inbox.",
      });
      setIsResetStep(true);
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to send password reset link. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      console.log("Resetting password:", values.newPassword);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      addNotification({
        type: "success",
        message: "Password reset successfully! Redirecting to sign in...",
      });

      // Redirect to sign in after a delay
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
      }, 2000);
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: "backOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <motion.div
          variants={iconVariants}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl overflow-hidden"
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400 mb-3">
          {isResetStep ? "Reset Password" : "Forgot Password?"}
        </h1>
        <p className="text-gray-200 text-lg">
          {isResetStep
            ? "Create a new secure password for your account"
            : "Enter your email to receive a password reset link"}
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        variants={itemVariants}
        className="w-full"
      >
        <AnimatePresence mode="wait">
          {!isResetStep ? (
            <motion.form
              key="forgot-password"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onSubmit={forgotPasswordForm.handleSubmit(
                handleForgotPassword
              )}
              className="space-y-6"
            >
              <AuthInput
                label="Email Address"
                icon={Mail}
                {...forgotPasswordForm.register("email")}
                type="email"
                placeholder="Enter your email address"
                error={
                  forgotPasswordForm.formState.errors.email?.message
                }
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="reset-password"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
              className="space-y-6"
            >
              <AuthInput
                label="New Password"
                icon={Lock}
                {...resetPasswordForm.register("newPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                error={
                  resetPasswordForm.formState.errors.newPassword?.message
                }
                showPasswordToggle={true}
                isPasswordVisible={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <AuthInput
                label="Confirm Password"
                icon={Lock}
                {...resetPasswordForm.register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                error={
                  resetPasswordForm.formState.errors.confirmPassword?.message
                }
                showPasswordToggle={true}
                isPasswordVisible={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants} className="text-center mt-6">
        <p className="text-gray-400 text-sm">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="text-green-400 hover:text-green-300 font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordForm;
