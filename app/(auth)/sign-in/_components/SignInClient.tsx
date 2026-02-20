"use client";

import { Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ModernAuthForm from "./ModernAuthForm";
import PromotionalPanel from "./PromotionalPanel";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// Component that uses search params - wrapped in Suspense
const SearchParamsHandler = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const message = searchParams?.get("message");
  const showSignUp = searchParams?.get("signup") === "true";

  return (
    <ModernAuthForm
      showSignUp={showSignUp}
      initialError={error}
      initialMessage={message}
    />
  );
};

// Component to handle OAuth success redirect (legacy query-param based flow)
const OAuthSuccessHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthSuccess = searchParams?.get("oauth") === "success";
  const hasHandledOAuth = useRef(false);

  useEffect(() => {
    if (!oauthSuccess || hasHandledOAuth.current) return;

    hasHandledOAuth.current = true;

    const checkSessionAndRedirect = async () => {
      try {
        let session: any = null;
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts && !session?.user) {
          session = await getSession();
          if (session?.user) break;
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const user = session?.user;
        if (user?.id) {
          const isComplete = user?.isProfileComplete;

          // Remove oauth parameter from URL
          if (typeof window !== "undefined") {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("oauth");
            window.history.replaceState({}, "", newUrl.toString());
          }

          router.push(isComplete ? "/dealoforge/dashboard" : "/complete-profile");
        }
      } catch (error) {
        console.error("Error checking session after OAuth:", error);
      }
    };

    checkSessionAndRedirect();
  }, [oauthSuccess, router, searchParams]);

  return null;
};

const SignInPageContent = () => {
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
            <Suspense
              fallback={
                <div className="p-8">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-green-400/20 rounded-lg"></div>
                    <div className="h-4 bg-green-400/20 rounded-lg"></div>
                    <div className="h-12 bg-green-400/20 rounded-lg"></div>
                    <div className="h-12 bg-green-400/20 rounded-lg"></div>
                  </div>
                </div>
              }
            >
              <OAuthSuccessHandler />
              <SearchParamsHandler />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function SignInClient() {
  return (
    <ErrorBoundary>
      <SignInPageContent />
    </ErrorBoundary>
  );
}

