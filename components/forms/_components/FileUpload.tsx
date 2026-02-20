"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  useController,
  Control,
  FieldErrors,
  FieldError,
} from "react-hook-form";
import Spinner from "@/spinner"; // Assuming Spinner component exists in your project

interface FileUploadProps {
  name: string;
  label?: string;
  placeholder?: string;
  control: Control<any>;
  errorMessage?: string;
  errors?: FieldErrors<any>;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  control,
  label = "Upload Image",
  placeholder = "Upload Image",
  errorMessage,
  errors,
}) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [imageLoading, setImageLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    setImageLoading(true);

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prefix", "employment"); // Use employment prefix for job postings

    try {
      const response = await fetch("/api/uploads/r2", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to upload image";
        console.error("Upload API error:", errorData);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      onChange(data.url); // Store R2 URL in form state
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to upload image");
    } finally {
      setImageLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    maxFiles: 1,
  });

  return (
    <div className={`relative group/upload transition-all duration-700 ${value ? 'p-0' : 'p-2'}`}>
      <div
        {...getRootProps()}
        className={`relative w-full min-h-[160px] flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed transition-all duration-700 cursor-pointer overflow-hidden ${value
            ? 'border-transparent bg-transparent shadow-none'
            : 'border-white/[0.05] bg-white/[0.02] hover:border-emerald-500/30 hover:bg-white/[0.04] shadow-2xl'
          }`}
      >
        <input {...getInputProps()} />

        {imageLoading ? (
          <div className="py-12 flex flex-col items-center gap-4">
            <Spinner />
            <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.4em] animate-pulse">UPLOADING SIGNAL...</span>
          </div>
        ) : value ? (
          <div className="relative w-full group/preview">
            <Image
              src={value}
              alt="Uploaded image"
              width={1000}
              height={1000}
              className="w-full max-h-[400px] object-cover rounded-[2rem] shadow-2xl transition-transform duration-700 group-hover/preview:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-500 flex items-center justify-center rounded-[2rem]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="bg-red-500 text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl transform hover:scale-110 transition-all"
                type="button"
              >
                Terminate Asset
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 py-10 px-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover/upload:opacity-100 transition-opacity duration-700" />
              <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center relative z-10 group-hover/upload:scale-110 transition-transform duration-500">
                <Image
                  src="/assets/icons/upload.svg"
                  width={24}
                  height={24}
                  alt="Upload"
                  className="opacity-40 group-hover/upload:opacity-100 group-hover/upload:invert transition-all"
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-white font-black uppercase tracking-[0.2em] text-[11px] group-hover/upload:text-emerald-400 transition-colors">
                Link Visual Asset
              </p>
              <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[9px]">
                Drop manifestation or click to transmit
              </p>
              <div className="pt-4 flex gap-3 justify-center">
                {['SVG', 'PNG', 'JPG'].map(ext => (
                  <span key={ext} className="px-2 py-1 rounded-md bg-white/[0.05] text-white/10 text-[8px] font-black">{ext}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-[10px] font-black text-red-500/70 uppercase tracking-widest mt-4 ml-2">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
