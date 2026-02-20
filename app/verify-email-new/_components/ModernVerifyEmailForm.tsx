"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Loader2,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/components/ui/Notification";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ModernVerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { addNotification } = useNotification();

  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // All other state hooks
  const [status, setStatus] = useState<
    "loading" | "success" | "expired" | "error" | "pending"
  >("pending");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(true);
  const [resendEmail, setResendEmail] = useState(email || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [lastResendResponse, setLastResendResponse] = useState<string>("");

  // Error boundary effect
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Component error:", error);
      setHasError(true);
      setErrorMessage(error.message || "An error occurred");
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{errorMessage}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  // Function to verify email with code
  const verifyEmail = async () => {
    if (!verificationCode.trim()) {
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(
        `/api/verify-email?token=${verificationCode.trim()}`
      );
      const data = await response.json();

      if (
        data.status === "success" ||
        data.message === "Email verified successfully"
      ) {
        setStatus("success");
        setTimeout(() => router.push("/sign-in"), 3000);
      } else if (data.message === "Email is already verified.") {
        setStatus("success");
        setTimeout(() => router.push("/sign-in"), 3000);
      } else if (
        data.message === "Verification link has expired" ||
        data.error === "Invalid or expired verification token"
      ) {
        setStatus("expired");
        startCountdown();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
    }
  };

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendVerification = async () => {
    if (!resendEmail || !canResend || resendLoading) return;

    setResendLoading(true);
    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        const successMsg = "Verification email sent successfully!";
        addNotification({
          type: "success",
          message: `${successMsg} Check your inbox at ${resendEmail}`,
        });
        setLastResendResponse(successMsg);
        setStatus("pending");
        startCountdown();
      } else {
        const errorMsg = data.message || "Failed to send verification email";
        addNotification({
          type: "error",
          message: `Failed to send verification email: ${errorMsg}`,
        });
        setLastResendResponse(errorMsg);
        console.error("Resend failed:", data.message);
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "Network error: Please check your connection and try again",
      });
      console.error("Resend error:", error);
    } finally {
      setResendLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Left Side - Fixed Promotional Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black/80 via-[#0f1a0f]/90 to-black/80 backdrop-blur-xl p-8 text-white border-r border-white/10 h-screen z-10">
        <div className="max-w-lg w-full flex flex-col justify-center overflow-hidden">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-1.5">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  Email Verification
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  Secure Account Activation
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Complete your account setup by verifying your email address. This
              ensures your account security and enables all platform features.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 gap-3 mb-6"
          >
            <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Account Security
                  </h3>
                  <p className="text-xs text-gray-400">
                    Protect your account with verified email
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Full Access
                  </h3>
                  <p className="text-xs text-gray-400">
                    Unlock all platform features
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Premium Features
                  </h3>
                  <p className="text-xs text-gray-400">
                    Access advanced tools and resources
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="mb-4"
          >
            <div className="p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-white font-semibold text-xs">
                    Verification Process
                  </span>
                  <p className="text-gray-300 text-xs leading-relaxed mt-1">
                    Quick and secure email verification to get you started on
                    Dealo.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Scrollable Verification Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 relative z-10 h-screen overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
                <Image
                  src="https://res.cloudinary.com/dxojy40bv/image/upload/v1755825606/DEALO_ICON_utffca.png"
                  alt="Dealo Logo"
                  width={48}
                  height={48}
                />
              </motion.div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400 mb-3">
                Email Verification
              </h1>
              <p className="text-gray-200 text-lg">
                {status === "pending"
                  ? "Check your inbox for verification link"
                  : "We're verifying your email address"}
              </p>
            </motion.div>

            {/* Main Content Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                {status === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Loader2 className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-white font-semibold text-xl mb-2">
                      Verifying your email...
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Please wait while we verify your email address.
                    </p>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-white font-semibold text-xl mb-2">
                      Email Verified! 🎉
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Your email has been verified successfully. Redirecting to
                      sign in&hellip;
                    </p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link href="/sign-in">
                        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105">
                          Go to Sign In
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}

                {status === "expired" && (
                  <motion.div
                    key="expired"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <AlertCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-white font-semibold text-xl mb-2">
                      Link Expired
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      The verification link has expired. Please request a new
                      one.
                    </p>
                    <div className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                      <Button
                        onClick={resendVerification}
                        disabled={!canResend || resendLoading || !resendEmail}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {resendLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            {canResend
                              ? "Resend Verification Email"
                              : `Wait ${countdown}s to resend`}
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <AlertCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-white font-semibold text-xl mb-2">
                      Verification Failed
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Invalid verification link. Please check your email or
                      request a new verification link.
                    </p>
                    <div className="space-y-3">
                      <Link href="/sign-in">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg font-medium transition-all duration-300">
                          Go to Sign In
                        </Button>
                      </Link>
                      <Button
                        onClick={() => setStatus("pending")}
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10 py-3 rounded-lg font-medium transition-all duration-300"
                      >
                        Try Again
                      </Button>
                    </div>
                  </motion.div>
                )}

                {status === "pending" && (
                  <motion.div
                    key="pending"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Mail className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-white font-semibold text-xl mb-2">
                      Check Your Email
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      We&apos;ve sent a verification code to your email address.
                      Please check your inbox and enter the code below to verify
                      your account.
                    </p>
                    <div className="space-y-4">
                      {/* Verification Code Input */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-gray-300 mb-3">
                          Enter the verification code from your email:
                        </p>
                        <div className="space-y-3">
                          <Input
                            type="text"
                            placeholder="Enter verification code"
                            value={verificationCode}
                            onChange={(e) =>
                              setVerificationCode(e.target.value)
                            }
                            className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 text-center text-lg font-mono tracking-widest"
                            maxLength={6}
                          />
                          <Button
                            onClick={verifyEmail}
                            disabled={!verificationCode.trim()}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Verify Email
                          </Button>
                        </div>
                      </div>

                      {/* Resend Email Section */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-sm text-gray-300 mb-2">
                          Didn&apos;t receive the email?
                        </p>
                        <div className="space-y-3">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={resendEmail}
                            onChange={(e) => setResendEmail(e.target.value)}
                            className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400"
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={resendVerification}
                                  disabled={
                                    !canResend || resendLoading || !resendEmail
                                  }
                                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  {resendLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="w-4 h-4" />
                                      {canResend
                                        ? "Resend Verification Email"
                                        : `Wait ${countdown}s to resend`}
                                    </>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                {lastResendResponse ||
                                  "Click to resend verification email"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <Link href="/sign-in">
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 py-3 rounded-lg font-medium transition-all duration-300"
                        >
                          Back to Sign In
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Need help?{" "}
                <Link
                  href="/contact"
                  className="text-green-400 hover:text-green-300 transition-colors hover:underline"
                >
                  Contact support
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernVerifyEmailForm;
