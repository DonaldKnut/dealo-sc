"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Video,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const AddVideoPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // Validate file size (400MB limit)
    const maxSize = 400 * 1024 * 1024; // 400MB
    if (file.size > maxSize) {
      setError(`File size exceeds 400MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !courseId) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Get upload URL from Cloudflare
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

      // Upload to Cloudflare Stream
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

      setVideoId(uploadId);
      setSuccess(true);

      // Save video metadata to course/chapter
      // Note: chapterId would need to be passed as a prop or state if needed
      // For now, we just mark success after upload
      if (courseId && uploadId) {
        // You can add chapter-specific save logic here if needed
        console.log("Video uploaded successfully:", uploadId);
      }
    } catch (e: any) {
      console.error("Upload error:", e);
      setError(e.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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
                <Video className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                Add Video
              </span>
            </div>
            <h1 className="text-4xl font-black mb-2">Upload Video</h1>
            <p className="text-gray-400">
              Upload your video to Cloudflare Stream. Videos are automatically processed and optimized for streaming.
            </p>
          </div>

          {/* Upload Area */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm p-8">
            {!success ? (
              <>
                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-500/50 transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold mb-1">
                          Click to select video file
                        </p>
                        <p className="text-sm text-gray-400">
                          MP4, MOV, AVI, or other video formats
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Maximum file size: 400MB
                        </p>
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
                    {/* File Info */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                          <Video className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-semibold">{selectedFile.name}</p>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setError(null);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Upload Progress */}
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

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    {/* Upload Button */}
                    {!uploading && (
                      <div className="flex gap-3">
                        <button
                          onClick={handleUpload}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all shadow-lg shadow-emerald-500/30"
                        >
                          <Upload className="w-5 h-5" />
                          Upload to Cloudflare Stream
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setError(null);
                          }}
                          className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Upload Successful!</h3>
                  <p className="text-gray-400 mb-4">
                    Your video has been uploaded to Cloudflare Stream and is being processed.
                  </p>
                  {videoId && (
                    <p className="text-sm text-gray-500 font-mono bg-white/5 px-3 py-2 rounded-lg inline-block">
                      Video ID: {videoId}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 justify-center">
                  <Link
                    href={`/dealoforge/create-course/${courseId}`}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all"
                  >
                    Back to Course Editor
                  </Link>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setSelectedFile(null);
                      setVideoId(null);
                      setUploadProgress(0);
                    }}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                  >
                    Upload Another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400 space-y-1">
                <p className="font-semibold text-white">Video Processing</p>
                <p>
                  After upload, your video will be automatically transcoded and optimized. This usually takes a few minutes depending on video length.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddVideoPage;

