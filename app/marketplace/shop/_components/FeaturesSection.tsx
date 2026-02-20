import React from "react";
import {
  FaCertificate,
  FaChalkboardTeacher,
  FaHeadset,
  FaVideo,
  FaArrowRight,
  FaChevronRight,
} from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <section className="text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-green-500">Our Features</h2>
          <p className="text-4xl font-bold text-green-700 mt-2">
            Special for You
          </p>
          <button className="mt-6 px-6 py-3 bg-green-500 rounded-lg font-medium text-white hover:bg-green-600 transition duration-300 flex items-center">
            See All Features
            <FaChevronRight className="ml-2 text-lg" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Learn New Skills",
              description:
                "Explore curated courses via the Gemini API and learn from the best with video content powered by YouTube.",
              icon: <FaChalkboardTeacher />,
            },
            {
              title: "Freelancing Jobs",
              description:
                "Apply for job postings and freelancing gigs that align with your newly acquired skills and certifications.",
              icon: <FaHeadset />,
            },
            {
              title: "Get Certified",
              description:
                "Complete your learning journey and receive certifications that open new doors to professional opportunities.",
              icon: <FaCertificate />,
            },
            {
              title: "Travel Loans",
              description:
                "Secure travel loans to destinations where your skills are in demand and create a global career.",
              icon: <FaVideo />,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-green-600 rounded-lg p-6 shadow-lg hover:bg-green-700 transition duration-300 flex flex-col items-start"
            >
              <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-sm text-green-100 text-left">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
