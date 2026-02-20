"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { BookOpen, Layers, Sparkles, Video, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";

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

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CustomCourseModal({
  onClose,
}: {
  onClose: () => void;
}) {
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
    } catch (e: any) {
      setThumbUpload((s) => ({ ...s, error: e?.message || "Upload failed" }));
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
        console.error("Course creation failed:", errorMessage);
        throw new Error(errorMessage);
      }
      
      const json = await res.json();
      const created = json?.course;
      
      if (!created?._id) {
        console.error("Course creation response missing _id:", json);
        throw new Error("Course id missing from response");
      }
      
      console.log("Course created successfully:", {
        courseId: created._id,
        title: created.title,
        instructor: created.instructor,
      });
      
      setCourseId(String(created._id));
      setStep(2);
      
      // Show success notification
      toast.success("New course uploaded successfully!", {
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
    } catch (e: any) {
      setNotification(e?.message || "Failed to add lecture");
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 h-full w-full flex items-start md:items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-gradient-to-br from-black via-[#0f1a0f] to-black border border-gray-800 rounded-2xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
            <h2 className="text-xl font-semibold text-white">
              Create Custom Course
            </h2>
            <button
              className="px-2 py-1 rounded bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0">
            {/* Illustration Header */}
            <div className="relative mb-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 to-green-500/10 p-4 overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">
                    Custom Course Builder
                  </div>
                  <div className="text-sm text-emerald-200/80">
                    Upload videos, create modules, and publish your course.
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -top-6 -right-6 w-36 h-36 rounded-full bg-emerald-500/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-green-500/10 blur-2xl" />
            </div>
            <div className="flex gap-2 text-sm mb-4">
              <div
                className={`px-3 py-1 rounded ${
                  step === 0
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                Basics
              </div>
              <div
                className={`px-3 py-1 rounded ${
                  step === 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                Media
              </div>
              <div
                className={`px-3 py-1 rounded ${
                  step === 2
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                Modules
              </div>
            </div>

            {notification && (
              <div className="p-3 rounded bg-red-900/30 border border-red-700 text-red-200 mb-4">
                {notification}
              </div>
            )}

            {step === 0 && (
              <div className="space-y-6 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="text-white font-medium">Course Basics</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Title</label>
                    <input
                      className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                      value={basics.title}
                      onChange={(e) =>
                        setBasics({ ...basics, title: e.target.value })
                      }
                      placeholder="e.g. Full-Stack Web Development"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Slug</label>
                    <input
                      className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                      value={basics.slug}
                      onChange={(e) =>
                        setBasics({ ...basics, slug: toSlug(e.target.value) })
                      }
                      placeholder="full-stack-web-development"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">
                    Short Description
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                    value={basics.shortDescription}
                    onChange={(e) =>
                      setBasics({ ...basics, shortDescription: e.target.value })
                    }
                    placeholder="One-liner for course card"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">
                    Description
                  </label>
                  <RichTextEditor
                    value={basics.description}
                    onChange={(html) =>
                      setBasics({ ...basics, description: html })
                    }
                    placeholder="Detailed course description"
                    minHeight={200}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Category</label>
                    <input
                      className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                      value={basics.category}
                      onChange={(e) =>
                        setBasics({ ...basics, category: e.target.value })
                      }
                      placeholder="e.g. Development"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Level</label>
                    <select
                      className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                      value={basics.level}
                      onChange={(e) =>
                        setBasics({
                          ...basics,
                          level: e.target.value as BasicForm["level"],
                        })
                      }
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Language</label>
                    <input
                      className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                      value={basics.language}
                      onChange={(e) =>
                        setBasics({ ...basics, language: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      id="isFree"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={basics.price.isFree}
                      onChange={(e) =>
                        setBasics({
                          ...basics,
                          price: { ...basics.price, isFree: e.target.checked },
                        })
                      }
                    />
                    <label htmlFor="isFree" className="text-gray-300">
                      Free course
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Price</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 disabled:opacity-60"
                      disabled={basics.price.isFree}
                      value={basics.price.amount}
                      onChange={(e) =>
                        setBasics({
                          ...basics,
                          price: {
                            ...basics.price,
                            amount: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Currency</label>
                    <input
                      className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                      value={basics.price.currency}
                      onChange={(e) =>
                        setBasics({
                          ...basics,
                          price: { ...basics.price, currency: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                    onClick={() => setStep(1)}
                    disabled={false}
                  >
                    Continue to Media
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Video className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="text-white font-medium">Media & Preview</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Thumbnail
                    </label>
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                      {thumbnailUrl ? (
                        <div className="relative w-full h-40">
                          <Image
                            src={thumbnailUrl}
                            alt="thumbnail"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm mb-2">
                          Upload a course thumbnail (JPG/PNG)
                        </div>
                      )}
                      <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-gray-300" />
                        <span className="text-sm text-gray-300">Choose Thumbnail</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadThumbnail(f);
                          }}
                          className="hidden"
                        />
                      </label>
                      {thumbUpload.uploading && (
                        <div className="text-gray-400 text-sm mt-2">
                          Uploading...
                        </div>
                      )}
                      {thumbUpload.error && (
                        <div className="text-red-300 text-sm mt-2">
                          {thumbUpload.error}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Preview Video
                    </label>
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                      <div className="text-gray-400 text-sm mb-2">
                        Upload a short preview video (Cloudflare)
                      </div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-gray-300" />
                        <span className="text-sm text-gray-300">Choose Preview Video</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            try {
                              const uid = await uploadToCloudflare(f);
                              setPreviewVideo({
                                url: uid,
                                duration: 60,
                                thumbnail: thumbnailUrl,
                              });
                            } catch {}
                          }}
                          className="hidden"
                        />
                      </label>
                      {videoUpload.uploading && (
                        <div className="text-gray-400 text-sm mt-2">
                          Uploading... {videoUpload.progress}%
                        </div>
                      )}
                      {videoUpload.error && (
                        <div className="text-red-300 text-sm mt-2">
                          {videoUpload.error}
                        </div>
                      )}
                      {previewVideo?.url && (
                        <div className="text-green-300 text-sm mt-2">
                          Preview uploaded (id: {previewVideo.url})
                        </div>
                      )}
                      <div className="mt-3">
                        <label className="block text-gray-300 mb-1">
                          Preview Duration (seconds)
                        </label>
                        <input
                          type="number"
                          min={1}
                          className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                          value={previewVideo?.duration || 0}
                          onChange={(e) =>
                            setPreviewVideo((prev) => ({
                              url: prev?.url || "",
                              duration: Number(e.target.value) || 0,
                              thumbnail: prev?.thumbnail,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                    onClick={() => setStep(0)}
                  >
                    Back
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white border border-green-500 disabled:opacity-60"
                    disabled={!basicsValid || !mediaValid || creating}
                    onClick={handleCreateCourse}
                  >
                    {creating ? "Creating..." : "Create Course"}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="text-white font-medium">
                    Modules & Lectures
                  </div>
                </div>
                <div className="text-gray-300">
                  Course created. Add lectures to Section 1.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-1">
                        Lecture Title
                      </label>
                      <input
                        className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                        value={newLecture.title}
                        onChange={(e) =>
                          setNewLecture({
                            ...newLecture,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">
                        Lecture Description
                      </label>
                      <RichTextEditor
                        value={newLecture.description}
                        onChange={(html) =>
                          setNewLecture({ ...newLecture, description: html })
                        }
                        placeholder="Describe the lecture content"
                        minHeight={140}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">
                        Upload Lecture Video (Cloudflare)
                      </label>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-gray-300" />
                        <span className="text-sm text-gray-300">Choose Lecture Video</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            try {
                              const uid = await uploadToCloudflare(f);
                              setNewLecture((prev) => ({
                                ...prev,
                                cloudflareUid: uid,
                              }));
                            } catch {}
                          }}
                          className="hidden"
                        />
                      </label>
                      {videoUpload.uploading && (
                        <div className="text-gray-400 text-sm mt-2">
                          Uploading... {videoUpload.progress}%
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Duration (seconds)
                        </label>
                        <input
                          type="number"
                          min={1}
                          className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                          value={newLecture.durationSeconds || 0}
                          onChange={(e) =>
                            setNewLecture({
                              ...newLecture,
                              durationSeconds: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Optional Lecture Thumbnail URL
                        </label>
                        <input
                          className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                          value={newLecture.thumbnailUrl || ""}
                          onChange={(e) =>
                            setNewLecture({
                              ...newLecture,
                              thumbnailUrl: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 rounded-lg bg-green-600 text-white border border-green-500 disabled:opacity-60"
                        disabled={
                          !newLecture.title || !newLecture.cloudflareUid
                        }
                        onClick={handleAddLecture}
                      >
                        Add Lecture
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">
                      Lectures Added
                    </h3>
                    <div className="space-y-3">
                      {addedLectures.length === 0 && (
                        <div className="text-gray-400">
                          No lectures added yet.
                        </div>
                      )}
                      {addedLectures.map((lec, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded bg-gray-900 border border-gray-700"
                        >
                          <div className="text-white font-medium">
                            {lec.title}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {lec.description}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            Video: {lec.cloudflareUid}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600"
                    onClick={onClose}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
