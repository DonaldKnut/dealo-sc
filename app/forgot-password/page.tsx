"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";
import PromotionalPanel from "../(auth)/sign-in/_components/PromotionalPanel";
import ErrorBoundary from "@/components/ErrorBoundary";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

const ForgotPasswordPageContent = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-black via-[#0f1a0f] to-black relative">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Promotional Panel (Fixed, Not Scrollable) - Exactly 50% width */}
      <div className="hidden lg:flex lg:w-[50vw] lg:flex-shrink-0 lg:flex-grow-0 relative z-10 h-screen overflow-hidden">
        <PromotionalPanel />
      </div>

      {/* Right Side - Scrollable Form Container - Exactly 50% width */}
      <div className="w-full lg:w-[50vw] lg:flex-shrink-0 lg:flex-grow-0 h-screen overflow-y-auto relative z-10 flex items-start justify-center pt-8 sm:pt-12 lg:pt-16 pb-8 px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative"
        >
          {/* Form Container - No Background */}
          <div className="relative p-8 sm:p-10">
            <Suspense fallback={null}>
              <ForgotPasswordForm />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  return (
    <ErrorBoundary>
      <ForgotPasswordPageContent />
    </ErrorBoundary>
  );
};

export default ForgotPassword;
