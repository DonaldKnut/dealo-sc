"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa6";
import { Reveal } from "@/app/reveal";
import { z } from "zod";
import { SearchValidationSchema } from "@/lib/validation";

const Featured = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Certified", "Skilled", "Empowered", "Vetted"];
  const word = words[wordIndex];
  const [typing, setTyping] = useState("");
  const typingSpeed = 150;
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const images = [
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1745576049/together-4__b7lnh8.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1745576048/together-1_vdpio5.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1745576034/together-6__g8edlu.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1745576032/together-2_ehoekm.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1745576021/together-3__mxlw4h.png",
    "https://res.cloudinary.com/dyaetoldv/image/upload/v1745576016/together5-_h3btq9.png",
  ];
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (typing.length < word.length) {
      timeoutId = setTimeout(() => {
        setTyping(word.slice(0, typing.length + 1));
      }, typingSpeed);
    } else {
      timeoutId = setTimeout(() => {
        setTyping("");
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, typingSpeed * 10);
    }

    return () => clearTimeout(timeoutId);
  }, [typing, word, words.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleSearch = async () => {
    try {
      SearchValidationSchema.parse({ query });
      setError(null);

      if (!query.trim()) return;

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const { redirectUrl } = await response.json();
        window.location.href = redirectUrl;
      } else {
        console.error("Search failed");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0]?.message || "Invalid input");
      } else {
        console.error("Search error:", error);
      }
    }
  };

  return (
    <div className="featured bg-[#323232] text-white py-8 md:py-16 h-auto md:h-[555px] z-[99]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6 h-full w-full md:w-[90%]">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center h-full order-2 md:order-1 mt-8 md:mt-0">
          <Reveal>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-center md:text-left">
              Unlock{" "}
              <span className="text-[#4bb381] playfair-italic">{typing}</span>{" "}
              African talent for your next Global project
            </h1>
          </Reveal>
          <div className="relative mb-4 w-full max-w-2xl mx-auto md:mx-0">
            <input
              type="text"
              placeholder="What specific services?"
              onChange={(e) => setQuery(e.target.value)}
              className="px-6 py-3 rounded-full w-full bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#3b634b]"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#323e33] hover:bg-[#010301] text-white hover:text-[#4bb381] px-4 py-2 rounded-full flex items-center gap-2"
              onClick={handleSearch}
            >
              Search <FaChevronRight size={20} color="white" />
            </button>
          </div>
          {error && (
            <div className="text-red-500 mt-2 text-center md:text-left">
              <span>{error}</span>
            </div>
          )}
          <div className="mt-4 text-center md:text-left">
            <Reveal>
              <span className="font-semibold">Popular:</span>
            </Reveal>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              {["Architecture", "Generative AI", "Logo Design", "Plumbing"].map(
                (topic) => (
                  <Reveal key={topic}>
                    <button className="bg-[#476c5a] px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base">
                      {topic}
                    </button>
                  </Reveal>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Modified for mobile */}
        <div className="w-full md:w-2/5 flex justify-center items-center h-[300px] md:h-[500px] order-1 md:order-2">
          <div className="relative w-full h-full flex items-center justify-center">
            {images.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt="Talent showcase"
                className={`transition-opacity duration-1000 absolute object-contain ${
                  imageIndex === idx ? "opacity-100" : "opacity-0"
                }`}
                fill
                style={{
                  objectFit: "contain",
                  transform: imageIndex === idx ? "scale(1)" : "scale(0.95)",
                }}
                quality={100}
                priority={idx === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
