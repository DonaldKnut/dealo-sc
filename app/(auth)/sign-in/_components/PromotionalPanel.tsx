"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// Use Unsplash images (configured in next.config) - local cham.jpg/eagle.jpg are missing
const slides = [
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    title: "Learn & Earn",
    description: "Courses, jobs, and opportunities.",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
    title: "Skills. Jobs. Growth.",
    description: "AI-powered talent platform.",
  },
];

const PromotionalPanel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // Progress bar animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 2; // Increment by 2% every 100ms (5 seconds total)
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentIndex]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Full Screen Image - Covering entire panel */}
      <div
        key={currentIndex}
        className="absolute inset-0 w-full h-full overflow-hidden animate-[slideIn_0.5s_ease-in-out]"
      >
        <Image
          src={currentSlide.image}
          alt={currentSlide.title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Refined Gradient Overlay for Cinematic Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10"></div>

      {/* Content Container - Fixed, Not Scrollable, No Overflow */}
      <div className="relative z-20 w-full h-full flex flex-col overflow-hidden">
        {/* Top Section - Text Content */}
        <div className="flex-1 relative overflow-hidden flex items-end" style={{ minHeight: 0, maxHeight: '100%' }}>
          {/* Back to Website Button - Positioned absolutely on top */}
          <div className="absolute top-10 left-10 z-30">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-white/90 hover:text-white transition-all group bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
              <span className="text-sm font-medium tracking-wide">Back to Website</span>
            </Link>
          </div>

          {/* Text Overlay - Positioned at bottom */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full p-12 text-left"
          >
            <h3 className="text-5xl sm:text-6xl font-heading font-bold text-white leading-[1.1] mb-6 drop-shadow-2xl">
              {currentSlide.title}
            </h3>
            <p className="text-gray-200 text-lg sm:text-xl font-body leading-relaxed max-w-lg opacity-90">
              {currentSlide.description}
            </p>
          </motion.div>
        </div>

        {/* Bottom Section - Progress Bars and Stats */}
        <div className="flex-shrink-0 space-y-8 p-12 pt-0">
          {/* Stats - Premium Glass Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-white font-heading font-bold text-xl mb-1">50K+</div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Trusted Users</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-white font-heading font-bold text-xl mb-1">100+</div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Countries</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-white font-heading font-bold text-xl mb-1">4.9/5</div>
              <div className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Avergae Rating</div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  style={{
                    width: index === currentIndex ? `${progress}%` : index < currentIndex ? "100%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPanel;


