"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { IoSearchCircle } from "react-icons/io5";
import { Reveal } from "@/app/reveal";
import { z } from "zod";
import { SearchValidationSchema } from "@/lib/validation";

const ForgeFeatured = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Premium", "Top-Notch", "Prime", "Quality"];
  const word = words[wordIndex];
  const [typing, setTyping] = useState("");
  const typingSpeed = 200;
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const images = [
    "/dealoAI.png",
    "/dealo_hero.png",
    "/demo.png",
    "/freestyle.png",
    "/BLOG_GUY.png",
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
      }, typingSpeed * 15);
    }

    return () => clearTimeout(timeoutId);
  }, [typing, word, words.length]); // Added words.length

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, [images.length]); // Added images.length

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
        window.location.href = redirectUrl; // Redirect to the results page
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
    <div className="featured bg-[#323232] text-white py-16 h-[555px]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 h-full w-[90%]">
        {/* Left Section */}
        <div className="md:w-1/2 flex flex-col justify-center h-full">
          <Reveal>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
              Get the perfect{" "}
              <span className="text-[#4bb381] playfair-italic">{typing}</span>{" "}
              Courses.
            </h1>
          </Reveal>
          <Reveal>
            <p className="pb-5">
              Simplifies your journey by breaking down complex learning paths
              into structured steps, ensuring a seamless and productive
              experience.
            </p>
          </Reveal>

          <div className="relative mb-4 w-full max-w-2xl">
            <input
              type="text"
              placeholder="What specific Course?"
              className="w-full px-5 py-3 pr-11 rounded-full bg-white text-black text-lg border-none outline-none focus:bg-gray-200"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#424242] hover:bg-[#386f37] text-white hover:text-[#4fec5c] px-4 py-2 rounded-full flex items-center gap-2">
              Search <IoSearchCircle />
            </button>
          </div>
          {error && (
            <div className="text-red-500 mt-2">
              <span>{error}</span>
            </div>
          )}
          <div className="mt-4">
            <Reveal>
              <span className="font-semibold">Popular:</span>
            </Reveal>
            <div className="flex flex-wrap gap-2 mt-2">
              <Reveal>
                <button className="bg-[#22b66e] px-4 py-2 rounded-full">
                  Engineering
                </button>
              </Reveal>
              <Reveal>
                <button className="bg-[#22b66e] px-4 py-2 rounded-full">
                  Mathemathics
                </button>
              </Reveal>
              <Reveal>
                <button className="bg-[#22b66e] px-4 py-2 rounded-full">
                  Marketing
                </button>
              </Reveal>
              <Reveal>
                <button className="bg-[#22b66e] px-4 py-2 rounded-full">
                  Data Science
                </button>
              </Reveal>
            </div>
          </div>
        </div>
        {/* Right Section */}
        <div className="md:w-2/5 flex justify-center items-center h-[390px]">
          <div className="relative w-full h-full flex items-center justify-center">
            {images.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt="Main image"
                className={`transition-opacity duration-1000 absolute inset-0 ${
                  imageIndex === idx ? "opacity-100" : "opacity-0"
                }`}
                width={600}
                height={400}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgeFeatured;
