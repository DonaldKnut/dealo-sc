"use client";

import Link from "next/link";
import { useSafeSession } from "@/hooks/use-safe-session";
import Image from "next/image";

export default function DealoForgeAdvertComponent() {
  const session = useSafeSession(); const { data: sessionData } = session || {}; // Fetch the session data

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between text-left bg-gradient-to-r from-green-800 to-gray-700 p-8 m-auto w-[85%] my-10 rounded-[60px]">
      {/* Image Section */}
      <div className="mt-10 lg:mt-0 flex justify-center lg:w-1/2">
        <Image
          src="/edu_hero.png" // Update this to the correct path
          alt="Green Robot"
          className="w-48 md:w-96 object-contain"
          width={148}
          height={148}
        />
      </div>

      {/* Text Section */}
      <div className="text-center lg:text-left lg:w-1/2">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          Discover Your <br className="hidden md:inline" />{" "}
          <span className="playfair-italic font-bold text-[#7df012]">
            Perfect Career!
          </span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 w-[75%]">
          Explore opportunities that match your skills and interests. Our
          platform is designed to connect you with top employers in the
          industry, bringing you closer to your dream job.
        </p>

        {/* Button */}
        {!session && ( // Render the button only if the user is not authenticated
          <div className="flex justify-center lg:justify-start">
            <Link href="/sign-in">
              <button className="bg-white text-gray-800 px-6 py-3 rounded-full">
                Start Your Journey
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
