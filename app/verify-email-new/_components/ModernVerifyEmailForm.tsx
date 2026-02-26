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
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/components/ui/Notification";
import PromotionalPanel from "../../(auth)/sign-in/_components/PromotionalPanel";
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
    <div className="min-h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-black via-[#0f1a0f] to-black relative">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Promotional Panel */}
      <div className="hidden lg:flex lg:w-[50vw] lg:flex-shrink-0 lg:flex-grow-0 relative z-10 h-screen overflow-hidden">
        <PromotionalPanel />
      </div>

      {/* Right Side - Verification Case */}
      <div className="w-full lg:w-[50vw] lg:flex-shrink-0 lg:flex-grow-0 h-screen overflow-y-auto relative z-10 flex items-start justify-center pt-8 sm:pt-12 lg:pt-16 pb-8 px-6 sm:px-8 lg:px-12">
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
              <h1 className="text-4xl sm:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-green-400 to-green-500 mb-4 tracking-tight">
                Email Verification
              </h1>
              <p className="text-gray-200 text-lg font-body opacity-80 leading-relaxed">
                {status === "pending"
                  ? "Check your inbox for the verification code"
                  : status === "loading"
                    ? "Securing your account access..."
                    : "Complete your activation"}
              </p>
            </motion.div>

            {/* Main Content Card - Premium Glassmorphism */}
            <motion.div
              variants={itemVariants}
              className="bg-[#0a0f1a]/40 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
            >
              {/* Subtle Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
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
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 group"
                        >
                          <span className="uppercase tracking-widest text-xs">Go to Sign In</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
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
                        className="w-full bg-white/5 border-white/10 text-white placeholder-gray-500 h-12 rounded-xl focus:ring-green-500/20 focus:border-green-500/40"
                      />
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={resendVerification}
                        disabled={!canResend || resendLoading || !resendEmail}
                        className="w-full bg-white/10 hover:bg-white/15 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/10"
                      >
                        {resendLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                            <span className="uppercase tracking-widest text-xs">Sending...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className={`w-4 h-4 ${canResend ? 'text-green-400' : 'text-gray-400'}`} />
                            <span className="uppercase tracking-widest text-xs">
                              {canResend
                                ? "Resend Activation Email"
                                : `Resend in ${countdown}s`}
                            </span>
                          </>
                        )}
                      </motion.button>
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
                    <div className="space-y-4">
                      <Link href="/sign-in">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-lg"
                        >
                          Go to Sign In
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setStatus("pending")}
                        className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300"
                      >
                        Try Again
                      </motion.button>
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
                      {/* Verification Code Input - Premium Redesign */}
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-inner">
                        <p className="text-sm font-body text-gray-400 mb-4 font-medium italic tracking-wide">
                          Enter the 6-digit code sent to your email
                        </p>
                        <div className="space-y-4">
                          <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                            <input
                              type="text"
                              placeholder="000000"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="relative w-full bg-[#0a0f1a]/60 border border-white/10 text-white placeholder-gray-600 text-center text-3xl font-heading font-bold tracking-[0.5em] py-5 rounded-xl focus:outline-none focus:border-green-500/50 transition-all"
                              maxLength={6}
                            />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.01, translateY: -1 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={verifyEmail}
                            disabled={!verificationCode.trim() || status === "loading"}
                            className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-4.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(34,197,94,0.2)]"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Verify Activation
                          </motion.button>
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
                                <motion.button
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={resendVerification}
                                  disabled={
                                    !canResend || resendLoading || !resendEmail
                                  }
                                  className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  {resendLoading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                                      <span className="uppercase tracking-widest text-xs">Sending...</span>
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className={`w-4 h-4 ${canResend ? 'text-green-400' : 'text-gray-400'}`} />
                                      <span className="uppercase tracking-widest text-xs">
                                        {canResend
                                          ? "Resend Email"
                                          : `Wait ${countdown}s`}
                                      </span>
                                    </>
                                  )}
                                </motion.button>
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
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-4 font-medium text-sm group"
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          Back to Sign In
                        </motion.button>
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
