"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PlayCircle,
  Clock,
  BookOpen,
  Award,
  Layers,
  User,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface PreviewVideo {
  title: string;
  description: string;
  channelTitle: string;
  videoUrl: string;
  thumbnail: string;
}

interface PreviewLecture {
  lecture_title: string;
  lecture_description?: string;
  duration: string;
}

interface PreviewChapter {
  chapter_number?: number;
  chapter_title?: string;
  chapter_description?: string;
  topics?: string[];
  video_lectures?: PreviewLecture[];
}

interface PreviewInstructor {
  firstName?: string;
  avatar?: string;
}

interface PreviewCourse {
  _id: string;
  name: string;
  category: string;
  level: string;
  courseDuration: string;
  noOfChapters: number;
  addVideo?: boolean;
  courseBanner?: string;
  publish?: boolean;
  createdAt?: string;
  courseOutput?: {
    overview?: string;
    chapters?: PreviewChapter[];
  };
  videos?: PreviewVideo[];
  createdBy?: PreviewInstructor;
}

const levelLabel = (level?: string) => {
  if (!level) return "All levels";
  switch (level.toUpperCase()) {
    case "BEGINNER":
      return "Beginner level";
    case "INTERMEDIATE":
      return "Intermediate level";
    case "ADVANCE":
    case "ADVANCED":
      return "Advanced level";
    default:
      return level;
  }
};

const InstructorCoursePreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<PreviewCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/dashboard/courses/${id}`, {
          cache: "no-store",
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          console.error("Course fetch error:", {
            status: res.status,
            statusText: res.statusText,
            error: errorData,
          });
          
          if (res.status === 403) {
            throw new Error(errorData.error || "You don't have permission to view this course.");
          } else if (res.status === 404) {
            throw new Error("Course not found. It may have been deleted or doesn't exist.");
          } else if (res.status === 401) {
            throw new Error("Please log in to view this course.");
          } else {
            throw new Error(errorData.error || `Failed to load course (${res.status})`);
          }
        }
        
        const data = await res.json();
        setCourse(data);
      } catch (e: any) {
        console.error("Error fetching course:", e);
        setError(e.message || "We couldn't load this course preview right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const primaryVideo =
    course?.videos && course.videos.length > 0 ? course.videos[0] : null;

  const chapters = course?.courseOutput?.chapters || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050b07] to-black text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push("/dealoforge/dashboard")}
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to dashboard</span>
          </button>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Instructor preview – how learners will see this course
            </span>
            {course?.publish !== undefined && (
              <span
                className={`px-3 py-1 rounded-full border text-xs ${
                  course.publish
                    ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-300"
                    : "bg-yellow-500/10 border-yellow-500/60 text-yellow-300"
                }`}
              >
                {course.publish ? "Published" : "Draft"}
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Loading / error states */}
        {loading && (
          <div className="space-y-6">
            <div className="h-6 w-56 bg-white/10 rounded-lg animate-pulse" />
            <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-8">
              <div className="space-y-4">
                <div className="aspect-video rounded-2xl bg-white/5 animate-pulse" />
                <div className="h-4 w-40 bg-white/10 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto text-center space-y-4">
            <p className="text-lg font-semibold">{error}</p>
            <p className="text-gray-400 text-sm">
              Make sure you&apos;re logged in and that this course still exists.
            </p>
          </div>
        )}

        {!loading && course && (
          <>
            {/* Course header */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80 mb-3">
                Dealo Forge • Course preview
              </p>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-3">
                {course.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
                {course.courseOutput?.overview ||
                  "This is how learners will experience your course content, videos and chapters on Dealo."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  {course.category}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  {course.courseDuration} total length
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  {course.noOfChapters} chapters
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Award className="w-4 h-4 text-emerald-400" />
                  {levelLabel(course.level)}
                </span>
              </div>
            </motion.section>

            {/* Main content */}
            <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)] items-start">
              {/* Left: video + overview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="space-y-6"
              >
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 shadow-xl shadow-emerald-500/10">
                  <div className="aspect-video bg-black/80 relative">
                    {primaryVideo?.videoUrl ? (
                      <video
                        className="w-full h-full object-cover"
                        src={primaryVideo.videoUrl}
                        controls
                        poster={primaryVideo.thumbnail}
                      />
                    ) : course.courseBanner ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.courseBanner}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
                        <PlayCircle className="w-12 h-12 text-emerald-400" />
                        <p className="text-sm">
                          No video attached yet. Learners will see your course
                          banner here.
                        </p>
                      </div>
                    )}

                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 z-10">
                      <div className="flex items-center gap-3 text-xs sm:text-sm">
                        <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium leading-tight">
                            {course.createdBy?.firstName || "You"}
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-300/90">
                            Instructor view
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/dealoforge/create-course/${course._id}`
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs sm:text-sm font-semibold px-4 py-2 shadow-lg shadow-emerald-500/40 transition-transform hover:scale-[1.02]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Edit course content
                      </button>
                    </div>
                  </div>
                </div>

                {/* What learners see text */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 space-y-3">
                  <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    How this page feels to learners
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Your course opens with a cinematic hero video (or banner),
                    a clean overview, and a structured chapter layout on the
                    right. Everything is tuned for focus, clarity, and
                    completion – just like top-tier platforms, but with
                    Dealo&apos;s own identity.
                  </p>
                </div>
              </motion.div>

              {/* Right: curriculum */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-black p-5 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                        Course structure
                      </p>
                      <h2 className="text-lg font-semibold">Chapters & flow</h2>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-black/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {chapters.length} chapters
                    </div>
                  </div>
                  <p className="text-xs text-emerald-100/80 mb-2">
                    Learners can see exactly where they are, how long each
                    piece will take, and what&apos;s coming next.
                  </p>
                </div>

                <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-transparent">
                  {chapters.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-600/70 bg-black/40 px-4 py-6 text-sm text-gray-300 text-center">
                      You haven&apos;t generated any chapters yet. Once you do,
                      they&apos;ll appear here exactly as learners will see
                      them.
                    </div>
                  )}

                  {chapters.map((chapter, index) => (
                    <div
                      key={`${chapter.chapter_number}-${chapter.chapter_title}-${index}`}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-300/80 mb-1">
                            Chapter {chapter.chapter_number || index + 1}
                          </p>
                          <h3 className="text-sm sm:text-base font-semibold mb-1">
                            {chapter.chapter_title || "Untitled chapter"}
                          </h3>
                          {chapter.chapter_description && (
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                              {chapter.chapter_description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-white/10 px-2 py-1 text-[11px] text-gray-300">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            {chapter.video_lectures?.[0]?.duration ||
                              course.courseDuration}
                          </span>
                          <span className="text-[11px] text-emerald-300">
                            {chapter.video_lectures?.length || 0} lectures
                          </span>
                        </div>
                      </div>

                      {chapter.video_lectures && chapter.video_lectures.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {chapter.video_lectures.map((lecture, idx) => (
                            <div
                              key={`${lecture.lecture_title}-${idx}`}
                              className="flex items-center justify-between gap-3 rounded-lg bg-black/40 px-3 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <div>
                                  <p className="text-xs font-medium">
                                    {lecture.lecture_title}
                                  </p>
                                  {lecture.lecture_description && (
                                    <p className="text-[11px] text-gray-400 line-clamp-1">
                                      {lecture.lecture_description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-[11px] text-gray-300">
                                {lecture.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {chapter.topics && chapter.topics.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {chapter.topics.slice(0, 4).map((topic, idx) => (
                            <span
                              key={`${topic}-${idx}`}
                              className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-[11px] text-gray-200"
                            >
                              {topic}
                            </span>
                          ))}
                          {chapter.topics.length > 4 && (
                            <span className="text-[11px] text-gray-400">
                              +{chapter.topics.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.aside>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default InstructorCoursePreviewPage;


