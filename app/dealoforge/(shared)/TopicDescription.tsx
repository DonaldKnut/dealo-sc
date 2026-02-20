"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/app/dealoforge/dashboard/components/RichTextEditor";
import { getCloudflareImageUrl } from "@/lib/cloudflareImages";
import { motion } from "framer-motion";
import { BookOpen, Type, Image as ImageIcon, Sparkles, Upload } from "lucide-react";

// Define the shape of chapters and formData
interface Chapter {
  chapter_name: string;
  content: Array<{
    type: string;
    title: string;
    description: string;
    duration?: string;
  }>;
}

interface FormData {
  category: string;
  topic: string;
  description: string;
  difficultyLevel: string;
  courseDuration: string;
  addVideo: boolean;
  noOfChapters: string;
  chapters?: Chapter[];
  thumbnailImageId?: string;
}

type TopicDescriptionProps = {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
};

const TopicDescription: React.FC<TopicDescriptionProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="space-y-10">
      {/* Topic Input Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 space-y-6 group hover:border-emerald-500/20 transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <Type className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <label htmlFor="topic" className="text-white font-black text-xs uppercase tracking-[0.2em] block mb-1">
              Strategic Topic
            </label>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Base Anchor for AI Generation</p>
          </div>
        </div>

        <div className="relative">
          <Input
            placeholder="e.g. Advanced Quantum Computing for Developers"
            value={formData.topic}
            onChange={(e) => handleInputChange("topic", e.target.value)}
            className="h-16 bg-black/40 border-white/5 text-white text-lg font-bold rounded-2xl focus:border-emerald-500/50 focus:ring-emerald-500/20 placeholder:text-white/10 px-6 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Sparkles className="w-5 h-5 text-emerald-500/20 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500" />
          <p className="text-[10px] text-white/30 font-medium tracking-wide">
            Be specific for industry-grade results. Specificity directly correlates to content depth.
          </p>
        </div>
      </motion.div>

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 space-y-6 hover:border-emerald-500/20 transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <BookOpen className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <label className="text-white font-black text-xs uppercase tracking-[0.2em] block mb-1">
              Conceptual Framework
            </label>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Define the narrative and objectives</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/20 focus-within:border-emerald-500/30 transition-all">
          <RichTextEditor
            value={formData.description}
            onChange={(html) => handleInputChange("description", html)}
            placeholder="Deep dive into what this course accomplishes..."
            minHeight={250}
          />
        </div>
      </motion.div>

      {/* Thumbnail Upload Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 space-y-8 hover:border-emerald-500/20 transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <ImageIcon className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <label className="text-white font-black text-xs uppercase tracking-[0.2em] block mb-1">
              Visual Signature
            </label>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Course Thumbnail Branding</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group shrink-0">
            <div className="w-72 h-44 bg-black/40 border-2 border-dashed border-white/5 rounded-[2rem] overflow-hidden flex items-center justify-center group-hover:border-emerald-500/30 transition-all duration-500">
              {formData.thumbnailImageId ? (
                <Image
                  src={
                    getCloudflareImageUrl(formData.thumbnailImageId, "thumbnail") ||
                    getCloudflareImageUrl(formData.thumbnailImageId) ||
                    "/placeholder_image.jpg"
                  }
                  alt="Course thumbnail"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <ImageIcon className="w-10 h-10 text-white/5" />
                  <span className="text-white/10 text-[10px] font-black uppercase tracking-widest">No Visual Payload</span>
                </div>
              )}
            </div>
            {formData.thumbnailImageId && (
              <div className="absolute top-4 right-4 bg-emerald-500 px-3 py-1 rounded-full text-[8px] font-black text-emerald-950 uppercase tracking-widest shadow-xl">
                Active
              </div>
            )}
          </div>

          <div className="flex-grow space-y-6">
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    const form = new FormData();
                    form.append("file", f);
                    form.append("prefix", "courses");
                    const res = await fetch("/api/uploads/r2", {
                      method: "POST",
                      body: form,
                    });
                    if (!res.ok) throw new Error("Upload failed");
                    const json = await res.json();
                    if (!json?.url) throw new Error("Invalid upload response");
                    handleInputChange("thumbnailImageId", json.url);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              />
              <div className="h-16 px-8 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-4 group-hover:bg-emerald-500 group-hover:border-white/20 transition-all duration-300">
                <Upload className="w-5 h-5 text-emerald-400 group-hover:text-emerald-950" />
                <span className="text-white font-bold text-sm tracking-tight group-hover:text-emerald-950">Replace Thumbnail</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/20">Resolution</span>
                <span className="text-emerald-500">1280 × 720 Preferred</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/20">Formats</span>
                <span className="text-white/40">JPG, PNG, WEBP</span>
              </div>
              <div className="h-px bg-white/5" />
              <p className="text-[10px] text-white/20 leading-relaxed font-medium">
                High-quality thumbnails increase click-through rates by up to 300%. Use clean, high-contrast imagery.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TopicDescription;
