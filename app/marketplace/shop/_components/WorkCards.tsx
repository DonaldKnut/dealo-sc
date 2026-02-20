"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, Tag } from "lucide-react";

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

// Interface for Work data
interface Work {
  _id: string;
  creator: string;
  category: string;
  title: string;
  description: string;
  price: number;
  workMedia: { url: string; type: "image" | "video" }[]; // Updated
  deliveryDate: Date; // Updated
  deliveryTime: string; // Updated
  skills: string[]; // New
  contactInfo: {
    email: string; // New
    phone: string; // New
  };
  experienceLevel: string; // New
  portfolioLink: string; // New
  languagesSpoken?: string[]; // New
  certifications?: string[]; // New
  createdAt?: Date; // Updated
  updatedAt?: Date; // Updated
}

// Interface for WorkCards component props
interface WorkCardsProps {
  works: Work[];
  filterOptions: {
    categories: string[];
    creators: string[];
  };
}

// WorkCards component to display a grid of WorkCard components
const WorkCards: React.FC<WorkCardsProps> = ({ works, filterOptions }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-6 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {works.map((work) => (
        <WorkCard key={work._id} work={work} />
      ))}
    </motion.div>
  );
};

// WorkCard component to display individual work details with a media carousel
const WorkCard: React.FC<{ work: Work }> = ({ work }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Function to show the next media item in the carousel
  const nextMedia = () => {
    setCurrentMediaIndex(
      (previousIndex) => (previousIndex + 1) % work.workMedia.length
    );
  };

  // Function to show the previous media item in the carousel
  const prevMedia = () => {
    setCurrentMediaIndex(
      (previousIndex) =>
        (previousIndex - 1 + work.workMedia.length) % work.workMedia.length
    );
  };

  // Strip HTML tags from the description
  const cleanDescription = stripHtmlTags(work.description);

  // Get the current media item (image or video)
  const currentMedia = work.workMedia[currentMediaIndex];

  return (
    <motion.div
      className="relative bg-[#f4f2f2] rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all overflow-hidden border border-gray-200"
      whileHover={{ scale: 1.05 }}
    >
      {/* Media Carousel */}
      <div className="relative w-full h-56 bg-gray-200">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentMediaIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {currentMedia.type === "image" ? (
              <Image
                src={currentMedia.url}
                alt={work.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            ) : (
              <video
                src={currentMedia.url}
                controls
                className="w-full h-full object-cover rounded-t-lg"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {work.workMedia.length > 1 && (
          <>
            {/* Left Arrow */}
            {currentMediaIndex > 0 && (
              <button
                onClick={prevMedia}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-[#ccc] bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition"
                aria-label="Previous media"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Right Arrow */}
            {currentMediaIndex < work.workMedia.length - 1 && (
              <button
                onClick={nextMedia}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition"
                aria-label="Next media"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Work Details */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#7ab16d] truncate flex items-center gap-2">
          <span className="bg-[#3cd04d] rounded-full p-2">
            <Tag size={16} className="text-white" />
          </span>
          {work.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#666666] mt-2">
          {cleanDescription.length > 80
            ? `${cleanDescription.slice(0, 80)}...`
            : cleanDescription}
        </p>

        {/* Price */}
        <p className="text-[#7ab16d] font-bold mt-4 flex items-center gap-2">
          <span className="text-green-200 bg-[#3cd04d] rounded-full p-2">
            $
          </span>
          {work.price}
        </p>

        {/* Additional Details */}
        <div className="mt-4">
          {/* Skills */}
          <p className="text-sm text-[#666666]">
            <strong>Skills:</strong> {work.skills.join(", ")}
          </p>

          {/* Experience Level */}
          <p className="text-sm text-[#666666]">
            <strong>Experience Level:</strong> {work.experienceLevel}
          </p>

          {/* Portfolio Link */}
          <p className="text-sm text-[#666666]">
            <strong>Portfolio:</strong>{" "}
            <a
              href={work.portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3cd04d] hover:underline"
            >
              View Portfolio
            </a>
          </p>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between mt-6">
          {/* View Details Link */}
          <Link
            href={`/marketplace/product-details/${work._id}`}
            className="text-[#3cd04d] hover:underline flex items-center gap-2"
          >
            <span className="bg-[#3cd04d] rounded-full p-2">
              <Info size={16} className="text-white" />
            </span>
            View Details
          </Link>

          {/* Category */}
          <span className="text-sm text-[#666666] italic">
            Category: {work.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkCards;
