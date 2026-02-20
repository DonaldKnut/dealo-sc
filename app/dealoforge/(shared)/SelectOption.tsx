"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { BarChart, Clock, Layers, Video } from "lucide-react";

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
}

type SelectOptionProps = {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
};

const SelectOption: React.FC<SelectOptionProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Difficulty Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 space-y-6 group hover:border-emerald-500/20 transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <BarChart className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] block mb-0.5">
              Difficulty Level
            </label>
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Audience Intelligence Scale</p>
          </div>
        </div>

        <Select
          value={formData.difficultyLevel}
          onValueChange={(value) => handleInputChange("difficultyLevel", value)}
        >
          <SelectTrigger className="h-14 bg-black/40 border-white/5 text-white font-bold rounded-xl focus:ring-emerald-500/20 transition-all">
            <SelectValue placeholder="Select Complexity" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-xl shadow-2xl">
            <SelectItem value="Beginner" className="focus:bg-emerald-500 focus:text-emerald-950 font-bold">Beginner</SelectItem>
            <SelectItem value="Intermediate" className="focus:bg-emerald-500 focus:text-emerald-950 font-bold">Intermediate</SelectItem>
            <SelectItem value="Advance" className="focus:bg-emerald-500 focus:text-emerald-950 font-bold">Advance</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Course Duration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 space-y-6 group hover:border-emerald-500/20 transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Clock className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] block mb-0.5">
              Course Duration
            </label>
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Temporal commitment estimate</p>
          </div>
        </div>

        <Select
          value={formData.courseDuration}
          onValueChange={(value) => handleInputChange("courseDuration", value)}
        >
          <SelectTrigger className="h-14 bg-black/40 border-white/5 text-white font-bold rounded-xl focus:ring-emerald-500/20 transition-all">
            <SelectValue placeholder="Select Runtime" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-xl shadow-2xl">
            <SelectItem value="1 Hour" className="focus:bg-emerald-500 focus:text-emerald-950 font-bold">1 Hour</SelectItem>
            <SelectItem value="2 Hours" className="focus:bg-emerald-500 focus:text-emerald-950 font-bold">2 Hours</SelectItem>
            <SelectItem value="More than 3 Hours" className="focus:bg-emerald-500 focus:text-emerald-950 font-bold">3+ Hours</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Number of Chapters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 space-y-6 group hover:border-emerald-500/20 transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Layers className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] block mb-0.5">
              Chapter Count
            </label>
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Structural granularity</p>
          </div>
        </div>

        <div className="relative">
          <Input
            type="number"
            min={1}
            value={formData.noOfChapters}
            onChange={(e) => handleInputChange("noOfChapters", e.target.value)}
            className="h-14 bg-black/40 border-white/5 text-white font-bold rounded-xl focus:ring-emerald-500/20 px-6 transition-all"
            placeholder="e.g. 5"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/10 uppercase">Units</div>
        </div>
      </motion.div>

      {/* Add Video Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 space-y-6 group hover:border-emerald-500/20 transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Video className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] block mb-0.5">
              Video Context
            </label>
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Multimedia enhancement</p>
          </div>
        </div>

        <Select
          value={formData.addVideo ? "Yes" : "No"}
          onValueChange={(value) => handleInputChange("addVideo", value === "Yes")}
        >
          <SelectTrigger className="h-14 bg-black/40 border-white/5 text-white font-bold rounded-xl focus:ring-emerald-500/20 transition-all">
            <SelectValue placeholder="Add YouTube Videos?" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-xl shadow-2xl">
            <SelectItem value="Yes" className="focus:bg-emerald-500 focus:text-emerald-950 font-bold">Yes, Include</SelectItem>
            <SelectItem value="No" className="focus:bg-emerald-500 focus:text-emerald-950 font-bold">No, Text-Only</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </div>
  );
};

export default SelectOption;
