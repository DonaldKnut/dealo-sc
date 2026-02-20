"use client";

import React from "react";
import Image from "next/image";
import CategoryList from "../(constants)/CategoryList";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
}

type SelectCategoryProps = {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
};

const SelectCategory: React.FC<SelectCategoryProps> = ({
  formData,
  handleInputChange,
}) => {
  const handleCategoryChange = (category: string) => {
    handleInputChange("category", category);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {CategoryList.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative group flex flex-col p-8 border-2 items-center rounded-[2.5rem] cursor-pointer transition-all duration-500 overflow-hidden
            ${formData.category === item.name
              ? "border-emerald-500 bg-emerald-500/10 shadow-2xl shadow-emerald-500/20"
              : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
            }`}
          onClick={() => handleCategoryChange(item.name)}
        >
          {/* Animated Background Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent transition-opacity duration-500 ${formData.category === item.name ? 'opacity-100' : 'opacity-0'}`} />

          {/* Selection Indicator */}
          <div className={`absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center transition-all duration-500 ${formData.category === item.name ? 'bg-emerald-500 scale-100' : 'scale-0'}`}>
            <Check className="w-5 h-5 text-emerald-950" />
          </div>

          <div className="relative z-10 space-y-6 flex flex-col items-center">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 ${formData.category === item.name
                ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : 'bg-white/5 group-hover:bg-emerald-500/20'
              }`}>
              <div className="relative w-14 h-14">
                <Image
                  src={item.icon}
                  fill
                  className={`object-contain transition-all duration-500 ${formData.category === item.name ? 'brightness-0' : 'brightness-100'}`}
                  alt={item.name}
                />
              </div>
            </div>

            <div className="text-center">
              <h4 className={`text-xl font-black tracking-tight transition-colors duration-500 ${formData.category === item.name ? 'text-white' : 'text-white/40'
                }`}>
                {item.name}
              </h4>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 transition-colors duration-500 ${formData.category === item.name ? 'text-emerald-400' : 'text-white/10'
                }`}>
                Deployment Node
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SelectCategory;
