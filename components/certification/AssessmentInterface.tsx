"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  Send,
  Timer,
  Code2,
  FileText,
  LayoutGrid,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";

interface Question {
  id: string;
  type: "multiple_choice" | "short_answer" | "coding" | "case_study";
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  timeLimit?: number;
}

interface AssessmentInterfaceProps {
  assessmentId: string;
  assessmentType: string;
  onComplete: (responses: any[]) => void;
  onSave: (responses: any[]) => void;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  multiple_choice: { icon: <LayoutGrid className="w-4 h-4" />, label: "Multiple Choice", color: "text-emerald-400" },
  short_answer: { icon: <FileText className="w-4 h-4" />, label: "Short Answer", color: "text-blue-400" },
  coding: { icon: <Code2 className="w-4 h-4" />, label: "Coding", color: "text-violet-400" },
  case_study: { icon: <BookOpen className="w-4 h-4" />, label: "Case Study", color: "text-amber-400" },
};

const AssessmentInterface: React.FC<AssessmentInterfaceProps> = ({
  assessmentId,
  assessmentType,
  onComplete,
  onSave,
}) => {
  const session = useSafeSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/certifications/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, assessmentType }),
      });
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
        if (data.questions[0]?.timeLimit) {
          setTimeRemaining(data.questions[0].timeLimit);
          setShowTimer(true);
        }
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [assessmentId, assessmentType]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await onComplete(Object.values(responses));
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onComplete, responses]);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  useEffect(() => {
    if (timeRemaining > 0 && showTimer) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) { handleSubmit(); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, showTimer, handleSubmit]);

  const handleResponseChange = (questionId: string, response: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: response }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQ = questions[currentQuestionIndex + 1];
      if (nextQ?.timeLimit) { setTimeRemaining(nextQ.timeLimit); setShowTimer(true); }
      else setShowTimer(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevQ = questions[currentQuestionIndex - 1];
      if (prevQ?.timeLimit) { setTimeRemaining(prevQ.timeLimit); setShowTimer(true); }
      else setShowTimer(false);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(Object.values(responses));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving responses:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isTimeLow = timeRemaining > 0 && timeRemaining <= 30;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin relative" />
          </div>
          <p className="text-gray-500 text-sm">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-gray-600 mx-auto" />
          <p className="text-gray-500">No questions available for this assessment.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const hasAnswered = !!responses[currentQuestion?.id];
  const answeredCount = Object.keys(responses).length;
  const typeConfig = TYPE_CONFIG[currentQuestion.type] || TYPE_CONFIG.short_answer;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">

            {/* Left: progress info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="hidden sm:block">
                <p className="text-[11px] text-gray-600 uppercase tracking-widest font-bold">Assessment</p>
                <p className="text-sm font-semibold text-white">
                  Question {currentQuestionIndex + 1}
                  <span className="text-gray-600"> / {questions.length}</span>
                </p>
              </div>
              {/* Dot map */}
              <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${i === currentQuestionIndex
                        ? "bg-emerald-400 scale-125"
                        : responses[q.id]
                          ? "bg-emerald-700"
                          : "bg-white/20"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: timer + save */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {showTimer && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all ${isTimeLow
                    ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
                    : "bg-white/[0.04] border-white/[0.08] text-gray-300"
                  }`}>
                  <Timer className="w-3.5 h-3.5" />
                  {formatTime(timeRemaining)}
                </div>
              )}
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${saved
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20"
                  }`}
              >
                {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{saved ? "Saved!" : "Save"}</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* ── QUESTION CARD ── */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Question meta */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs font-semibold uppercase tracking-widest ${typeConfig.color}`}>
                {typeConfig.icon}
                {typeConfig.label}
              </div>
              <span className="text-gray-600 text-xs">{currentQuestion.points} pts</span>
              {currentQuestion.timeLimit && (
                <span className="text-gray-600 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(currentQuestion.timeLimit)} limit
                </span>
              )}
            </div>

            {/* Question text */}
            <div className="bg-white/[0.02] border border-white/[0.07] rounded-[1.5rem] p-8 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer area */}
            <div className="space-y-3">

              {/* Multiple Choice */}
              {currentQuestion.type === "multiple_choice" && (
                <div className="space-y-2.5">
                  {currentQuestion.options?.map((option, index) => {
                    const isSelected = responses[currentQuestion.id] === option;
                    const letter = String.fromCharCode(65 + index);
                    return (
                      <label
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 group ${isSelected
                            ? "bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-900/20"
                            : "bg-white/[0.02] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option}
                          checked={isSelected}
                          onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                          className="sr-only"
                        />
                        {/* Letter badge */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-all ${isSelected
                            ? "bg-emerald-500 text-black"
                            : "bg-white/[0.06] text-gray-500 group-hover:bg-white/10 group-hover:text-white"
                          }`}>
                          {letter}
                        </div>
                        <span className={`font-medium transition-colors ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                          {option}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Short Answer */}
              {currentQuestion.type === "short_answer" && (
                <div className="relative">
                  <textarea
                    value={responses[currentQuestion.id] || ""}
                    onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={5}
                    className="w-full p-5 bg-white/[0.02] border border-white/[0.07] focus:border-emerald-500/40 rounded-2xl text-white placeholder-gray-600 text-sm leading-relaxed resize-none focus:outline-none transition-all"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-700">
                    {(responses[currentQuestion.id] || "").length} chars
                  </div>
                </div>
              )}

              {/* Coding */}
              {currentQuestion.type === "coding" && (
                <div className="space-y-3">
                  <div className="relative bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                      <span className="ml-2 text-xs text-gray-600 font-mono">solution.js</span>
                    </div>
                    <textarea
                      value={responses[currentQuestion.id] || ""}
                      onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                      placeholder="// Write your code here..."
                      rows={12}
                      className="w-full p-5 bg-transparent text-emerald-300 font-mono text-sm border-none focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Write clean, readable code", "Add comments where needed", "Handle edge cases"].map((tip, i) => (
                      <span key={i} className="text-xs text-gray-600 bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-lg">
                        💡 {tip}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Study */}
              {currentQuestion.type === "case_study" && (
                <div className="space-y-3">
                  <textarea
                    value={responses[currentQuestion.id] || ""}
                    onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
                    placeholder="Provide your analysis and recommendations..."
                    rows={8}
                    className="w-full p-5 bg-white/[0.02] border border-white/[0.07] focus:border-emerald-500/40 rounded-2xl text-white placeholder-gray-600 text-sm leading-relaxed resize-none focus:outline-none transition-all"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Problem analysis", "Recommendations", "Implementation plan", "Risk assessment"].map((hint, i) => (
                      <span key={i} className="text-xs text-gray-600 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-lg text-center">
                        📋 {hint}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── NAVIGATION ── */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.06]">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Center: answered status */}
          <div className="flex items-center gap-2 text-xs">
            {hasAnswered ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                Answered
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-gray-600">
                <AlertCircle className="w-3.5 h-3.5" />
                Not answered
              </span>
            )}
            <span className="text-gray-700">·</span>
            <span className="text-gray-600">{answeredCount}/{questions.length} done</span>
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4" /> Submit</>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/30"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentInterface;
