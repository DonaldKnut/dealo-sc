"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { v4 as uuid4 } from "uuid";

export const dynamic = "force-dynamic";

const AddChapterPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterDescription, setChapterDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chapterTitle.trim()) {
      setError("Chapter title is required");
      return;
    }

    if (!courseId) {
      setError("Course ID is missing");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/save-chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          chapters: [
            {
              chapterId: uuid4(),
              chapterTitle: chapterTitle.trim(),
              chapterDescription: chapterDescription.trim() || "",
              content: [],
              videoUrl: "",
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save chapter");
      }

      setSuccess(true);
      
      // Redirect back to course editor after a short delay with refresh
      setTimeout(() => {
        router.push(`/dealoforge/create-course/${courseId}`);
      }, 1500);
    } catch (e: any) {
      console.error("Error saving chapter:", e);
      setError(e.message || "Failed to save chapter. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050b07] to-black text-white">
      {/* Top Navigation */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/dealoforge/create-course/${courseId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Course Editor</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <Plus className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                Add Chapter
              </span>
            </div>
            <h1 className="text-4xl font-black mb-2">Create New Chapter</h1>
            <p className="text-gray-400">
              Add a new chapter to your course. You can add content and videos later.
            </p>
          </div>

          {/* Form */}
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm p-8">
                {/* Chapter Title */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Chapter Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => {
                      setChapterTitle(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g., Introduction to React"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-gray-500 transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Choose a clear, descriptive title for your chapter
                  </p>
                </div>

                {/* Chapter Description */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Chapter Description
                  </label>
                  <textarea
                    value={chapterDescription}
                    onChange={(e) => {
                      setChapterDescription(e.target.value);
                      setError(null);
                    }}
                    placeholder="Describe what students will learn in this chapter..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-gray-500 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Optional: Provide a brief overview of the chapter content
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 mb-6">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving || !chapterTitle.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Create Chapter
                      </>
                    )}
                  </button>
                  <Link
                    href={`/dealoforge/create-course/${courseId}`}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-400 space-y-1">
                    <p className="font-semibold text-white">What's Next?</p>
                    <p>
                      After creating the chapter, you can add videos, content, and learning materials from the course editor.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Chapter Created!</h3>
              <p className="text-gray-400 mb-6">
                Your chapter has been added to the course. Redirecting...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AddChapterPage;

