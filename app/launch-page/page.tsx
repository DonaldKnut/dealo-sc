// File: components/LaunchPage.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import {
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";
import { ChevronRight } from "lucide-react";
import { IoSearchCircle } from "react-icons/io5";
import Link from "next/link"

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
;

export default function LaunchPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email submitted: ${email}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      {/* Logo */}
      <div className="mb-8">
        <Image src="/DEALO_ICON.png" alt="Dealo Logo" width={80} height={80} />
      </div>

      {/* Heading */}
      <h1 className="text-2xl md:text-4xl font-bold mb-6 playfair-italic">
        We are launching soon
      </h1>

      {/* Email Input */}
      <div className="relative mb-4 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className="px-6 py-3 rounded-full w-full bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#3b634b]"
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#262726] hover:bg-[#386f37] text-white hover:text-[#adf9ad] px-4 py-2 rounded-full flex items-center gap-2"
          onClick={handleSubmit}
        >
          Subscribe <ChevronRight size={24} color="white" />
        </button>
      </div>

      {/* Illustration Image */}
      <div className="mt-12 mb-8 w-full max-w-lg">
        <Image
          src="/workingprogress.png"
          alt="Launching Soon Illustration"
          width={800}
          height={400}
          layout="responsive"
        />
      </div>

      {/* Social Icons */}
      <p className="text-center mb-4">Subscribe and get notified</p>
      <div className="flex space-x-4 text-3xl">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          <AiFillTwitterCircle />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition-colors"
        >
          <AiFillInstagram />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          <AiFillLinkedin />
        </a>
      </div>

      {/* Back to Home Button */}
      <div className="mt-8">
        <Link href="/">
          <button className="px-6 py-3 rounded-full bg-[#45752d] hover:bg-[#5fa783] text-white text-lg font-medium transition-colors">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
