"use client";

import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import FeaturedPlans from "./FeaturedPlans";
import ProductImageGallery from "./ProductImageGallery";
import ProductHeader from "./ProductHeader";
import ProductInfoSection from "./ProductInfoSection";
import ProductPricingSection from "./ProductPricingSection";
import { Work, User } from "@/types/types"; // Import the shared interfaces
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ProductDetailsProps {
  id: string;
  currentUser: User | null;
  genAI: GoogleGenerativeAI;
  generateProductViewerPrompt: (
    user: Partial<User>,
    productName: string,
    freelancerName: string,
    freelancerRating: number,
    productPrice: number,
    productCategory: string
  ) => string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  id,
  currentUser,
  genAI,
  generateProductViewerPrompt,
}) => {
  const [work, setWork] = useState<Work | null>(null);
  const [creator, setCreator] = useState<User | null>(null); // State for creator details
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await fetch(`/api/work/${id}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setWork(data.work);

        // Fetch creator details
        if (data.work.creator) {
          const creatorResponse = await fetch(`/api/user/${data.work.creator}`);
          if (!creatorResponse.ok)
            throw new Error(`Error: ${creatorResponse.statusText}`);
          const creatorData = await creatorResponse.json();
          setCreator(creatorData.user);
        }
      } catch (error) {
        console.error("Error fetching work:", error);
      }
    };
    fetchWork();
  }, [id]);

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0)
      setCurrentIndex(currentIndex - 1);
    if (
      direction === "next" &&
      currentIndex < (work?.workMedia.length || 0) - 1
    )
      setCurrentIndex(currentIndex + 1);
  };

  const openModalWithIndex = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const fetchAIInsights = async (work: Work) => {
    try {
      const response = await fetch(`/api/insights`, {
        method: "POST",
        body: JSON.stringify({ work }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`Error generating insights: ${response.statusText}`);
      const data = await response.json();
      return data.insights;
    } catch (error) {
      console.error("Error generating insights:", error);
      return "No insights available.";
    }
  };

  if (!work) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 w-[85%] m-auto">
        {/* Image Gallery */}
        <ProductImageGallery
          images={work.workMedia.map((media) => media.url)} // Use workMedia instead of workPhotoPaths
          onImageClick={openModalWithIndex}
        />

        {/* Product Details */}
        <div>
          <ProductHeader
            work={{
              ...work,
              creator: creator
                ? { firstName: creator.firstName, lastName: creator.lastName }
                : undefined,
            }}
          />
          <ProductInfoSection work={work} />
          <ProductPricingSection
            work={work}
            isCreator={
              currentUser && work.creator
                ? currentUser._id === work.creator
                : false
            }
            onGenerateInsights={async () => await fetchAIInsights(work)}
          />
        </div>
      </div>

      {modalOpen && (
        <Modal
          images={work.workMedia.map((media) => media.url)} // Use workMedia instead of workPhotoPaths
          currentIndex={currentIndex}
          onClose={() => setModalOpen(false)}
          onNavigate={handleNavigate}
        />
      )}

      <FeaturedPlans />
    </div>
  );
};

export default ProductDetails;
