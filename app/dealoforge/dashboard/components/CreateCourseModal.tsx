"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  Upload,
  Video,
  FileText,
  Plus,
  X,
  Save,
  Trash2,
  Settings,
  DollarSign,
  Globe,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Video {
  id: string;
  title: string;
  description: string;
  duration?: string;
  file?: File;
  url?: string;
  order: number;
}

interface Exercise {
  id: string;
  title: string;
  type: "quiz" | "assignment" | "project";
  questions: Array<{
    id: string;
    question: string;
    type: "multiple-choice" | "true-false" | "short-answer";
    options?: string[];
    correctAnswer?: string;
  }>;
  points: number;
  dueDate?: string;
}

interface Ebook {
  id: string;
  title: string;
  file?: File;
  url?: string;
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCourseModal = ({ isOpen, onClose }: CreateCourseModalProps) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "beginner",
    language: "english",
    price: "",
    isFree: false,
    thumbnail: null as File | null,
    thumbnailUrl: "",
  });

  const [videos, setVideos] = useState<Video[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const modalRef = useRef<HTMLDivElement>(null);

  const steps = [
    { id: 1, label: "Course Info", icon: BookOpen },
    { id: 2, label: "Curriculum", icon: Video },
    { id: 3, label: "Exercises", icon: FileText },
    { id: 4, label: "Resources", icon: Upload },
    { id: 5, label: "Settings", icon: Settings },
  ];

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveStep(1);
      setCourseData({
        title: "",
        subtitle: "",
        description: "",
        category: "",
        level: "beginner",
        language: "english",
        price: "",
        isFree: false,
        thumbnail: null,
        thumbnailUrl: "",
      });
      setVideos([]);
      setExercises([]);
      setEbooks([]);
    }
  }, [isOpen]);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData({
        ...courseData,
        thumbnail: file,
        thumbnailUrl: URL.createObjectURL(file),
      });
    }
  };

  const addVideo = () => {
    const newVideo: Video = {
      id: Date.now().toString(),
      title: "",
      description: "",
      order: videos.length + 1,
    };
    setVideos([...videos, newVideo]);
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      title: "",
      type: "quiz",
      questions: [],
      points: 10,
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(exercises.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((e) => e.id !== id));
  };

  const addEbook = () => {
    const newEbook: Ebook = {
      id: Date.now().toString(),
      title: "",
    };
    setEbooks([...ebooks, newEbook]);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!courseData.title.trim()) {
        newErrors.title = "Course title is required";
      }
      if (!courseData.description.trim()) {
        newErrors.description = "Course description is required";
      }
      if (!courseData.category) {
        newErrors.category = "Please select a category";
      }
    } else if (step === 2) {
      if (videos.length === 0) {
        newErrors.videos = "Please add at least one video to your course";
      } else {
        // Validate each video has a title
        videos.forEach((video, index) => {
          if (!video.title.trim()) {
            newErrors[`video-${video.id}`] = `Video ${index + 1} needs a title`;
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
      setErrors({});
    }
  };

  const handlePreviousStep = () => {
    setActiveStep(Math.max(1, activeStep - 1));
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateStep(activeStep)) {
      return;
    }
    setIsSaving(true);
    // TODO: Implement API call to save course
    setTimeout(() => {
      setIsSaving(false);
      onClose();
      router.refresh();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-7xl max-h-[90vh] bg-gradient-to-br from-black via-[#0f1a0f] to-black border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/20 overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-emerald-900/20 via-green-900/20 to-emerald-900/20">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Course</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Build and publish your course to share knowledge with students worldwide
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-red-600/20 border border-white/10 flex items-center justify-center transition-colors group"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-gray-900/50 via-[#0f1a0f]/50 to-gray-900/50">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            activeStep >= step.id
                              ? "bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-gray-800/50 text-gray-400"
                          }`}
                        >
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className="mt-2 text-xs text-gray-400">{step.label}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`h-1 flex-1 mx-2 rounded ${
                            activeStep > step.id
                              ? "bg-gradient-to-r from-emerald-400 to-green-500"
                              : "bg-gray-800/50"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                  {/* Step 1: Course Info */}
                  {activeStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold text-white">Course Information</h3>

                      {/* Thumbnail Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Course Thumbnail
                        </label>
                        <div className="flex items-center gap-4">
                          {courseData.thumbnailUrl ? (
                            <div className="relative w-48 h-32">
                              <Image
                                src={courseData.thumbnailUrl}
                                alt="Thumbnail"
                                fill
                                className="object-cover rounded-lg"
                                unoptimized
                              />
                              <button
                                onClick={() =>
                                  setCourseData({
                                    ...courseData,
                                    thumbnail: null,
                                    thumbnailUrl: "",
                                  })
                                }
                                className="absolute top-2 right-2 bg-red-600 p-1 rounded-full hover:bg-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="thumbnail-upload"
                              className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors"
                            >
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-400">Upload Thumbnail</span>
                              <input
                                id="thumbnail-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleThumbnailUpload}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          value={courseData.title}
                          onChange={(e) => {
                            setCourseData({ ...courseData, title: e.target.value });
                            if (errors.title) {
                              setErrors({ ...errors, title: "" });
                            }
                          }}
                          placeholder="e.g., Complete Web Development Bootcamp"
                          className={`w-full px-4 py-3 bg-gray-800/50 border ${
                            errors.title ? "border-red-500" : "border-white/10"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500`}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                        )}
                      </div>

                      {/* Subtitle */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={courseData.subtitle}
                          onChange={(e) =>
                            setCourseData({ ...courseData, subtitle: e.target.value })
                          }
                          placeholder="A brief description of your course"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Description *
                        </label>
                        <textarea
                          value={courseData.description}
                          onChange={(e) => {
                            setCourseData({ ...courseData, description: e.target.value });
                            if (errors.description) {
                              setErrors({ ...errors, description: "" });
                            }
                          }}
                          placeholder="Describe what students will learn in this course..."
                          rows={6}
                          className={`w-full px-4 py-3 bg-gray-800/50 border ${
                            errors.description ? "border-red-500" : "border-white/10"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500 resize-none`}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                        )}
                      </div>

                      {/* Category & Level */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Category *
                          </label>
                          <select
                            value={courseData.category}
                            onChange={(e) => {
                              setCourseData({ ...courseData, category: e.target.value });
                              if (errors.category) {
                                setErrors({ ...errors, category: "" });
                              }
                            }}
                            className={`w-full px-4 py-3 bg-gray-800/50 border ${
                              errors.category ? "border-red-500" : "border-white/10"
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white`}
                          >
                            <option value="">Select Category</option>
                            <option value="web-development">Web Development</option>
                            <option value="mobile-development">Mobile Development</option>
                            <option value="data-science">Data Science</option>
                            <option value="design">Design</option>
                            <option value="business">Business</option>
                            <option value="marketing">Marketing</option>
                            <option value="photography">Photography</option>
                            <option value="music">Music</option>
                          </select>
                          {errors.category && (
                            <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Level *
                          </label>
                          <select
                            value={courseData.level}
                            onChange={(e) =>
                              setCourseData({ ...courseData, level: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Curriculum (Videos) */}
                  {activeStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Course Curriculum</h3>
                        <button
                          onClick={addVideo}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Video
                        </button>
                      </div>

                      {errors.videos && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg mb-4">
                          <p className="text-sm text-red-400">{errors.videos}</p>
                        </div>
                      )}
                      {videos.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                          <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No videos added yet</p>
                          <button
                            onClick={addVideo}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg"
                          >
                            Add Your First Video
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {videos.map((video, index) => (
                            <div
                              key={video.id}
                              className="bg-gray-800/50 rounded-lg p-4 border border-white/10"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                                  <Video className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div className="flex-1 space-y-3">
                                  <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) => {
                                      updateVideo(video.id, { title: e.target.value });
                                      if (errors[`video-${video.id}`]) {
                                        const newErrors = { ...errors };
                                        delete newErrors[`video-${video.id}`];
                                        setErrors(newErrors);
                                      }
                                    }}
                                    placeholder="Video Title"
                                    className={`w-full px-3 py-2 bg-gray-900/50 border ${
                                      errors[`video-${video.id}`]
                                        ? "border-red-500"
                                        : "border-white/10"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500`}
                                  />
                                  {errors[`video-${video.id}`] && (
                                    <p className="mt-1 text-xs text-red-400">
                                      {errors[`video-${video.id}`]}
                                    </p>
                                  )}
                                  <textarea
                                    value={video.description}
                                    onChange={(e) =>
                                      updateVideo(video.id, { description: e.target.value })
                                    }
                                    placeholder="Video Description"
                                    rows={2}
                                    className="w-full px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500 resize-none"
                                  />
                                  <div className="flex items-center gap-4">
                                    <input
                                      type="file"
                                      accept="video/*"
                                      className="hidden"
                                      ref={(el) => {
                                        if (el) {
                                          fileInputRefs.current.set(video.id, el);
                                        } else {
                                          fileInputRefs.current.delete(video.id);
                                        }
                                      }}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          updateVideo(video.id, { file });
                                        }
                                        if (e.target) {
                                          e.target.value = "";
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const input = fileInputRefs.current.get(video.id);
                                        if (input) {
                                          input.click();
                                        }
                                      }}
                                      className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg hover:bg-gray-800/50 transition-colors"
                                    >
                                      <Upload className="w-4 h-4" />
                                      <span className="text-sm">Upload Video</span>
                                    </button>
                                    {video.file && (
                                      <span className="text-sm text-emerald-400">
                                        {video.file.name}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => deleteVideo(video.id)}
                                  className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-5 h-5 text-red-400" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Exercises */}
                  {activeStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Exercises & Quizzes</h3>
                        <button
                          onClick={addExercise}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Exercise
                        </button>
                      </div>

                      {exercises.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No exercises added yet</p>
                          <button
                            onClick={addExercise}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg"
                          >
                            Add Your First Exercise
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {exercises.map((exercise) => (
                            <div
                              key={exercise.id}
                              className="bg-gray-800/50 rounded-lg p-4 border border-white/10"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 space-y-3">
                                  <input
                                    type="text"
                                    value={exercise.title}
                                    onChange={(e) =>
                                      updateExercise(exercise.id, { title: e.target.value })
                                    }
                                    placeholder="Exercise Title"
                                    className="w-full px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
                                  />
                                  <div className="flex items-center gap-4">
                                    <select
                                      value={exercise.type}
                                      onChange={(e) =>
                                        updateExercise(exercise.id, {
                                          type: e.target.value as Exercise["type"],
                                        })
                                      }
                                      className="px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                                    >
                                      <option value="quiz">Quiz</option>
                                      <option value="assignment">Assignment</option>
                                      <option value="project">Project</option>
                                    </select>
                                    <input
                                      type="number"
                                      value={exercise.points}
                                      onChange={(e) =>
                                        updateExercise(exercise.id, {
                                          points: parseInt(e.target.value),
                                        })
                                      }
                                      placeholder="Points"
                                      className="w-24 px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={() => deleteExercise(exercise.id)}
                                  className="p-2 hover:bg-red-600/20 rounded-lg transition-colors ml-4"
                                >
                                  <Trash2 className="w-5 h-5 text-red-400" />
                                </button>
                              </div>
                              <button className="text-sm text-emerald-400 hover:text-emerald-300">
                                + Add Questions
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4: Resources (Ebooks) */}
                  {activeStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Course Resources</h3>
                        <button
                          onClick={addEbook}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Resource
                        </button>
                      </div>

                      {ebooks.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No resources added yet</p>
                          <button
                            onClick={addEbook}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg"
                          >
                            Add Your First Resource
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {ebooks.map((ebook) => (
                            <div
                              key={ebook.id}
                              className="bg-gray-800/50 rounded-lg p-4 border border-white/10 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <FileText className="w-8 h-8 text-emerald-400" />
                                <input
                                  type="text"
                                  value={ebook.title}
                                  onChange={(e) =>
                                    setEbooks(
                                      ebooks.map((item) =>
                                        item.id === ebook.id
                                          ? { ...item, title: e.target.value }
                                          : item
                                      )
                                    )
                                  }
                                  placeholder="Resource Title"
                                  className="flex-1 px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
                                />
                                <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg hover:bg-gray-800/50 transition-colors">
                                  <Upload className="w-4 h-4" />
                                  <span className="text-sm">Upload PDF</span>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setEbooks(
                                          ebooks.map((e) =>
                                            e.id === ebook.id ? { ...e, file } : e
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <button
                                onClick={() => setEbooks(ebooks.filter((e) => e.id !== ebook.id))}
                                className="p-2 hover:bg-red-600/20 rounded-lg transition-colors ml-4"
                              >
                                <Trash2 className="w-5 h-5 text-red-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 5: Settings */}
                  {activeStep === 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold text-white">Course Settings</h3>

                      {/* Pricing */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={courseData.isFree}
                            onChange={(e) =>
                              setCourseData({ ...courseData, isFree: e.target.checked })
                            }
                            className="w-5 h-5 accent-emerald-500"
                          />
                          <label className="text-lg font-medium text-gray-300">Free Course</label>
                        </div>
                        {!courseData.isFree && (
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                              Price ($)
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="number"
                                value={courseData.price}
                                onChange={(e) =>
                                  setCourseData({ ...courseData, price: e.target.value })
                                }
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Language
                        </label>
                        <select
                          value={courseData.language}
                          onChange={(e) =>
                            setCourseData({ ...courseData, language: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="chinese">Chinese</option>
                        </select>
                      </div>

                      {/* Visibility */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Course Visibility
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3 p-3 bg-gray-800/50 border border-white/10 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-all">
                            <input
                              type="radio"
                              name="visibility"
                              value="public"
                              className="w-4 h-4 accent-emerald-500"
                              defaultChecked
                            />
                            <Globe className="w-5 h-5 text-emerald-400" />
                            <div>
                              <div className="font-medium text-white">Public</div>
                              <div className="text-sm text-gray-400">
                                Anyone can find and enroll in this course
                              </div>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-gray-800/50 border border-white/10 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-all">
                            <input
                              type="radio"
                              name="visibility"
                              value="private"
                              className="w-4 h-4 accent-emerald-500"
                            />
                            <Lock className="w-5 h-5 text-emerald-400" />
                            <div>
                              <div className="font-medium text-white">Private</div>
                              <div className="text-sm text-gray-400">
                                Only students with the link can access
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer with Navigation */}
              <div className="flex items-center justify-between p-6 border-t border-white/10 bg-gradient-to-r from-gray-900/50 via-[#0f1a0f]/50 to-gray-900/50">
                <button
                  onClick={handlePreviousStep}
                  disabled={activeStep === 1}
                  className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                >
                  Previous
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 rounded-lg transition-colors text-white"
                  >
                    Cancel
                  </button>
                  {activeStep < steps.length ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-colors text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-colors disabled:opacity-50 text-white font-semibold"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Course
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateCourseModal;

