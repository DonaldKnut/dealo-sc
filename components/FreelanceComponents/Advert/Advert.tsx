"use client";

import React from "react";
import images from "@/public/assets/images";
import Link from "next/link";
import Image from "next/image";
import { CgMoreO } from "react-icons/cg";
import { motion } from "framer-motion";

const Advert = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 p-8 md:p-16 bg-[#000000cc] text-white w-[90%] m-auto rounded-[23px] mb-6 mt-8">
      {/* Left Section: Image */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={images.AdvertImage}
          alt="freelancer showcase"
          className="w-full rounded-lg"
        />
      </motion.div>

      {/* Right Section: Text */}
      <motion.div
        className="w-full md:w-1/2 space-y-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Get Verified. Get Certified.
          <span className="playfair-italic font-bold text-green-500">
            {" "}
            Get Hired.
          </span>
        </h1>

        <p className="text-gray-400 mb-2">
          Dealo connects skilled African freelancers with real opportunities.
          Through our AI-powered certification, curated learning, and visibility
          tools, you stand out and win more jobs — faster. Whether you&apos;re
          just getting started or scaling your freelance brand, Dealo helps you
          get discovered, hired, and paid.
        </p>

        {/* CTA Button */}
        <Link href="/about-us">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2e2c2c] w-[300px] text-white font-medium hover:bg-green-700 transition mt-4"
          >
            Learn More <CgMoreO size={20} />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};

export default Advert;
