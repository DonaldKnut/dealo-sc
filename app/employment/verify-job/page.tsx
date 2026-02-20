"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifyJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const jobId = searchParams.get("jobId");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !jobId) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    const verifyJob = async () => {
      try {
        const response = await fetch(
          `/api/jobs/verify?token=${token}&jobId=${jobId}`
        );
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Job verified successfully!");
          // Redirect to job page after 3 seconds
          setTimeout(() => {
            router.push(`/employment/dealojobs/${jobId}`);
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyJob();
  }, [token, jobId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verifying Your Job Listing...
            </h2>
            <p className="text-gray-600">Please wait while we verify your email.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Job Verified!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting to your job listing...
            </p>
            <Link
              href={`/employment/dealojobs/${jobId}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-4"
            >
              View Job Listing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Verification Failed
            </h2>
            <p className="text-gray-600">{message}</p>
            <Link
              href="/employment/new-listing"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-4"
            >
              Try Again
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}




