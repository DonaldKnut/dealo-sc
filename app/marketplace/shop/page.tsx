"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import React, { useEffect, useState, Suspense } from "react";
import Spinner from "@/spinner";
import { useSafeSession } from "@/hooks/use-safe-session";
import { useSearchParams } from "next/navigation";
import WorkCards from "./_components/WorkCards";
import DealoPlatform from "./_components/DealoPlatform";
import FeaturesSection from "./_components/FeaturesSection";

// Updated Interface for Work Data
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

// Interface for User Data
interface User {
  _id: string;
  username: string;
}

// Main Shop Component
const ShopContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [workList, setWorkList] = useState<Work[]>([]);
  const [profile, setProfile] = useState<User | null>(null);

  const session = useSafeSession(); const { data: sessionData } = session || {};
  const loggedInUserId = sessionData?.user?.id;

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  // State for Filter Options
  const [filterOptions, setFilterOptions] = useState<{
    categories: string[];
    creators: string[];
  }>({
    categories: [],
    creators: [],
  });

  // Fetch Work List and Profile Information
  useEffect(() => {
    const fetchWorkList = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/user/${profileId}/shop`);
        if (!response.ok) {
          throw new Error("Failed to fetch work list");
        }

        const data = await response.json();

        // Map and clean up work data
        const cleanedWorkList = data.workList.map((work: any) => ({
          _id: work._id?.$oid || work._id || "",
          creator: work.creator?.$oid || work.creator || "",
          category: work.category || "Uncategorized",
          title: work.title || "Untitled",
          description: work.description || "No description available",
          price: work.price || 0,
          workMedia: Array.isArray(work.workMedia) ? work.workMedia : [], // Updated
          deliveryDate: work.deliveryDate?.$date || work.deliveryDate || null,
          deliveryTime: work.deliveryTime || null,
          skills: Array.isArray(work.skills) ? work.skills : [], // New
          contactInfo: {
            email: work.contactInfo?.email || "", // New
            phone: work.contactInfo?.phone || "", // New
          },
          experienceLevel: work.experienceLevel || "Junior", // New
          portfolioLink: work.portfolioLink || "", // New
          languagesSpoken: Array.isArray(work.languagesSpoken)
            ? work.languagesSpoken
            : [], // New
          certifications: Array.isArray(work.certifications)
            ? work.certifications
            : [], // New
          createdAt: work.createdAt?.$date || work.createdAt || null,
          updatedAt: work.updatedAt?.$date || work.updatedAt || null,
        }));

        setWorkList(cleanedWorkList);
        setProfile(data.user);

        // Extract and set filter options
        const categories: string[] = Array.from(
          new Set(
            cleanedWorkList.map(
              (work: Work) => work.category || "Uncategorized"
            )
          )
        );

        const creators: string[] = Array.from(
          new Set(
            cleanedWorkList.map((work: any) =>
              `${work.creator?.firstName || ""} ${
                work.creator?.lastName || ""
              }`.trim()
            )
          )
        );

        setFilterOptions({ categories, creators });
      } catch (error) {
        console.error("Error fetching work list:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchWorkList();
    }
  }, [profileId]);

  // Show spinner while loading
  if (loading) {
    return <Spinner />;
  }

  // Render the Shop Page
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      <div className="w-[85%] m-auto">
        {/* Header Section */}
        {loggedInUserId === profileId && (
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Works</h1>
        )}
        {loggedInUserId !== profileId && profile && (
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {profile.username}&apos;s Works
          </h1>
        )}

        {/* Work List with Filters */}
        <WorkCards works={workList} filterOptions={filterOptions} />
        {/* <DealoPlatform /> */}
        <FeaturesSection />
      </div>
    </div>
  );
};

const Shop: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
};

export default Shop;
