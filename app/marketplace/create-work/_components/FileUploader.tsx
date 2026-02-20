"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import Spinner from "@/spinner";

interface FileUploadProps {
  name: string;
  onChange: (files: { url: string; type: "image" | "video" }[]) => void;
  value: { url: string; type: "image" | "video" }[];
}

const MAX_FILES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const FileUploader: React.FC<FileUploadProps> = ({ name, onChange, value }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [uploadingIndexes, setUploadingIndexes] = useState<number[]>([]);
  // Local blob previews shown instantly while uploading
  const [localPreviews, setLocalPreviews] = useState<{ url: string; type: "image" | "video" }[]>([]);

  const uploadFile = (
    file: File,
    index: number
  ): Promise<{ url: string; type: "image" | "video" } | null> => {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", "marketplace");

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prev) => {
            const copy = [...prev];
            copy[index] = percent;
            return copy;
          });
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          setUploadingIndexes((prev) => prev.filter((i) => i !== index));
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({
                url: data.url,
                type: file.type.startsWith("video") ? "video" : "image",
              });
            } catch {
              setErrorMessage(`Failed to parse response for "${file.name}"`);
              resolve(null);
            }
          } else {
            setErrorMessage(`Failed to upload "${file.name}"`);
            resolve(null);
          }
        }
      };

      xhr.open("POST", "/api/uploads/r2");
      xhr.send(formData);
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setErrorMessage(null);

    // Check max file count
    if (value.length + acceptedFiles.length > MAX_FILES) {
      setErrorMessage(`You can only upload up to ${MAX_FILES} files.`);
      return;
    }

    // Filter out duplicates
    const existingFileSignatures = value.map((f) => f.url.split("/").pop());
    const filteredFiles = acceptedFiles.filter(
      (file) => !existingFileSignatures.includes(file.name)
    );

    if (filteredFiles.length === 0) {
      setErrorMessage("No new unique files to upload.");
      return;
    }

    // Show instant local blob previews while uploading
    const blobPreviews = filteredFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: (file.type.startsWith("video") ? "video" : "image") as "image" | "video",
    }));
    setLocalPreviews((prev) => [...prev, ...blobPreviews]);

    // Initialise progress tracking
    const startIndex = uploadProgress.length;
    setUploadingIndexes((prev) => [
      ...prev,
      ...filteredFiles.map((_, i) => startIndex + i),
    ]);
    setUploadProgress((prev) => [...prev, ...filteredFiles.map(() => 0)]);

    // Upload all files in parallel and wait for ALL to finish
    const results = await Promise.allSettled(
      filteredFiles.map((file, i) => {
        if (file.size > MAX_FILE_SIZE) {
          setErrorMessage(`File "${file.name}" exceeds the 20MB size limit.`);
          return Promise.resolve(null);
        }
        return uploadFile(file, startIndex + i);
      })
    );

    // Collect successful uploads
    const uploaded = results
      .map((r) => (r.status === "fulfilled" ? r.value : null))
      .filter(Boolean) as { url: string; type: "image" | "video" }[];

    // Clear blob previews for files that uploaded successfully
    setLocalPreviews([]);

    // Update form value with real CDN URLs
    onChange([...value, ...uploaded]);
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      "video/*": [".mp4", ".mov"],
    },
    disabled: value.length >= MAX_FILES,
  });

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative group cursor-pointer transition-all duration-500 rounded-[2rem] border-2 border-dashed ${value.length >= MAX_FILES
          ? "opacity-50 pointer-events-none border-white/5"
          : "border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5"
          }`}
      >
        <input {...getInputProps()} name={name} />

        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500">
            <UploadCloud size={32} className="text-emerald-500/50 group-hover:text-emerald-400" />
          </div>
          <p className="text-white font-bold text-sm tracking-tight mb-1">
            Drag and drop your artifacts
          </p>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">
            Max {MAX_FILES} files • 20MB limit
          </p>
        </div>

        {/* Cinematic Corner Glints */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/0 group-hover:border-emerald-500/50 rounded-tl-[2rem] transition-all" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/0 group-hover:border-emerald-500/50 rounded-br-[2rem] transition-all" />
      </div>

      {/* Errors */}
      {errorMessage && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs font-black uppercase tracking-widest text-center"
        >
          {errorMessage}
        </motion.p>
      )}

      {/* Preview Grid — shows confirmed uploads + local blob previews while uploading */}
      {(() => {
        const allPreviews = [...value, ...localPreviews];
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {allPreviews.map((file, index) => {
              const isLocal = index >= value.length; // blob preview = still uploading
              return (
                <motion.div
                  key={index}
                  layoutId={`file-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-square rounded-2xl border border-white/10 overflow-hidden bg-black shadow-2xl"
                >
                  {file.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.url}
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}

                  {/* Uploading overlay */}
                  {isLocal && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Uploading…</span>
                    </div>
                  )}

                  {/* Remove overlay (only for confirmed uploads) */}
                  {!isLocal && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                      >
                        <span className="sr-only">Remove</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Empty slot placeholders */}
            {Array.from({ length: Math.max(0, 5 - allPreviews.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-2xl border border-white/5 bg-white/[0.01]" />
            ))}
          </div>
        );
      })()}


      {/* Progress Bars */}
      {uploadingIndexes.length > 0 && (
        <div className="space-y-3">
          {uploadingIndexes.map((index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500/50">
                <span>Uploading...</span>
                <span>{uploadProgress[index] || 0}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress[index] || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
