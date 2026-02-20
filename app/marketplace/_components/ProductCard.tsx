"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useRouter } from "next/navigation";
import { Work, getFlutterWaveConfig, stripHtmlTags } from "@/types/types";
import { usePayment } from "@/hooks/usePayment";

interface ProductCardProps {
  work: Work;
}

const ProductCard: React.FC<ProductCardProps> = ({ work }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const { session, handleOrderCreation } = usePayment();
  const router = useRouter();

  const workMedia = work.workMedia || [];
  const currentMedia = workMedia[currentMediaIndex];
  const skills = work.skills || [];

  const getCreatorName = () => {
    if (!work.creator) return "Unknown Creator";
    if (typeof work.creator === "string") return work.creator;
    return `${work.creator.firstName} ${work.creator.lastName}`;
  };

  const handleNextMedia = () =>
    setCurrentMediaIndex((prev) =>
      prev < workMedia.length - 1 ? prev + 1 : prev
    );

  const handlePreviousMedia = () =>
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const cleanedDescription = stripHtmlTags(work.description);

  const handleViewDetails = () => {
    if (!session) {
      router.push("/sign-in");
    } else {
      router.push(
        `/marketplace/product-details/${work._id}?userId=${session.user.id}&workId=${work._id}`
      );
    }
  };

  const handleFlutterwaveSuccess = (response: any) => {
    handleOrderCreation(work._id || "", response.transaction_id, work.price);
    closePaymentModal();
  };

  const handleFlutterwaveClose = () => {
    console.log("Payment Modal Closed");
  };

  // Safely check if creator is an object (populated) and not just an ID
  const creatorIsPopulated =
    typeof work.creator !== "string" && work.creator?.firstName;

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col p-3 w-full sm:w-[300px]"
      whileHover={{ scale: 1.05 }}
    >
      {/* Media Carousel */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentMediaIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {currentMedia?.type === "image" ? (
              <Image
                src={currentMedia?.url || "/placeholder-image.jpg"}
                alt={work.title}
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            ) : (
              <video
                src={currentMedia?.url || ""}
                controls
                className="w-full h-full object-cover rounded-2xl"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {workMedia.length > 1 && (
          <>
            {currentMediaIndex > 0 && (
              <button
                onClick={handlePreviousMedia}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 p-1 rounded-full hover:bg-green-700"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
            )}
            {currentMediaIndex < workMedia.length - 1 && (
              <button
                onClick={handleNextMedia}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 p-1 rounded-full hover:bg-green-700"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Work Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{work.title}</h3>
        <p className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full w-[45%] text-center">
          {work.category}
        </p>
        <p className="mt-2 text-green-600 font-semibold text-xl">
          ${work.price}
        </p>
        <p className="mt-2 text-gray-600 text-sm line-clamp-3">
          {cleanedDescription}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Creator Info */}
        {creatorIsPopulated && (
          <div className="mt-4 flex items-center gap-2">
            <User size={16} className="text-gray-600" />
            <p className="text-sm text-gray-600">{getCreatorName()}</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-1 text-green-600 text-sm font-medium"
          >
            View Details <ChevronRight size={16} />
          </button>
          <FlutterWaveButton
            callback={handleFlutterwaveSuccess}
            onClose={handleFlutterwaveClose}
            text="Order Now"
            className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700"
            {...getFlutterWaveConfig(
              work,
              session?.user?.email || "guest@example.com",
              session?.user?.name || "Guest"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
