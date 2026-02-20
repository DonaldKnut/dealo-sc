"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Pencil, Loader2 } from "lucide-react";

interface CoverPhotoProps {
  coverImage: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  coverFileInputRef: React.RefObject<HTMLInputElement>;
  uploading?: boolean;
}

const CoverPhoto: React.FC<CoverPhotoProps> = ({
  coverImage,
  onFileChange,
  coverFileInputRef,
  uploading = false,
}) => (
  <div className="relative w-full h-44 sm:h-56 rounded-t-2xl overflow-hidden border border-white/10">
    <Image src={coverImage} alt="Cover" fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
    {uploading && (
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    )}
    <button
      onClick={() => coverFileInputRef.current?.click()}
      disabled={uploading}
      className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-white/90 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Pencil className="w-4 h-4" />
    </button>
    <input
      type="file"
      ref={coverFileInputRef}
      accept="image/*"
      className="hidden"
      onChange={onFileChange}
      disabled={uploading}
    />
  </div>
);

export default CoverPhoto;
