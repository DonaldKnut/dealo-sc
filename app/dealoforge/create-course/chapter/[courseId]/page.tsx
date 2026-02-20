"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Video,
  Plus,
  Edit3,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  Award,
  Upload,
  Globe,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  Loader2,
  Wand2,
  File,
  Book,
  Shield,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import CloudflareStreamPlayer from "@/components/video/CloudflareStreamPlayer";
import Notification from "@/components/Notification";

export const dynamic = "force-dynamic";

interface Lecture {
  _id?: string;
  title: string;
  description?: string;
  type: "video" | "audio" | "document" | "quiz" | "assignment";
  content: {
    url?: string;
    duration?: number;
    thumbnail?: string;
  };
  isPublished: boolean;
  order: number;
}

interface Section {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  lectures: Lecture[];
  isPublished: boolean;
}

interface CourseData {
  _id: string;
  name?: string;
  title?: string;
  category: string;
  level: string;
  courseDuration?: string;
  duration?: number;
  status: "draft" | "published" | "archived" | "pending_review";
  isPublished: boolean;
  sections?: Section[];
  courseOutput?: {
    chapters?: any[];
  };
}

const ChapterPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
  const [showGenerateContentModal, setShowGenerateContentModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/courses/${courseId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load course");
      }

      const data = await res.json();
      
      // Normalize the course data to handle both CourseModel and CourseListModel
      const normalizedCourse: CourseData = {
        _id: data._id,
        name: data.name || data.title,
        title: data.title || data.name,
        category: data.category || "Uncategorized",
        level: data.level || "all",
        courseDuration: data.courseDuration || (data.duration ? `${Math.floor(data.duration / 60)} hours` : "0 hours"),
        duration: data.duration,
        status: data.status || (data.publish ? "published" : "draft"),
        isPublished: data.isPublished !== undefined ? data.isPublished : (data.publish === true),
        sections: data.sections || (data.courseOutput?.chapters?.map((ch: any, idx: number) => ({
          _id: ch._id?.toString() || `section-${idx}`,
          title: ch.chapter_title || ch.title || `Section ${idx + 1}`,
          description: ch.chapter_description || ch.description,
          order: ch.chapter_number || idx + 1,
          isPublished: true,
          lectures: ch.video_lectures?.map((lec: any, lecIdx: number) => ({
            _id: lec._id?.toString() || `lecture-${idx}-${lecIdx}`,
            title: lec.lecture_title || lec.title || `Lecture ${lecIdx + 1}`,
            description: lec.lecture_description || lec.description,
            type: "video" as const,
            content: {
              url: lec.videoUrl || lec.video_url || "",
              duration: lec.duration ? parseInt(lec.duration) : undefined,
            },
            isPublished: true,
            order: lecIdx + 1,
          })) || [],
        })) || []),
      };
      
      setCourse(normalizedCourse);
    } catch (e: any) {
      console.error("Error fetching course:", e);
      setError(e.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;

    setPublishing(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publish: !course.isPublished,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update publish status");
      }

      const updated = await res.json();
      setCourse(updated);
      setNotificationMessage(
        updated.isPublished
          ? "Course published successfully!"
          : "Course unpublished successfully!"
      );
      setNotificationType("success");
    } catch (e: any) {
      setNotificationMessage(e.message || "Failed to update publish status");
      setNotificationType("error");
    } finally {
      setPublishing(false);
    }
  };

  const handleAddVideo = async (sectionId: string, lectureId: string, videoId: string) => {
    setUploading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          videoUrl: `https://iframe.videodelivery.net/${videoId}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add video");
      }

      await fetchCourse();
      setShowAddVideoModal(false);
      setNotificationMessage("Video added successfully!");
      setNotificationType("success");
    } catch (e: any) {
      setNotificationMessage(e.message || "Failed to add video");
      setNotificationType("error");
    } finally {
      setUploading(false);
    }
  };

  const sections = course?.sections || [];
  const courseName = course?.name || course?.title || "Untitled Course";
  const isPublished = course?.isPublished || false;
  const status = course?.status || "draft";

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const levelLabel = (level?: string) => {
    if (!level) return "All levels";
    switch (level.toLowerCase()) {
      case "beginner":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      default:
        return level;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#050b07] to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#050b07] to-black flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-400 text-xl font-semibold">Failed to load course</p>
          <p className="text-gray-400">{error || "Course not found"}</p>
          <button
            onClick={fetchCourse}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050b07] to-black text-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/dealoforge/create-course/${courseId}`}
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Editor</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={`/dealoforge/dashboard/courses/${courseId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Link>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isPublished
                    ? "bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/40 text-yellow-300"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : isPublished ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Unpublish</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Publish Course</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
              Course Content
            </span>
            {isPublished && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Published
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            {courseName}
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
              {course.courseDuration || `${Math.floor((course.duration || 0) / 60)} hours`}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <FileText className="w-4 h-4 text-emerald-400" />
              {sections.length} sections
            </span>
          </div>
        </motion.div>

        {/* Sections and Lectures */}
        {sections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-12 text-center"
          >
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No sections yet</h3>
            <p className="text-gray-400 mb-6">
              Start building your course by adding sections and lectures
            </p>
            <Link
              href={`/dealoforge/create-course/${courseId}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Section
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section._id || sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm overflow-hidden"
              >
                {/* Section Header */}
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                          <span className="text-sm font-bold text-emerald-400">
                            {sectionIndex + 1}
                          </span>
                        </div>
                        <h2 className="text-2xl font-semibold">{section.title}</h2>
                      </div>
                      {section.description && (
                        <p className="text-gray-400 text-sm ml-[52px]">{section.description}</p>
                      )}
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Lectures */}
                <div className="p-6 space-y-4">
                  {section.lectures && section.lectures.length > 0 ? (
                    section.lectures.map((lecture, lectureIndex) => {
                      const hasVideo = lecture.content?.url && lecture.type === "video";
                      const isCloudflareVideo = hasVideo && lecture.content?.url?.includes("videodelivery.net");
                      const videoId = isCloudflareVideo && lecture.content?.url
                        ? lecture.content.url.split("/").pop()?.split("?")[0] || ""
                        : "";

                      return (
                        <div
                          key={lecture._id || lectureIndex}
                          className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-emerald-500/40 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                  <Play className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold">{lecture.title}</h3>
                                {lecture.content?.duration && (
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(lecture.content.duration)}
                                  </span>
                                )}
                              </div>
                              {lecture.description && (
                                <p className="text-gray-400 text-sm ml-11 mt-1">{lecture.description}</p>
                              )}
                            </div>
                            {!hasVideo && (
                              <button
                                onClick={() => {
                                  setSelectedSection(section);
                                  setSelectedLecture(lecture);
                                  setShowQuickActionsModal(true);
                                }}
                                className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium transition-all flex items-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Add Video
                              </button>
                            )}
                          </div>

                          {/* Video Player */}
                          {hasVideo && (
                            <div className="mt-4 rounded-xl overflow-hidden">
                              {isCloudflareVideo && videoId ? (
                                <CloudflareStreamPlayer
                                  videoId={videoId}
                                  controls={true}
                                  thumbnail={lecture.content?.thumbnail}
                                  className="rounded-xl"
                                />
                              ) : (
                                <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
                                  <video
                                    src={lecture.content.url}
                                    controls
                                    className="w-full h-full"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {!hasVideo && (
                            <div className="mt-4 aspect-video bg-black/40 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-4">
                              <Video className="w-12 h-12 text-gray-600" />
                              <p className="text-gray-400 text-sm">No video added yet</p>
                              <button
                                onClick={() => {
                                  setSelectedSection(section);
                                  setSelectedLecture(lecture);
                                  setShowQuickActionsModal(true);
                                }}
                                className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium transition-all flex items-center gap-2"
                              >
                                <Upload className="w-4 h-4" />
                                Upload Video
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 mb-4">No lectures in this section</p>
                      <button className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium transition-all flex items-center gap-2 mx-auto">
                        <Plus className="w-4 h-4" />
                        Add Lecture
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Modal */}
      <AnimatePresence>
        {showQuickActionsModal && selectedSection && selectedLecture && (
          <QuickActionsModal
            courseId={courseId}
            sectionId={selectedSection._id || ""}
            lectureId={selectedLecture._id || ""}
            onClose={() => {
              setShowQuickActionsModal(false);
              setSelectedSection(null);
              setSelectedLecture(null);
            }}
            onGenerateContent={() => {
              setShowQuickActionsModal(false);
              setShowGenerateContentModal(true);
            }}
            onAddVideo={() => {
              setShowQuickActionsModal(false);
              setShowAddVideoModal(true);
            }}
            onAddChapter={() => {
              setShowQuickActionsModal(false);
              router.push(`/dealoforge/create-course/${courseId}/add-chapter`);
            }}
          />
        )}
      </AnimatePresence>

      {/* Generate Content Modal */}
      <AnimatePresence>
        {showGenerateContentModal && selectedSection && selectedLecture && (
          <GenerateContentModal
            courseId={courseId}
            sectionId={selectedSection._id || ""}
            lectureId={selectedLecture._id || ""}
            courseName={courseName}
            onClose={() => {
              setShowGenerateContentModal(false);
              setSelectedSection(null);
              setSelectedLecture(null);
            }}
            onSuccess={() => {
              setShowGenerateContentModal(false);
              fetchCourse();
              setNotificationMessage("Content generated successfully!");
              setNotificationType("success");
            }}
          />
        )}
      </AnimatePresence>

      {/* Add Video Modal */}
      <AnimatePresence>
        {showAddVideoModal && selectedSection && selectedLecture && (
          <AddVideoModal
            courseId={courseId}
            sectionId={selectedSection._id || ""}
            lectureId={selectedLecture._id || ""}
            onClose={() => {
              setShowAddVideoModal(false);
              setSelectedSection(null);
              setSelectedLecture(null);
            }}
            onSuccess={(videoId) => {
              handleAddVideo(
                selectedSection._id || "",
                selectedLecture._id || "",
                videoId
              );
            }}
          />
        )}
      </AnimatePresence>

      {/* Notification */}
      <Notification
        message={notificationMessage}
        type={notificationType}
        onClose={() => setNotificationMessage(null)}
      />
    </div>
  );
};

// Quick Actions Modal Component
const QuickActionsModal = ({
  courseId,
  sectionId,
  lectureId,
  onClose,
  onGenerateContent,
  onAddVideo,
  onAddChapter,
}: {
  courseId: string;
  sectionId: string;
  lectureId: string;
  onClose: () => void;
  onGenerateContent: () => void;
  onAddVideo: () => void;
  onAddChapter: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            Quick Actions
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={onGenerateContent}
            className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg mb-1">Generate Content</h3>
              <p className="text-sm text-gray-400">
                Create content using AI script, PDF, Ebook, or Video
              </p>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>

          <button
            onClick={onAddVideo}
            className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg mb-1">Add Video</h3>
              <p className="text-sm text-gray-400">
                Upload a video file directly to this lecture
              </p>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>

          <button
            onClick={onAddChapter}
            className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg mb-1">Add Chapter</h3>
              <p className="text-sm text-gray-400">
                Create a new chapter for this course
              </p>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Generate Content Modal Component
const GenerateContentModal = ({
  courseId,
  sectionId,
  lectureId,
  courseName,
  onClose,
  onSuccess,
}: {
  courseId: string;
  sectionId: string;
  lectureId: string;
  courseName: string;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<"ai-script" | "pdf" | "ebook" | "video" | null>(null);
  const [generating, setGenerating] = useState(false);
  const [ipVerified, setIpVerified] = useState(false);
  const [showIpWarning, setShowIpWarning] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOptionSelect = (option: "ai-script" | "pdf" | "ebook" | "video") => {
    setSelectedOption(option);
    setError(null);
    if (option === "video") {
      setShowIpWarning(true);
      setIpVerified(false);
    } else {
      setShowIpWarning(false);
      setIpVerified(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedOption === "pdf" && !selectedFile.type.includes("pdf")) {
      setError("Please select a PDF file");
      return;
    }

    if (selectedOption === "ebook" && !selectedFile.type.includes("epub") && !selectedFile.name.endsWith(".epub")) {
      setError("Please select an EPUB file");
      return;
    }

    if (selectedOption === "video" && !selectedFile.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedOption) return;

    if (selectedOption === "video" && !ipVerified) {
      setError("Please verify that you own the intellectual property rights to this video");
      return;
    }

    if ((selectedOption === "pdf" || selectedOption === "ebook" || selectedOption === "video") && !file) {
      setError("Please select a file");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      let response;

      if (selectedOption === "ai-script") {
        // Generate AI script
        response = await fetch("/api/courses/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            sectionId,
            lectureId,
            courseName,
            type: "ai-script",
          }),
        });
      } else {
        // Upload and process file
        const formData = new FormData();
        formData.append("file", file!);
        formData.append("courseId", courseId);
        formData.append("sectionId", sectionId);
        formData.append("lectureId", lectureId);
        formData.append("type", selectedOption);
        formData.append("ipVerified", ipVerified.toString());

        response = await fetch("/api/courses/generate-content", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      onSuccess();
    } catch (e: any) {
      setError(e.message || "Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-400" />
            Generate Content
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Content Type Selection */}
          {!selectedOption && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleOptionSelect("ai-script")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg">AI Script</h3>
                <p className="text-sm text-gray-400 text-center">
                  Generate course content using AI
                </p>
              </button>

              <button
                onClick={() => handleOptionSelect("pdf")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-red-500/10 border border-red-500/30 hover:border-red-500/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <File className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="font-semibold text-lg">PDF</h3>
                <p className="text-sm text-gray-400 text-center">
                  Upload and process a PDF document
                </p>
              </button>

              <button
                onClick={() => handleOptionSelect("ebook")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Book className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg">Ebook</h3>
                <p className="text-sm text-gray-400 text-center">
                  Upload and process an EPUB ebook
                </p>
              </button>

              <button
                onClick={() => handleOptionSelect("video")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Video className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg">Video</h3>
                <p className="text-sm text-gray-400 text-center">
                  Upload video content (IP required)
                </p>
              </button>
            </div>
          )}

          {/* IP Warning for Video */}
          {showIpWarning && selectedOption === "video" && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-300 mb-2">Intellectual Property Notice</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    To monetize video content, you must own the intellectual property rights or have proper licensing.
                    By proceeding, you confirm that:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 mb-4 ml-4 list-disc">
                    <li>You created this video content yourself, OR</li>
                    <li>You have obtained proper licensing/rights to monetize this content</li>
                  </ul>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ipVerified}
                      onChange={(e) => setIpVerified(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-300">
                      I confirm I own the intellectual property rights to this video
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* File Upload for PDF/Ebook/Video */}
          {selectedOption && (selectedOption === "pdf" || selectedOption === "ebook" || selectedOption === "video") && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {selectedOption === "pdf" && "Upload PDF File"}
                {selectedOption === "ebook" && "Upload EPUB File"}
                {selectedOption === "video" && "Upload Video File"}
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
              >
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <File className="w-8 h-8 text-emerald-400" />
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-300 mb-1">Click to select file</p>
                    <p className="text-sm text-gray-500">
                      {selectedOption === "pdf" && "PDF files only"}
                      {selectedOption === "ebook" && "EPUB files only"}
                      {selectedOption === "video" && "Video files (MP4, MOV, AVI)"}
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={
                    selectedOption === "pdf"
                      ? "application/pdf"
                      : selectedOption === "ebook"
                      ? ".epub"
                      : "video/*"
                  }
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {selectedOption && (
              <>
                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setFile(null);
                    setError(null);
                    setIpVerified(false);
                    setShowIpWarning(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating || (selectedOption === "video" && !ipVerified) || ((selectedOption === "pdf" || selectedOption === "ebook" || selectedOption === "video") && !file)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Content</span>
                    </>
                  )}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Add Video Modal Component
const AddVideoModal = ({
  courseId,
  sectionId,
  lectureId,
  onClose,
  onSuccess,
}: {
  courseId: string;
  sectionId: string;
  lectureId: string;
  onClose: () => void;
  onSuccess: (videoId: string) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    const maxSize = 400 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size exceeds 400MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const urlRes = await fetch(`/api/videos/upload-url?size=${selectedFile.size}`, {
        cache: "no-store",
      });

      if (!urlRes.ok) {
        const errorData = await urlRes.json();
        throw new Error(errorData.error || "Failed to get upload URL");
      }

      const { uploadURL, uid } = await urlRes.json();
      if (!uploadURL) {
        throw new Error("Upload URL missing");
      }

      const uploadId = await new Promise<string>((resolve, reject) => {
        const form = new FormData();
        form.append("file", selectedFile);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadURL);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText || "{}");
            const id = json?.result?.id || json?.result?.uid || uid;
            if (!id) {
              reject(new Error("No video ID returned from upload"));
              return;
            }
            resolve(String(id));
          } catch (err) {
            reject(err);
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(form);
      });

      onSuccess(uploadId);
    } catch (e: any) {
      setError(e.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Upload className="w-6 h-6 text-emerald-400" />
            Upload Video
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="text-2xl text-gray-400">&times;</span>
          </button>
        </div>

        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Upload className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-semibold mb-1">Click to select video file</p>
                <p className="text-sm text-gray-400">MP4, MOV, AVI, or other video formats</p>
                <p className="text-xs text-gray-500 mt-2">Maximum file size: 400MB</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Video className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-xl text-gray-400">&times;</span>
              </button>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Uploading...</span>
                  <span className="text-emerald-400">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                <span className="text-xl">&times;</span>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!uploading && (
              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Upload to Cloudflare Stream
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChapterPage;
