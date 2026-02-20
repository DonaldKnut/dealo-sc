"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UploadCloud, Edit2 } from "lucide-react";

interface InlineFileUploaderProps {
  name: string;
  onChange: (file: string) => void;
  value: string;
  placeholder?: string;
}

// Switched to Cloudflare Images direct-upload flow

const InlineFileUploader: React.FC<InlineFileUploaderProps> = ({
  name,
  onChange,
  value,
  placeholder = "/placeholder_image.jpg", // Default placeholder image
}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setImageLoading(true);
    setError(null);

    try {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File ${file.name} exceeds the 5MB limit.`);
      }

      // Unified R2 upload
      const form = new FormData();
      form.append("file", file);
      form.append("prefix", "avatars");
      const res = await fetch("/api/uploads/r2", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      if (!json?.url) throw new Error("Invalid upload response");
      onChange(json.url);
    } catch (err: any) {
      setError(err.message || "An error occurred during the upload.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleImageUpload(event.target.files[0]);
    }
  };

  return (
    <div className="relative w-full h-48 md:h-64">
      {/* Display uploaded image or placeholder */}
      <Image
        src={value || placeholder}
        alt="Upload"
        fill
        className="object-cover rounded-md cursor-pointer"
        onClick={() => document.getElementById(name)?.click()} // Trigger file input on click
      />

      {/* Loading Spinner */}
      {imageLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Uploading...</div>
        </div>
      )}

      {/* Edit Icon */}
      {!imageLoading && (
        <div className="absolute bottom-2 right-2 bg-gray-900 text-white rounded-full p-2 cursor-pointer">
          <Edit2 size={20} />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        id={name}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default InlineFileUploader;
