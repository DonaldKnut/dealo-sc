"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PromotionalPanel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Promotional slides: chameleon (cham) and eagle only
  const slides = [
    {
      image: "/assets/auth/cham.jpg",
      title: "Learn & Earn",
      description: "Courses, jobs, and opportunities.",
    },
    {
      image: "/assets/auth/eagle.jpg",
      title: "Skills. Jobs. Growth.",
      description: "AI-powered talent platform.",
    },
  ];

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

      {/* Dark Overlay for text readability - covering entire panel */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content Container - Fixed, Not Scrollable, No Overflow */}
      <div className="relative z-20 w-full h-full flex flex-col overflow-hidden">
        {/* Top Section - Text Content */}
        <div className="flex-1 relative overflow-hidden flex items-end" style={{ minHeight: 0, maxHeight: '100%' }}>
          {/* Back to Website Button - Positioned absolutely on top */}
          <div className="absolute top-8 left-8 z-30">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Website</span>
            </Link>
          </div>
          
          {/* Text Overlay - Positioned at bottom */}
          <div className="w-full p-8 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
              {currentSlide.title}
            </h3>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Bottom Section - Progress Bars and Stats */}
        <div className="flex-shrink-0 text-center space-y-4 p-8">
          {/* Progress Bars */}
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden max-w-[100px]"
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width: index === currentIndex ? `${progress}%` : index < currentIndex ? "100%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-xs text-white/80">
            <span>50K+ Users</span>
            <span>•</span>
            <span>100+ Countries</span>
            <span>•</span>
            <span>4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPanel;


