"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Layers,
  Award,
  Edit3,
  Play,
  CheckCircle2,
  Sparkles,
  FileText,
  Video,
  Settings,
  Eye,
} from "lucide-react";
import {
  fetchCourseDetails,
  handleGenerateContent,
} from "../../_components/_courseComponents/courseUtils";
import { Course } from "../../_components/_courseComponents/courseTypes";
import Notification from "@/components/Notification";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CourseLayoutPage: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get courseId from route params (primary) or search params (fallback for backward compatibility)
  // Handle both string and array cases for Next.js compatibility
  const courseIdParam = params?.courseId;
  const courseIdFromParams = Array.isArray(courseIdParam) 
    ? courseIdParam[0] 
    : (courseIdParam as string);
  
  // If the route param is the literal "[courseId]" string (URL encoded as %5BcourseId%5D), 
  // ignore it and use the query param instead
  const isLiteralPlaceholder = courseIdFromParams === "[courseId]" || 
                                courseIdFromParams === "%5BcourseId%5D" ||
                                decodeURIComponent(courseIdFromParams || "") === "[courseId]";
  
  const courseId = (!isLiteralPlaceholder && courseIdFromParams) 
    ? courseIdFromParams 
    : (searchParams.get("courseId") || "");

  useEffect(() => {
    // Debug logging
    console.log("CourseLayoutPage - courseId:", courseId);
    console.log("CourseLayoutPage - params:", params);
    console.log("CourseLayoutPage - courseIdParam:", courseIdParam);
    
    if (!courseId || courseId.trim() === "") {
      setNotificationMessage("Course ID is missing from the URL. Please navigate from the dashboard.");
      setNotificationType("error");
      setIsLoading(false);
      return;
    }

    const courseName = searchParams.get("courseName");
    const refresh = searchParams.get("refresh");

    // Always fetch course details when courseId is available
    fetchCourseDetails(
      courseId,
      setCourse,
      setNotificationMessage,
      setNotificationType,
      setIsLoading
    );

    if (courseName) {
      setCourse((prev) => ({ ...prev, name: courseName } as Course));
    }

    // Refresh course data if refresh param is present
    if (refresh === "true") {
      fetchCourseDetails(
        courseId,
        setCourse,
        setNotificationMessage,
        setNotificationType,
        setIsLoading
      );
      // Remove refresh param from URL
      const newUrl = `/dealoforge/create-course/${courseId}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [courseId, courseIdParam, params, searchParams, router]);

  const generateCourseContent = async () => {
    if (!course) return;
    await handleGenerateContent(
      course,
      setCourse,
      setNotificationMessage,
      setNotificationType,
      setIsLoading,
      router
    );
  };

  const levelLabel = (level?: string) => {
    if (!level) return "All levels";
    switch (level.toUpperCase()) {
      case "BEGINNER":
        return "Beginner";
      case "INTERMEDIATE":
        return "Intermediate";
      case "ADVANCE":
      case "ADVANCED":
        return "Advanced";
      default:
        return level;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050b07] to-black text-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dealoforge/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              {courseId && (
                <>
                  <Link
                    href={`/dealoforge/dashboard/courses/${courseId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </Link>
                  <Link
                    href={`/dealoforge/create-course/chapter/${courseId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Manage Content</span>
                  </Link>
                </>
              )}
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <div className="text-gray-400">Loading course...</div>
          </div>
        </div>
      ) : course ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Course Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                Course Editor
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {course.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Layers className="w-4 h-4 text-emerald-400" />
                {course.category}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Award className="w-4 h-4 text-emerald-400" />
                {levelLabel(course.level)}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Clock className="w-4 h-4 text-emerald-400" />
                {course.courseDuration}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <FileText className="w-4 h-4 text-emerald-400" />
                {course.noOfChapters} chapters
              </span>
            </div>
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Course Content (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Overview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    Course Overview
                  </h2>
                  {courseId && (
                    <Link
                      href={`/dealoforge/create-course/chapter/${courseId}`}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      title="Edit course content"
                    >
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </Link>
                  )}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {course.chapters[0]?.chapterDescription ||
                    "This course provides comprehensive learning materials and structured content to help you master the subject."}
                </p>
              </motion.div>

              {/* Chapters Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    Course Chapters
                  </h2>
                  <span className="text-sm text-gray-400">
                    {course.chapters.length} chapters
                  </span>
                </div>

                {course.chapters.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">No chapters yet</p>
                    <p className="text-sm text-gray-500">
                      Start by adding chapters to your course
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {course.chapters.map((chapter, index) => (
                      <Link
                        key={chapter.chapterId || index}
                        href={`/dealoforge/create-course/chapter/${courseId}`}
                        className="group p-4 rounded-xl border border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer block"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                              <span className="text-sm font-bold text-emerald-400">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1 group-hover:text-emerald-300 transition-colors">
                                {chapter.chapterTitle || `Chapter ${index + 1}`}
                              </h3>
                              {chapter.chapterDescription && (
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {chapter.chapterDescription}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <Edit3 className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Actions & Info (1/3 width) */}
            <div className="space-y-6">
              {/* Quick Actions Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-black p-6 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={generateCourseContent}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Generate Content
                      </>
                    )}
                  </button>
                  {courseId ? (
                    <>
                      <Link
                        href={`/dealoforge/create-course/${courseId}/add-video`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                      >
                        <Video className="w-4 h-4" />
                        Add Video
                      </Link>
                      <Link
                        href={`/dealoforge/create-course/${courseId}/add-chapter`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        Add Chapter
                      </Link>
                      <Link
                        href={`/dealoforge/create-course/chapter/${courseId}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                      >
                        <BookOpen className="w-4 h-4" />
                        Manage Chapters
                      </Link>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-2">
                      Loading course ID...
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Course Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Course Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Chapters</span>
                    <span className="font-semibold">{course.noOfChapters}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Duration</span>
                    <span className="font-semibold">{course.courseDuration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Level</span>
                    <span className="font-semibold">{levelLabel(course.level)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Videos</span>
                    <span className="font-semibold flex items-center gap-1">
                      {course.addVideo ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Enabled
                        </>
                      ) : (
                        "Not added"
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Publish Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-2">Ready to publish?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Make your course available to students
                </p>
                <button
                  onClick={async () => {
                    if (!courseId) {
                      setNotificationMessage("Course ID is missing");
                      setNotificationType("error");
                      return;
                    }
                    setIsLoading(true);
                    try {
                      const res = await fetch(`/api/courses/${courseId}/publish`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ publish: true }),
                      });
                      if (res.ok) {
                        setNotificationMessage("Course published successfully!");
                        setNotificationType("success");
                        // Refresh course data
                        fetchCourseDetails(
                          courseId,
                          setCourse,
                          setNotificationMessage,
                          setNotificationType,
                          setIsLoading
                        );
                      } else {
                        const error = await res.json();
                        throw new Error(error.error || "Failed to publish course");
                      }
                    } catch (e: any) {
                      setNotificationMessage(e.message || "Failed to publish course");
                      setNotificationType("error");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading || !courseId}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Publishing..." : "Publish Course"}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-red-400 text-xl font-semibold">
              Failed to load course
            </div>
            <div className="text-gray-400">
              {notificationMessage || "Please check your internet connection and try again."}
            </div>
            {!courseId && (
              <div className="text-yellow-400 text-sm mt-2 p-4 bg-yellow-900/20 rounded-lg">
                <p className="font-semibold mb-2">Course ID is missing from the URL.</p>
                <p className="text-xs">Route params: {JSON.stringify(params)}</p>
                <p className="text-xs mt-1">Search params: {searchParams.toString()}</p>
              </div>
            )}
            {courseId && (
              <button
                onClick={() => {
                  fetchCourseDetails(
                    courseId,
                    setCourse,
                    setNotificationMessage,
                    setNotificationType,
                    setIsLoading
                  );
                }}
                className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
              >
                Retry
              </button>
            )}
            {!courseId && (
              <Link
                href="/dealoforge/dashboard"
                className="mt-4 inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
              >
                Back to Dashboard
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      {notificationMessage && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setNotificationMessage(null)}
        />
      )}
    </div>
  );
};

export default CourseLayoutPage;
