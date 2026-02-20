"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  Upload,
  Video,
  FileText,
  Plus,
  X,
  Save,
  Eye,
  Trash2,
  Edit,
  Play,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Globe,
  Lock,
  Tag,
  Clock,
  Users,
  Award,
  Settings,
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

const CreateCoursePage = () => {
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
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const steps = [
    { id: 1, label: "Course Info", icon: BookOpen },
    { id: 2, label: "Curriculum", icon: Video },
    { id: 3, label: "Exercises", icon: FileText },
    { id: 4, label: "Resources", icon: Upload },
    { id: 5, label: "Settings", icon: Settings },
  ];

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

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement API call to save course
    setTimeout(() => {
      setIsSaving(false);
      router.push("/dealoforge/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-2">Create New Course</h1>
          <p className="text-gray-400">
            Build and publish your course to share knowledge with students worldwide
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-gradient-to-br from-gray-900/90 via-[#0f1a0f]/90 to-gray-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      activeStep >= step.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-800/50 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="mt-2 text-sm text-gray-400">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded ${
                      activeStep > step.id ? "bg-green-600" : "bg-gray-800/50"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Course Info */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-900/90 via-[#0f1a0f]/90 to-gray-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
              >
                <h2 className="text-2xl font-bold">Course Information</h2>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Course Thumbnail</label>
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
                            setCourseData({ ...courseData, thumbnail: null, thumbnailUrl: "" })
                          }
                          className="absolute top-2 right-2 bg-red-600 p-1 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label 
                        htmlFor="thumbnail-upload"
                        className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
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
                  <label className="block text-sm font-medium mb-2">Course Title *</label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="w-full px-4 py-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={courseData.subtitle}
                    onChange={(e) => setCourseData({ ...courseData, subtitle: e.target.value })}
                    placeholder="A brief description of your course"
                    className="w-full px-4 py-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) =>
                      setCourseData({ ...courseData, description: e.target.value })
                    }
                    placeholder="Describe what students will learn in this course..."
                    rows={6}
                    className="w-full px-4 py-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  />
                </div>

                {/* Category & Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={courseData.category}
                      onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Level *</label>
                    <select
                      value={courseData.level}
                      onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                      className="w-full px-4 py-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
                className="bg-gradient-to-br from-gray-900/90 via-[#0f1a0f]/90 to-gray-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Course Curriculum</h2>
                  <button
                    onClick={addVideo}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Video
                  </button>
                </div>

                {videos.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                    <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No videos added yet</p>
                    <button
                      onClick={addVideo}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      Add Your First Video
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((video, index) => (
                      <div
                        key={video.id}
                        className="bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Video className="w-6 h-6" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                              placeholder="Video Title"
                              className="w-full px-3 py-2 bg-gradient-to-br from-gray-900/80 via-[#0f1a0f]/80 to-gray-900/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                            />
                            <textarea
                              value={video.description}
                              onChange={(e) =>
                                updateVideo(video.id, { description: e.target.value })
                              }
                              placeholder="Video Description"
                              rows={2}
                              className="w-full px-3 py-2 bg-gradient-to-br from-gray-900/80 via-[#0f1a0f]/80 to-gray-900/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
                                  // Reset input so same file can be selected again
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
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg hover:from-gray-700/80 hover:via-gray-800/80 hover:to-gray-700/80 transition-colors cursor-pointer"
                              >
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">Upload Video</span>
                              </button>
                              {video.file && (
                                <span className="text-sm text-green-400">
                                  {video.file.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteVideo(video.id)}
                            className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
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
                className="bg-gradient-to-br from-gray-900/90 via-[#0f1a0f]/90 to-gray-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Exercises & Quizzes</h2>
                  <button
                    onClick={addExercise}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
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
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      Add Your First Exercise
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 rounded-lg p-4 border border-white/10"
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
                              className="w-full px-3 py-2 bg-gradient-to-br from-gray-900/80 via-[#0f1a0f]/80 to-gray-900/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                            />
                            <div className="flex items-center gap-4">
                              <select
                                value={exercise.type}
                                onChange={(e) =>
                                  updateExercise(exercise.id, {
                                    type: e.target.value as Exercise["type"],
                                  })
                                }
                                className="px-3 py-2 bg-gradient-to-br from-gray-900/80 via-[#0f1a0f]/80 to-gray-900/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
                                className="w-24 px-3 py-2 bg-gradient-to-br from-gray-900/80 via-[#0f1a0f]/80 to-gray-900/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => deleteExercise(exercise.id)}
                            className="p-2 hover:bg-red-600 rounded-lg transition-colors ml-4"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <button className="text-sm text-green-400 hover:text-green-300">
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
                className="bg-gradient-to-br from-gray-900/90 via-[#0f1a0f]/90 to-gray-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Course Resources</h2>
                  <button
                    onClick={addEbook}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
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
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      Add Your First Resource
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ebooks.map((ebook) => (
                      <div
                        key={ebook.id}
                        className="bg-gray-700 rounded-lg p-4 border border-gray-600 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <FileText className="w-8 h-8 text-gray-400" />
                          <input
                            type="text"
                            value={ebook.title}
                            onChange={(e) =>
                              setEbooks(
                                ebooks.map((item) =>
                                  item.id === ebook.id ? { ...item, title: e.target.value } : item
                                )
                              )
                            }
                            placeholder="Resource Title"
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <label className="flex items-center gap-2 cursor-pointer">
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
                          className="p-2 hover:bg-red-600 rounded-lg transition-colors ml-4"
                        >
                          <Trash2 className="w-5 h-5" />
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
                className="bg-gradient-to-br from-gray-900/90 via-[#0f1a0f]/90 to-gray-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
              >
                <h2 className="text-2xl font-bold">Course Settings</h2>

                {/* Pricing */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={courseData.isFree}
                      onChange={(e) =>
                        setCourseData({ ...courseData, isFree: e.target.checked })
                      }
                      className="w-5 h-5"
                    />
                    <label className="text-lg font-medium">Free Course</label>
                  </div>
                  {!courseData.isFree && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Price ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={courseData.price}
                          onChange={(e) =>
                            setCourseData({ ...courseData, price: e.target.value })
                          }
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    value={courseData.language}
                    onChange={(e) =>
                      setCourseData({ ...courseData, language: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
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
                  <label className="block text-sm font-medium mb-2">Course Visibility</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg cursor-pointer hover:from-gray-700/80 hover:via-gray-800/80 hover:to-gray-700/80 transition-all">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        className="w-4 h-4"
                        defaultChecked
                      />
                      <Globe className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-sm text-gray-400">
                          Anyone can find and enroll in this course
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg cursor-pointer hover:from-gray-700/80 hover:via-gray-800/80 hover:to-gray-700/80 transition-all">
                      <input type="radio" name="visibility" value="private" className="w-4 h-4" />
                      <Lock className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-sm text-gray-400">
                          Only students with the link can access
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between bg-gradient-to-br from-gray-900/90 via-[#0f1a0f]/90 to-gray-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <button
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
                className="px-6 py-3 bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 hover:from-gray-700/80 hover:via-gray-800/80 hover:to-gray-700/80 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {activeStep < steps.length ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
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

          {/* Sidebar - Course Preview */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/90 via-[#0f1a0f]/90 to-gray-900/90 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Course Preview</h3>
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-white/10 rounded-lg flex items-center justify-center relative">
                  {courseData.thumbnailUrl ? (
                    <Image
                      src={courseData.thumbnailUrl}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    {courseData.title || "Course Title"}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {courseData.subtitle || "Course subtitle"}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Videos:</span>
                    <span className="text-white">{videos.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Exercises:</span>
                    <span className="text-white">{exercises.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Resources:</span>
                    <span className="text-white">{ebooks.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;

