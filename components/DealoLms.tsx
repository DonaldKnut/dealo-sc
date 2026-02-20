"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineArrowOutward } from "react-icons/md";
import { motion } from "framer-motion";
import { useSafeSession } from "@/hooks/use-safe-session";

const DealoArt: React.FC = () => {
  const session = useSafeSession(); const { data: sessionData } = session || {};
  const isAuthenticated = !!session;

  return (
    <section className="bg-[#374c37] py-12">
      <div className="flex flex-col md:flex-row items-center justify-center p-8 md:p-16 text-white w-[85%] m-auto mt-8 gap-8">
        {/* Text Section */}
        <motion.div
          className="w-full md:w-1/2 space-y-6 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold playfair-italic">
            Learn. Certify. Monetize.
          </h1>

          <p className="text-gray-200 leading-relaxed">
            Dealo is a tech-powered platform helping young African talent learn
            in-demand skills, get certified through AI-assisted evaluation, and
            monetize their expertise in a trusted global marketplace.
            <br />
            Whether you&apos;re a freelancer, job seeker, or team, we give you
            the tools to grow, prove your ability, and earn with confidence.
          </p>

          {/* Session-Based CTA */}
          <Link href={isAuthenticated ? "/dealoforge/dashboard" : "/sign-in"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black w-[300px] text-white font-medium hover:bg-green-700 transition mt-4"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <MdOutlineArrowOutward className="text-2xl" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/dealo-lms_image.png"
            alt="Dealo LMS"
            width={500}
            height={500}
            className="rounded-lg"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
};

export default DealoArt;
