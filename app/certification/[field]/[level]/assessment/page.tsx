"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSafeSession } from "@/hooks/use-safe-session";
import AssessmentInterface from "@/components/certification/AssessmentInterface";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Shield,
} from "lucide-react";

type AssessmentType = "written" | "practical" | "interview" | "portfolio" | "case_study";

const AssessmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData, status } = session || {};

  const field = params.field as string;
  const level = params.level as string;

  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("written");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultAssessmentType: AssessmentType = useMemo(() => "written", []);

  const startAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const professionId =
        field === "programming" ? "software-developer"
          : field === "marketing" ? "digital-marketer"
            : field;

      const res = await fetch("/api/certifications/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionId }),
      });

      if (res.status === 401) {
        router.push("/sign-in?callbackUrl=" + encodeURIComponent(window.location.pathname));
        return;
      }

      if (!res.ok) throw new Error("Failed to start assessment");

      const data = await res.json();
      setAssessmentId(data.assessmentId);
      setAssessmentType(defaultAssessmentType);
    } catch (e: any) {
      setError(e?.message || "Failed to start assessment");
    } finally {
      setLoading(false);
    }
  }, [router, field, defaultAssessmentType]);

  const handleComplete = useCallback(async (responses: any[]) => {
    if (!assessmentId) return;
    try {
      await fetch("/api/certifications/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, assessmentType, responses }),
      });

      const completeRes = await fetch("/api/certifications/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId }),
      });

      if (!completeRes.ok) throw new Error("Failed to complete certification");
      router.push("/certifications/my-certifications");
    } catch (err) {
      console.error("Assessment completion error:", err);
    }
  }, [assessmentId, assessmentType, router]);

  const handleSave = useCallback(async (responses: any[]) => {
    console.log("Saved interim responses", responses?.length || 0);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }
    if (status === "authenticated") startAssessment();
  }, [status, router, startAssessment]);

  // Loading state
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-sm"
        >
          {/* Animated icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-white/[0.03] border border-white/[0.08] rounded-3xl flex items-center justify-center">
              <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-2">Preparing Your Assessment</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Setting up your <span className="text-emerald-400 font-semibold capitalize">{field}</span> · <span className="text-white/60 capitalize">{level}</span> certification...
            </p>
          </div>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-sm"
        >
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-red-500/10 rounded-3xl blur-xl" />
            <div className="relative w-20 h-20 bg-red-500/[0.06] border border-red-500/20 rounded-3xl flex items-center justify-center">
              <AlertTriangle className="w-9 h-9 text-red-400" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-2">Something Went Wrong</h2>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={startAssessment}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => router.push(`/certification/${field}/${level}`)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-gray-400 hover:text-white font-medium rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Certification
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // No assessment ID
  if (!assessmentId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-500">Unable to start assessment. Please try again.</p>
          <button
            onClick={() => router.push(`/certification/${field}/${level}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-gray-400 hover:text-white rounded-xl transition-all text-sm mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <AssessmentInterface
      assessmentId={assessmentId}
      assessmentType={assessmentType}
      onComplete={handleComplete}
      onSave={handleSave}
    />
  );
};

export default AssessmentPage;
