"use client";

import React from "react";
import { FaGraduationCap, FaHandshake, FaLightbulb } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import Link from "next/link";

const DealoComparison = () => {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-16">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-green-300">
          Why Dealo Stands Out
        </h1>
        <p className="text-lg text-white mt-4">
          Dealo redefines education, freelancing, and career tools with its
          unique integration of AI and personalized learning experiences.
        </p>
      </section>

      {/* Comparison Section */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Education Comparison */}
        <div className="bg-green-500 bg-opacity-20 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-3 rounded-full">
              <FaGraduationCap className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-300">Education</h2>
          </div>
          <p className="text-white mt-4">
            Dealo’s AI-enhanced learning and certification provide dynamic,
            personalized education tailored to your needs.
          </p>
        </div>

        {/* Freelancing Comparison */}
        <div className="bg-green-500 bg-opacity-20 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-3 rounded-full">
              <FaHandshake className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-300">Freelancing</h2>
          </div>
          <p className="text-white mt-4">
            Dealo seamlessly transitions users from skill-building to
            freelancing opportunities, empowering users to succeed.
          </p>
        </div>

        {/* AI-Driven Career Tools */}
        <div className="bg-green-500 bg-opacity-20 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-3 rounded-full">
              <FaLightbulb className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-300">
              AI Career Tools
            </h2>
          </div>
          <p className="text-white mt-4">
            From mock interviews to real-world gigs, Dealo offers a complete
            ecosystem for career growth and freelancing success.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-12">
        <h2 className="text-3xl font-extrabold text-white">
          Ready to experience the Dealo difference?
        </h2>
        <Link href="/marketplace">
          <p className="mt-6 inline-block px-6 py-3 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700">
            Get Started
          </p>
        </Link>
      </section>
    </main>
  );
};

export default DealoComparison;
