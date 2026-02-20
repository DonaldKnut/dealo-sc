"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  Clock,
  DollarSign,
  Eye,
  Share2,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/hooks/use-safe-session";

interface WorkMedia {
  url: string;
  type: "image" | "video";
}

interface Creator {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Work {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  workMedia: WorkMedia[];
  creator: Creator | string;
  skills: string[];
  experienceLevel: "Junior" | "Mid" | "Senior";
  deliveryTime: string;
  createdAt?: string | Date;
  rating?: number;
  reviewsCount?: number;
}

interface EnhancedProductCardProps {
  work: Work;
  onWishlistToggle?: (workId: string) => void;
  isWishlisted?: boolean;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  work,
  onWishlistToggle,
  isWishlisted = false,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { data: session } = useSafeSession();

  const workMedia = work.workMedia || [];
  const currentMedia = workMedia[currentMediaIndex];
  const skills = work.skills || [];

  const getCreatorName = () => {
    if (!work.creator) return "Unknown Creator";
    if (typeof work.creator === "string") return work.creator;
    return `${work.creator.firstName} ${work.creator.lastName}`;
  };

  const getCreatorAvatar = () => {
    if (typeof work.creator === "object" && work.creator.avatar) {
      return work.creator.avatar;
    }
    return "/default-avatar.jpg";
  };

  const handleNextMedia = () =>
    setCurrentMediaIndex((prev) =>
      prev < workMedia.length - 1 ? prev + 1 : prev
    );

  const handlePreviousMedia = () =>
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(work._id);
    }
  };

  const handleViewDetails = () => {
    router.push(`/marketplace/product-details/${work._id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: work.title,
        text: work.description,
        url: `${window.location.origin}/marketplace/product-details/${work._id}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/marketplace/product-details/${work._id}`
      );
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "Senior":
        return "bg-purple-600";
      case "Mid":
        return "bg-blue-600";
      case "Junior":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayNow = async () => {
    if (!session?.user?.id) {
      router.push("/sign-in");
      return;
    }
    try {
      const confirmed = window.confirm(
        "By proceeding you agree to Dealo's Terms, Refund Policy, and that your payment will be held in escrow until you accept delivery. Continue?"
      );
      if (!confirmed) return;

      const requirements =
        window.prompt(
          "Describe what you want the freelancer to deliver (requirements):"
        ) || "";
      const res = await fetch("/api/marketplace/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workId: work._id,
          freelancerId:
            typeof work.creator === "object" ? work.creator._id : work.creator,
          amount: work.price,
          requirements,
        }),
      });
      const data = await res.json();
      if (data?.success && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        alert(data?.error || "Unable to initialize payment");
      }
    } catch (e) {
      console.error(e);
      alert("Payment init failed");
    }
  };

  return (
    <motion.div
      className="group bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-green-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentMediaIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {currentMedia?.type === "image" ? (
              <Image
                src={currentMedia?.url || "/placeholder-image.jpg"}
                alt={work.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={currentMedia?.url || ""}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />
                {/* Video Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handleVideoPlay}
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-6 h-6 text-gray-800" />
                    ) : (
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Media Navigation */}
        {workMedia.length > 1 && (
          <>
            {currentMediaIndex > 0 && (
              <button
                onClick={handlePreviousMedia}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentMediaIndex < workMedia.length - 1 && (
              <button
                onClick={handleNextMedia}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </>
        )}

        {/* Media Indicators */}
        {workMedia.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {workMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentMediaIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-black/50 text-white hover:bg-red-500"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-green-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {work.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
              {work.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getExperienceColor(
                  work.experienceLevel
                )}`}
              >
                {work.experienceLevel}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm text-gray-300">
                  {work.rating || 4.8} ({work.reviewsCount || 24})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {work.description}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600">
            <Image
              src={getCreatorAvatar()}
              alt={getCreatorName()}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{getCreatorName()}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{work.deliveryTime}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">
              {formatPrice(work.price)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePayNow}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
            >
              Pay Now
            </button>
            <button
              onClick={handleViewDetails}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-white/20"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedProductCard;
