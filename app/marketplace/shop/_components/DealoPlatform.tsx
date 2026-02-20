"use client";

import React from "react";
import { FileSearch, Briefcase, GraduationCap, Globe } from "lucide-react";

const DealoPlatform: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-black via-[#0f1a0f] to-black py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Heading */}
        <h1 className="text-center text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-8">
          Empowering Your <span className="text-green-600">Skills</span> &
          Unlocking Global <span className="text-green-600">Opportunities</span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Dealo harnesses the power of{" "}
          <span className="text-green-600 font-semibold">Gemini API</span> for
          curated courses,{" "}
          <span className="text-green-600 font-semibold">YouTube API</span> for
          premium video content, job postings, and travel loans. Build skills,
          get certified, and explore a world of freelancing and global careers.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Large Cards */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center transform transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-green-100 rounded-full p-5 mb-6">
              <GraduationCap className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Learn New Skills
            </h3>
            <p className="text-gray-600">
              Explore curated courses via the Gemini API and learn from the best
              with video content powered by YouTube.
            </p>
          </div>

          <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center transform transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-green-100 rounded-full p-5 mb-6">
              <Briefcase className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Freelancing Jobs
            </h3>
            <p className="text-gray-600">
              Apply for job postings and freelancing gigs that align with your
              newly acquired skills and certifications.
            </p>
          </div>

          {/* Small Cards */}
          <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center transform transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-green-100 rounded-full p-5 mb-6">
              <FileSearch className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Get Certified
            </h3>
            <p className="text-gray-600">
              Complete your learning journey and receive certifications that
              open new doors to professional opportunities.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center text-center transform transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-green-100 rounded-full p-5 mb-6">
              <Globe className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Travel Loans
            </h3>
            <p className="text-gray-600">
              Secure travel loans to destinations where your skills are in
              demand and create a global career.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealoPlatform;
