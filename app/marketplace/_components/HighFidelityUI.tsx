"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useSafeSession } from "@/hooks/use-safe-session";
import { motion } from "framer-motion";

const HighFidelityUI: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const session = useSafeSession(); const { data: sessionData } = session || {};

  useEffect(() => {
    if (session) {
      setIsAuthenticated(true);
    }
  }, [session]);

  return (
    <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-8 lg:p-16 bg-[#222222cc] text-white w-[90%] m-auto rounded-[23px] mb-6 mt-8">
      {/* Left Section: Text */}
      <motion.div
        className="flex flex-col items-start gap-4 w-full lg:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          It’s very easy to
          <br />
          <span className="text-green-500 italic font-serif">Get Started!</span>
        </h1>
        <ul className="space-y-3">
          {[
            "Create a free account",
            "Generate Courses",
            "Start Learning",
            "Earn Certification",
            "Freelance",
          ].map((text, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500">
                <CheckCircle size={18} className="text-white" />
              </span>
              <span className="text-lg">{text}</span>
            </li>
          ))}
        </ul>

        {/* Onboarding Message */}
        {!isAuthenticated && (
          <>
            <p className="text-gray-400 text-sm">
              Join thousands of learners and professionals who are upskilling,
              earning certifications, and launching successful careers. Take the
              first step today!
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition">
              Get Started <ArrowRight size={20} />
            </button>
          </>
        )}
      </motion.div>

      {/* Right Section: Image */}
      <motion.div
        className="w-full lg:w-1/2 flex justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/freelancer.png" // Make sure the image is inside the `public/` folder
          alt="Learning Illustration"
          width={500}
          height={500}
          priority // Ensures image loads fast
        />
      </motion.div>
    </section>
  );
};

export default HighFidelityUI;
