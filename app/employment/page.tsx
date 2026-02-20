"use client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Hero from "./_components/Hero";
import Jobs from "./_components/Jobs";
import JobsComponent from "./_components/JobsComponent";
import Footer from "@/components/FreelanceComponents/Footer";

type Job = {
  _id: string;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  postedBy?: string;
  country: string;
  remote: boolean;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  jobIcon?: string;
  skillsRequired?: string[];
  location?: string;
  experienceRequired?: string | number;
  applications?: string[];
  category?: string;
};

const Page = () => {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/dealo-jobs", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFeaturedJobs(data.success ? data.jobs : []);
      } catch (err: any) {
        console.error("Error fetching featured jobs:", err.message);
        setError(true);
      }
    };

    fetchJobs();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex flex-col items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center max-w-md">
          <Image
            src="/find_no_see.png"
            alt="Error Illustration"
            className="mb-4 mx-auto"
            height={132}
            width={132}
            priority
          />
          <p className="text-red-400 text-center text-lg mb-4">
            Unable to load featured jobs. Please try again later.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      <Hero />
      {featuredJobs.length > 0 && <Jobs header="Featured Jobs" jobs={featuredJobs} />}
      <JobsComponent />
      <Footer />
    </div>
  );
};

export default Page;
