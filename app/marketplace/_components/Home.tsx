import { Reveal } from "@/app/reveal";
import { ChevronRight } from "lucide-react";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center pt-4 px-4 md:px-10 lg:px-20 space-y-6">
        <Reveal>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Unlock Potential with{" "}
            <span className="text-green-300 playfair-italic">
              Dealo&apos;s <br /> Marketplace
            </span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="text-lg md:text-xl max-w-3xl">
            Where education meets freelancing, AI-driven career tools bridging
            the gap between learning, earning, and career advancement like never
            before.
          </p>
        </Reveal>
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Enter your email address"
            className="px-6 py-4 rounded-full w-full bg-white text-gray-900 shadow-md focus:outline-none focus:ring-4 focus:ring-green-500"
          />

          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300"
            onClick={() => {}}
          >
            Subscribe <ChevronRight size={24} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
