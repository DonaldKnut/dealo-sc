"use client";

import dynamic from "next/dynamic";
import { StructuredData } from "@/components/SEO/StructuredData";
import LearningHeroWithSlider from "@/components/home/LearningHeroWithSlider";
import ClientOnly from "@/components/common/ClientOnly";
import HomePageSkeleton from "@/components/HomePageSkeleton";
import { useHomePageData } from "@/hooks";

const CourseSearchHero = dynamic(() => import("@/components/CourseSearchHero"), { loading: () => <div className="min-h-[200px]" /> });
const AICourseCreation = dynamic(() => import("@/components/AICourseCreation"), { loading: () => <div className="min-h-[180px]" /> });
const SuccessStoriesSlider = dynamic(() => import("@/components/home/SuccessStoriesSlider"), { loading: () => <div className="min-h-[280px]" /> });
const StatsSection = dynamic(() => import("@/components/home/StatsSection"), { loading: () => <div className="min-h-[120px]" /> });
const InstructorSection = dynamic(() => import("@/components/InstructorSection"), { loading: () => <div className="min-h-[300px]" /> });

const HomePage = () => {
  const { isLoading, stats } = useHomePageData();

  if (isLoading) {
    return (
      <ClientOnly fallback={<HomePageSkeleton />}>
        <div style={{ minHeight: "100vh", width: "100%" }}>
          <HomePageSkeleton />
        </div>
      </ClientOnly>
    );
  }

  const organizationData = {
    name: "Dealo",
    description:
      "Nigeria's premier learning and certification platform. Learn skills, get AI-certified, and land jobs in Nigeria.",
    foundingDate: "2024",
    address: {
      addressCountry: "NG",
      addressRegion: "Lagos",
    },
    contactPoint: {
      contactType: "customer service",
      email: "support@dealo.ng",
    },
    sameAs: [
      "https://twitter.com/dealo_ng",
      "https://linkedin.com/company/dealo-ng",
      "https://facebook.com/dealo.ng",
      "https://instagram.com/dealo_ng",
    ],
  };

  return (
    <>
      <StructuredData type="Organization" data={organizationData} />
      <div className="bg-black">
        {/* Learning Hero Section with Sliders - Focused on Learning + Certifications */}
        <LearningHeroWithSlider />

        {/* Course Search Section */}
        <CourseSearchHero />

        {/* AI Course Creation Section */}
        <AICourseCreation />

        {/* Success Stories Slider */}
        <SuccessStoriesSlider />

        {/* Stats Section - Refactored to use reusable component */}
        <ClientOnly>
          <StatsSection
            stats={stats}
            title={
              <>
                Trusted by{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  Thousands
                </span>
              </>
            }
            background="default"
            columns={4}
          />
        </ClientOnly>

        {/* Instructor Section */}
        <InstructorSection />
      </div>
    </>
  );
};

export default HomePage;
