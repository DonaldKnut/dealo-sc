"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Rocket,
  CheckCircle,
  ArrowRight,
  Upload,
  Layout,
  Info,
  ChevronRight,
  Lightbulb,
  Play,
  ArrowLeft,
  Settings,
  BookOpen,
  Video,
  Layers,
  Star,
  ShieldCheck,
  Globe,
  Tag,
  DollarSign,
  Type,
  Zap,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Forge from "@/components/ForgeComponent";

type Price = {
  amount: number;
  currency: string;
  isFree: boolean;
};

type PreviewVideo = {
  url: string;
  duration: number;
  thumbnail?: string;
};

type BasicForm = {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  language: string;
  price: Price;
};

type UploadState = {
  uploading: boolean;
  progress: number;
  error: string | null;
};

type LectureDraft = {
  title: string;
  description: string;
  cloudflareUid?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CreateCustomCoursePage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [creating, setCreating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);

  const [basics, setBasics] = useState<BasicForm>({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    category: "",
    level: "beginner",
    language: "English",
    price: { amount: 0, currency: "NGN", isFree: true },
  });

  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [previewVideo, setPreviewVideo] = useState<PreviewVideo | null>(null);

  const [thumbUpload, setThumbUpload] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });
  const [videoUpload, setVideoUpload] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });

  const [newLecture, setNewLecture] = useState<LectureDraft>({
    title: "",
    description: "",
  });
  const [addedLectures, setAddedLectures] = useState<LectureDraft[]>([]);

  useEffect(() => {
    if (!basics.slug && basics.title) {
      setBasics((prev) => ({ ...prev, slug: toSlug(prev.title) }));
    }
  }, [basics.title, basics.slug]);

  const basicsValid = useMemo(() => {
    if (!basics.title.trim()) return false;
    if (!basics.slug.trim()) return false;
    if (!basics.description.trim()) return false;
    if (!basics.shortDescription.trim()) return false;
    if (!basics.category.trim()) return false;
    if (!basics.level) return false;
    if (!basics.price.isFree && basics.price.amount <= 0) return false;
    return true;
  }, [basics]);

  const mediaValid = useMemo(() => {
    if (!thumbnailUrl) return false;
    if (!previewVideo?.url) return false;
    if (!previewVideo?.duration || previewVideo.duration <= 0) return false;
    return true;
  }, [thumbnailUrl, previewVideo]);

  async function uploadThumbnail(file: File) {
    try {
      setThumbUpload({ uploading: true, progress: 0, error: null });
      const form = new FormData();
      form.append("file", file);
      form.append("prefix", "courses");
      const res = await fetch("/api/uploads/r2", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload thumbnail");
      }
      const json = await res.json();
      if (!json?.url) throw new Error("Invalid upload response");
      setThumbnailUrl(json.url);
      toast.success("Thumbnail uploaded successfully!");
    } catch (e: any) {
      setThumbUpload((s) => ({ ...s, error: e?.message || "Upload failed" }));
      toast.error(e?.message || "Thumbnail upload failed");
    } finally {
      setThumbUpload((s) => ({ ...s, uploading: false }));
    }
  }

  async function uploadToCloudflare(file: File): Promise<string> {
    setVideoUpload({ uploading: true, progress: 0, error: null });
    try {
      const urlRes = await fetch(`/api/videos/upload-url?size=${file.size}`, {
        cache: "no-store",
      });
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL } = await urlRes.json();
      if (!uploadURL) throw new Error("Upload URL missing");

      const uid = await new Promise<string>((resolve, reject) => {
        const form = new FormData();
        form.append("file", file);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadURL);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setVideoUpload((s) => ({ ...s, progress: pct }));
          }
        };
        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText || "{}");
            const id = json?.result?.id || json?.result?.uid;
            if (!id) return reject(new Error("No video id returned"));
            resolve(String(id));
          } catch (err) {
            reject(err);
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(form);
      });

      return uid;
    } catch (e: any) {
      setVideoUpload((s) => ({ ...s, error: e?.message || "Upload failed" }));
      throw e;
    } finally {
      setVideoUpload((s) => ({ ...s, uploading: false }));
    }
  }

  async function handleCreateCourse() {
    if (!basicsValid || !mediaValid) return;
    setCreating(true);
    setNotification(null);
    try {
      const payload = {
        title: basics.title,
        slug: basics.slug,
        description: basics.description,
        shortDescription: basics.shortDescription,
        thumbnail: thumbnailUrl,
        previewVideo: {
          url: previewVideo?.url,
          duration: previewVideo?.duration,
          thumbnail: previewVideo?.thumbnail || thumbnailUrl,
        },
        price: {
          amount: basics.price.isFree ? 0 : basics.price.amount,
          currency: basics.price.currency,
          isFree: basics.price.isFree,
        },
        category: basics.category,
        level: basics.level,
        language: basics.language,
        duration: 0,
        lectures: 0,
        tags: [],
        sections: [],
        requirements: [],
        learningOutcomes: [],
        targetAudience: [],
      } as any;

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to create course";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const json = await res.json();
      const created = json?.course;

      if (!created?._id) {
        throw new Error("Course id missing from response");
      }

      setCourseId(String(created._id));
      setStep(2);

      toast.success("New course created successfully!", {
        duration: 5000,
        icon: "🎉",
      });
    } catch (e: any) {
      const errorMsg = e?.message || "Failed to create course";
      setNotification(errorMsg);
      toast.error(errorMsg);
    } finally {
      setCreating(false);
    }
  }

  async function handleAddLecture() {
    if (!courseId) return;
    if (!newLecture.title.trim()) return;
    if (!newLecture.cloudflareUid) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newLecture.title,
          description: newLecture.description,
          url: newLecture.cloudflareUid,
          duration: newLecture.durationSeconds || 0,
          thumbnail: newLecture.thumbnailUrl || thumbnailUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed to add lecture");
      setAddedLectures((prev) => [...prev, newLecture]);
      setNewLecture({ title: "", description: "" });
      toast.success("Lecture added to course!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to add lecture");
    }
  }

  const stepperItems = [
    { id: 0, name: "Basics", icon: <BookOpen className="w-5 h-5" /> },
    { id: 1, name: "Media", icon: <Video className="w-5 h-5" /> },
    { id: 2, name: "Modules", icon: <Layers className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-emerald-950 selection:bg-emerald-500/30 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-50"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Rocket className="w-6 h-6 text-emerald-950" />
          </div>
          {/* Branding removed as per user request */}
        </div>
        <div className="flex items-center gap-4">
          {courseId && (
            <Button
              variant="outline"
              onClick={() => router.push(`/courses/${basics.slug}`)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              View Course
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => router.push("/dealoforge/create-course")}
            className="text-emerald-100/60 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Stepper Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Manual Setup</h4>
                  <p className="text-xs text-emerald-50/40">Step {step + 1} of 3</p>
                </div>
              </div>

              <div className="space-y-4">
                {stepperItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`group flex items-center gap-4 transition-all duration-300 ${step === idx ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step === idx ? 'bg-emerald-500 text-emerald-950 scale-110 shadow-lg shadow-emerald-500/20' :
                      step > idx ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
                      }`}>
                      {step > idx ? <CheckCircle className="w-5 h-5" /> : item.icon}
                    </div>
                    <span className={`font-bold text-sm ${step === idx ? 'text-white' : 'text-white/40'}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-8 border-white/5" />

              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Pro Tip</span>
                  </div>
                  <p className="text-xs text-emerald-50/60 leading-relaxed">
                    {step === 0 && "Your slug is and SEO-friendly version of your title. Keep it descriptive but concise."}
                    {step === 1 && "Courses with high-quality preview videos have 80% higher conversion rates."}
                    {step === 2 && "Break your course into small, manageable modules to keep students engaged."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl relative min-h-[700px] flex flex-col">
              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="w-full"
                  >
                    {/* Step 0: Basics */}
                    {step === 0 && (
                      <div className="space-y-10">
                        <div>
                          <h2 className="text-4xl font-black text-white mb-2">Fundamental <span className="text-emerald-500">Details</span></h2>
                          <p className="text-emerald-50/60">Start by defining the core identity of your educational masterpiece.</p>
                        </div>

                        <div className="space-y-8">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                                <Type className="w-3.5 h-3.5" /> Course Title
                              </label>
                              <input
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                value={basics.title}
                                onChange={(e) => setBasics({ ...basics, title: e.target.value })}
                                placeholder="e.g. Master React in 30 Days"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-emerald-100/40 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                                URL Slug (Auto-generated)
                              </label>
                              <input
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-emerald-100/40 cursor-not-allowed italic"
                                value={basics.slug}
                                readOnly
                                placeholder="master-react-in-30-days"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                              <Star className="w-3.5 h-3.5" /> Short Description
                            </label>
                            <input
                              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                              value={basics.shortDescription}
                              onChange={(e) => setBasics({ ...basics, shortDescription: e.target.value })}
                              placeholder="A catchy one-liner that appears on course cards"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                              Full Course Description
                            </label>
                            <textarea
                              className="w-full bg-black/40 border border-white/10 rounded-3xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                              rows={5}
                              value={basics.description}
                              onChange={(e) => setBasics({ ...basics, description: e.target.value })}
                              placeholder="Dive into the details of what students will achieve..."
                            />
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                                <Tag className="w-3.5 h-3.5" /> Category
                              </label>
                              <input
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                value={basics.category}
                                onChange={(e) => setBasics({ ...basics, category: e.target.value })}
                                placeholder="e.g. Design"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                                Difficulty Level
                              </label>
                              <select
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                                value={basics.level}
                                onChange={(e) => setBasics({ ...basics, level: e.target.value as any })}
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="all">All Levels</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-1">
                                <Globe className="w-3.5 h-3.5" /> Language
                              </label>
                              <input
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                value={basics.language}
                                onChange={(e) => setBasics({ ...basics, language: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="p-8 bg-emerald-500/5 rounded-[32px] border border-emerald-500/10 space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-bold">Pricing Model</h4>
                                <p className="text-xs text-emerald-50/40">Choose whether to charge students or offer for free.</p>
                              </div>
                              <div className="flex items-center gap-3 bg-black/20 p-1.5 rounded-2xl">
                                <button
                                  onClick={() => setBasics({ ...basics, price: { ...basics.price, isFree: true } })}
                                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${basics.price.isFree ? 'bg-emerald-500 text-emerald-950 shadow-lg' : 'text-white/40 hover:text-white'}`}
                                >
                                  Free
                                </button>
                                <button
                                  onClick={() => setBasics({ ...basics, price: { ...basics.price, isFree: false } })}
                                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${!basics.price.isFree ? 'bg-emerald-500 text-emerald-950 shadow-lg' : 'text-white/40 hover:text-white'}`}
                                >
                                  Paid
                                </button>
                              </div>
                            </div>

                            {!basics.price.isFree && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid md:grid-cols-2 gap-6"
                              >
                                <div className="space-y-2">
                                  <label className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-1">Amount</label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                    <input
                                      type="number"
                                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                      value={basics.price.amount}
                                      onChange={(e) => setBasics({ ...basics, price: { ...basics.price, amount: Number(e.target.value) } })}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-1">Currency</label>
                                  <input
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    value={basics.price.currency}
                                    onChange={(e) => setBasics({ ...basics, price: { ...basics.price, currency: e.target.value } })}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Media */}
                    {step === 1 && (
                      <div className="space-y-10">
                        <div>
                          <h2 className="text-4xl font-black text-white mb-2">Visual <span className="text-emerald-500">Identity</span></h2>
                          <p className="text-emerald-50/60">Upload components that will represent your course visually to prospective students.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Thumbnail Upload */}
                          <div className="space-y-4">
                            <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest px-1">Course Thumbnail</label>
                            <div className="relative group aspect-video bg-black/40 border border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-6 hover:border-emerald-500/30 transition-all">
                              {thumbnailUrl ? (
                                <>
                                  <Image src={thumbnailUrl} alt="Thumbnail" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                  <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="outline" className="bg-white/10 border-white/20 text-white pointer-events-none">Change Image</Button>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center space-y-4">
                                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-emerald-500/20 transition-colors">
                                    <Upload className="w-8 h-8 text-emerald-500" />
                                  </div>
                                  <div>
                                    <p className="text-white font-bold">Upload Snapshot</p>
                                    <p className="text-emerald-100/20 text-xs mt-1 italic">JPG or PNG (16:9 recommended)</p>
                                  </div>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => e.target.files?.[0] && uploadThumbnail(e.target.files[0])}
                              />
                              {thumbUpload.uploading && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-4 z-20">
                                  <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                  <span className="text-emerald-400 font-bold text-xs">Uploading...</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Preview Video Upload */}
                          <div className="space-y-4">
                            <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest px-1">Preview Video</label>
                            <div className="relative group aspect-video bg-black/40 border border-white/10 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-6 hover:border-emerald-500/30 transition-all">
                              {previewVideo?.url ? (
                                <div className="text-center space-y-4">
                                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                                    <Play className="w-8 h-8 text-emerald-950 ml-1" />
                                  </div>
                                  <div>
                                    <p className="text-emerald-400 font-bold">Video Ready</p>
                                    <p className="text-emerald-100/20 text-xs mt-1 italic uppercase tracking-tighter">ID: {previewVideo.url}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center space-y-4">
                                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-emerald-500/20 transition-colors">
                                    <Play className="w-8 h-8 text-emerald-500" />
                                  </div>
                                  <div>
                                    <p className="text-white font-bold">Upload Preview</p>
                                    <p className="text-emerald-100/20 text-xs mt-1 italic">MP4 or MOV (under 500MB)</p>
                                  </div>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="video/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  try {
                                    const uid = await uploadToCloudflare(f);
                                    setPreviewVideo({ url: uid, duration: 60, thumbnail: thumbnailUrl });
                                    toast.success("Preview video uploaded!");
                                  } catch { }
                                }}
                              />
                              {videoUpload.uploading && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-6 z-20 px-10">
                                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full bg-emerald-500"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${videoUpload.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">{videoUpload.progress}% Uploaded</span>
                                </div>
                              )}
                            </div>
                            <div className="pt-2">
                              <label className="text-emerald-100/40 text-[10px] font-black uppercase tracking-[0.2em] block mb-2 px-1">Preview Duration (Sec)</label>
                              <input
                                type="number"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                                value={previewVideo?.duration || 0}
                                onChange={(e) => setPreviewVideo(p => ({ ...p!, duration: Number(e.target.value) }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Modules */}
                    {step === 2 && (
                      <div className="space-y-10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-4xl font-black text-white mb-2">Build <span className="text-emerald-500">Modules</span></h2>
                            <p className="text-emerald-50/60">Your course is created! Now add the knowledge layers.</p>
                          </div>
                          <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Section 1 Active</span>
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-10">
                          {/* New Lecture Form */}
                          <div className="bg-black/20 rounded-[32px] border border-white/5 p-8 space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest px-1">Lecture Title</label>
                                <input
                                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                                  value={newLecture.title}
                                  onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                                  placeholder="e.g. Introduction to the course"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-emerald-400 text-xs font-bold uppercase tracking-widest px-1">Lecture Description</label>
                                <textarea
                                  className="w-full bg-black/40 border border-white/10 rounded-3xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                                  rows={3}
                                  value={newLecture.description}
                                  onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
                                  placeholder="Explain what students will learn..."
                                />
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="relative group aspect-video bg-black/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 hover:border-emerald-500/30 transition-all">
                                  {newLecture.cloudflareUid ? (
                                    <div className="text-center">
                                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                      <span className="text-emerald-400 font-bold text-[10px] uppercase">Video Ready</span>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <Upload className="w-6 h-6 text-white/20 mx-auto mb-2" />
                                      <span className="text-white/20 font-bold text-[10px] uppercase">Upload Video</span>
                                    </div>
                                  )}
                                  <input
                                    type="file"
                                    accept="video/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={async (e) => {
                                      const f = e.target.files?.[0];
                                      if (!f) return;
                                      try {
                                        const uid = await uploadToCloudflare(f);
                                        setNewLecture(p => ({ ...p, cloudflareUid: uid }));
                                        toast.success("Lecture video uploaded!");
                                      } catch { }
                                    }}
                                  />
                                  {videoUpload.uploading && (
                                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center px-4 z-20">
                                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                                        <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${videoUpload.progress}%` }} />
                                      </div>
                                      <span className="text-emerald-400 text-[9px] font-black uppercase tracking-tighter">{videoUpload.progress}%</span>
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <label className="text-emerald-100/40 text-[10px] font-black uppercase tracking-[0.2em] px-1">Duration (Sec)</label>
                                    <input
                                      type="number"
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                                      value={newLecture.durationSeconds || 0}
                                      onChange={(e) => setNewLecture(p => ({ ...p, durationSeconds: Number(e.target.value) }))}
                                    />
                                  </div>
                                  <Button
                                    onClick={handleAddLecture}
                                    disabled={!newLecture.title || !newLecture.cloudflareUid}
                                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-2xl shadow-xl shadow-emerald-500/10"
                                  >
                                    Add Lecture
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Added Lectures List */}
                          <div className="space-y-6">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs px-1">Lectures Hierarchy</h3>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
                              {addedLectures.length === 0 && (
                                <div className="p-12 border-2 border-dashed border-white/5 rounded-[40px] text-center">
                                  <Layers className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                  <p className="text-white/20 font-medium italic">No lectures added to this section yet.</p>
                                </div>
                              )}
                              {addedLectures.map((lec, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="p-6 bg-white/5 border border-white/10 rounded-3xl group flex items-start gap-4 hover:border-emerald-500/30 transition-all"
                                >
                                  <div className="w-10 h-10 shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-bold text-sm">
                                    {(idx + 1).toString().padStart(2, '0')}
                                  </div>
                                  <div className="flex-grow">
                                    <h4 className="text-white font-bold mb-1">{lec.title}</h4>
                                    <p className="text-emerald-50/20 text-xs line-clamp-1">{lec.description || "No description provided"}</p>
                                  </div>
                                  <div className="shrink-0 flex items-center gap-2">
                                    <span className="text-emerald-400 text-[10px] font-black bg-emerald-500/10 px-2 py-1 rounded-lg">{(lec.durationSeconds || 0)}s</span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Enhanced Navigation */}
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <Button
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                  className="h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10"
                >
                  Back
                </Button>

                <div className="flex items-center gap-4">
                  {step === 0 && (
                    <Button
                      disabled={!basicsValid}
                      onClick={() => setStep(1)}
                      className="h-14 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold shadow-xl shadow-emerald-500/20 group transform hover:scale-105"
                    >
                      Continue to Media <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                  {step === 1 && (
                    <Button
                      disabled={!basicsValid || !mediaValid || creating}
                      onClick={handleCreateCourse}
                      className="h-14 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold shadow-xl shadow-emerald-500/20 group transform hover:scale-105"
                    >
                      {creating ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                          <span>Establishing Link...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Rocket className="w-5 h-5" />
                          <span>Create Course</span>
                        </div>
                      )}
                    </Button>
                  )}
                  {step === 2 && (
                    <Button
                      onClick={() => router.push("/dealoforge/dashboard")}
                      className="h-14 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold shadow-xl shadow-emerald-500/20 group transform hover:scale-105"
                    >
                      Complete Setup
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Info Cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-6 bg-white/5 border border-white/10 rounded-3xl">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mt-1" />
                <div>
                  <h5 className="text-white font-bold text-sm mb-1">Encrypted Logic</h5>
                  <p className="text-xs text-emerald-50/40 leading-relaxed">Your intellectual property is protected by military-grade security.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-6 bg-white/5 border border-white/10 rounded-3xl">
                <Globe className="w-5 h-5 text-emerald-500 mt-1" />
                <div>
                  <h5 className="text-white font-bold text-sm mb-1">Scale Globally</h5>
                  <p className="text-xs text-emerald-50/40 leading-relaxed">Instantly available across 180+ regions and territories.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-6 bg-white/5 border border-white/10 rounded-3xl">
                <Sparkles className="w-5 h-5 text-emerald-500 mt-1" />
                <div>
                  <h5 className="text-white font-bold text-sm mb-1">AI Enhanced UI</h5>
                  <p className="text-xs text-emerald-50/40 leading-relaxed">Your course portal is optimized for student retention using AI metrics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto px-6 mt-10 space-y-20">
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/[0.07] transition-all"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/10">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-white font-bold mb-2 text-lg">Instant Rendering</h4>
            <p className="text-xs text-emerald-50/40 leading-relaxed">Your content is processed and optimized for all devices in real-time using our proprietary AI algorithms.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/[0.07] transition-all"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/10">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-white font-bold mb-2 text-lg">Secure Licensing</h4>
            <p className="text-xs text-emerald-50/40 leading-relaxed">Advanced DRM protection ensures your videos and materials are safe from unauthorized distribution.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/[0.07] transition-all"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/10">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-white font-bold mb-2 text-lg">Smart Monetization</h4>
            <p className="text-xs text-emerald-50/40 leading-relaxed">Dynamic pricing models and global payment gateways to maximize your international student reach.</p>
          </motion.div>
        </div>

        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-[40px] p-10 md:p-16 text-center"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Star className="w-4 h-4 fill-emerald-500" /> Creator Success System
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Turn Your <span className="text-emerald-500 italic">Expertise</span> Into A <span className="underline decoration-emerald-500/30">Sustainable Business.</span>
            </h3>
            <p className="text-emerald-50/40 font-medium">
              You provide the knowledge, we provide the platform. From complex video hosting to student analytics, we handle the heavy lifting while you focus on teaching.
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-black text-white">99.9%</div>
                <div className="text-[10px] text-emerald-50/30 font-bold uppercase tracking-widest">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white">24h</div>
                <div className="text-[10px] text-emerald-50/30 font-bold uppercase tracking-widest">Fast Payouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white">4.9/5</div>
                <div className="text-[10px] text-emerald-50/30 font-bold uppercase tracking-widest">Creator Rating</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <FooterInfo />
      <Forge />
    </div>
  );
}

const FooterInfo: React.FC = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1 }}
    className="py-20 text-center relative z-10"
  >
    <div className="flex justify-center items-center gap-6 mb-4">
      <Star className="w-5 h-5 text-emerald-500" />
      <span className="text-emerald-100/20 font-bold uppercase tracking-widest text-xs">Premium Manual Flow</span>
      <Star className="w-5 h-5 text-emerald-500" />
    </div>
    <p className="text-emerald-50/10 text-[10px] font-medium tracking-widest uppercase">&copy; 2026 DEALO FORGE • PERSONALIZED CURRICULUM SYSTEM</p>
  </motion.footer>
);
