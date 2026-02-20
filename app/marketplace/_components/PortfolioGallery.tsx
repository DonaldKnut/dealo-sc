"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Download,
  Share2,
} from "lucide-react";

interface MediaItem {
  url: string;
  type: "image" | "video";
  title?: string;
  description?: string;
}

interface PortfolioGalleryProps {
  media: MediaItem[];
  freelancerName: string;
  className?: string;
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  media,
  freelancerName,
  className = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsVideoPlaying(false);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsVideoPlaying(false);
  };

  const navigateMedia = (direction: "prev" | "next") => {
    if (selectedIndex === null) return;

    if (direction === "prev") {
      setSelectedIndex(
        selectedIndex > 0 ? selectedIndex - 1 : media.length - 1
      );
    } else {
      setSelectedIndex(
        selectedIndex < media.length - 1 ? selectedIndex + 1 : 0
      );
    }
    setIsVideoPlaying(false);
  };

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleDownload = () => {
    if (selectedIndex !== null) {
      const mediaItem = media[selectedIndex];
      const link = document.createElement("a");
      link.href = mediaItem.url;
      link.download = `${freelancerName}-portfolio-${selectedIndex + 1}`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (selectedIndex !== null) {
      const mediaItem = media[selectedIndex];
      const shareData = {
        title: `${freelancerName}&apos;s Portfolio`,
        text: mediaItem.title || `Portfolio item from ${freelancerName}`,
        url: mediaItem.url,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log("Error sharing:", err);
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(mediaItem.url);
      }
    }
  };

  if (!media || media.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">No portfolio items available</div>
        <div className="text-sm text-gray-500">
          This freelancer hasn&apos;t uploaded any portfolio items yet.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
      >
        {media.map((item, index) => (
          <motion.div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openLightbox(index)}
          >
            {item.type === "image" ? (
              <Image
                src={item.url}
                alt={item.title || `Portfolio item ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="relative w-full h-full bg-gray-800">
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  loop
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Type Indicator */}
            <div className="absolute top-2 right-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.type === "video" ? "bg-red-500" : "bg-blue-500"
                }`}
              >
                {item.type === "video" ? (
                  <Play className="w-3 h-3 text-white" />
                ) : (
                  <div className="w-3 h-3 bg-white rounded-sm" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={() => navigateMedia("prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigateMedia("next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Media Content */}
              <div className="max-w-4xl max-h-full w-full h-full flex items-center justify-center">
                {media[selectedIndex].type === "image" ? (
                  <Image
                    src={media[selectedIndex].url}
                    alt={
                      media[selectedIndex].title ||
                      `Portfolio item ${selectedIndex + 1}`
                    }
                    width={800}
                    height={600}
                    className="max-w-full max-h-full object-contain rounded-2xl"
                  />
                ) : (
                  <div className="relative w-full max-w-4xl">
                    <video
                      src={media[selectedIndex].url}
                      className="w-full rounded-2xl"
                      controls
                      autoPlay={isVideoPlaying}
                      muted
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Media Info */}
              {media[selectedIndex].title && (
                <div className="absolute bottom-4 left-4 max-w-md">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {media[selectedIndex].title}
                  </h3>
                  {media[selectedIndex].description && (
                    <p className="text-gray-300 text-sm">
                      {media[selectedIndex].description}
                    </p>
                  )}
                </div>
              )}

              {/* Media Counter */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white text-sm">
                {selectedIndex + 1} of {media.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioGallery;
