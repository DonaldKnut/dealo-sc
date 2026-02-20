"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const VideoAdvert = () => {
  return (
    <section className="flex items-center justify-center p-8 md:p-16 text-white m-auto mb-6 mt-8 bg-[#333433]">
      <div className="w-[85%] flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Video Section */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <video
            src="/African American Businesswoman Typing on Laptop _ Stock Footage - Envato elements.mp4"
            width={720}
            height={640}
            loop
            autoPlay
            muted
            className="w-full rounded-lg"
          ></video>
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="w-full md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold w-[90%] leading-snug">
            Built for the Future of African Talent
          </h1>

          <div className="space-y-5">
            <FeatureBlock
              title="AI-Powered Learning"
              text="Discover curated courses, take AI-driven quizzes, and learn skills that matter in today’s digital world."
            />
            <FeatureBlock
              title="Monetize Your Expertise"
              text="Join a trusted freelance marketplace that lets you earn with confidence and visibility."
            />
            <FeatureBlock
              title="One Platform, Every Role"
              text="Whether you’re a student, freelancer, instructor, or job seeker — Dealo is designed for your growth."
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoAdvert;

// Extracted feature item for reusability
const FeatureBlock = ({ title, text }: { title: string; text: string }) => (
  <div className="flex items-start gap-3">
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500">
      <CheckCircle size={18} className="text-white" />
    </span>
    <div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-gray-300">{text}</p>
    </div>
  </div>
);
