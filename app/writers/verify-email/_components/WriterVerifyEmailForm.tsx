"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, RefreshCw, PenTool } from "lucide-react";
import Link from "next/link";

const WriterVerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<
    "loading" | "success" | "expired" | "error"
  >("loading");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `/api/writers/verify-email?token=${token}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setStatus("success");
          setTimeout(() => router.push("/writers/login"), 3000);
        } else if (data.message === "Email is already verified.") {
          setStatus("success");
          setTimeout(() => router.push("/writers/login"), 3000);
        } else if (data.message === "Verification link has expired") {
          setStatus("expired");
          startCountdown();
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, router]);

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
    if (!email) return;

    setResendLoading(true);
    try {
      const response = await fetch("/api/writers/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        startCountdown();
      }
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <PenTool className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Verify Your Email
          </h1>
          <p className="text-gray-300">
            Complete your writer account verification
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          {status === "loading" && (
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">
                Verifying your email...
              </h3>
              <p className="text-gray-400 text-sm">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">
                Email Verified! 🎉
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Your email has been verified successfully. You can now sign in
                to your writer account.
              </p>
              <Link
                href="/writers/login"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "expired" && (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">
                Verification Link Expired
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                The verification link has expired. Please request a new one.
              </p>
              {email && (
                <button
                  onClick={resendVerification}
                  disabled={!canResend || resendLoading}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {resendLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </div>
                  ) : canResend ? (
                    "Resend Verification Email"
                  ) : (
                    `Resend in ${countdown}s`
                  )}
                </button>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">
                Verification Failed
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Invalid verification link. Please check your email or request a
                new verification link.
              </p>
              <div className="space-y-3">
                <Link
                  href="/writers/signup"
                  className="block bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Sign Up Again
                </Link>
                <Link
                  href="/writers/login"
                  className="block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400 text-sm">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={resendVerification}
              disabled={!canResend || resendLoading}
              className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
            >
              request a new one
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WriterVerifyEmailForm;

