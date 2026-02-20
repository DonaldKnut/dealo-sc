"use client";
import React, { useState, useEffect, ReactNode, useMemo } from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { Reveal } from "@/app/reveal";
import { CATEGORIES } from "@/constant";
import { LuCheckCircle2 } from "react-icons/lu";
import Link from "next/link";
import { SiStarship } from "react-icons/si";
import { useSafeSession } from "@/hooks/use-safe-session";

type Props = {};

const Hero = (props: Props) => {
  const session = useSafeSession(); const { data: user } = session || {};
  const userName = user?.user?.name || "Guest";

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = useMemo(() => ["Travel Now", "Pay Later..."], []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentPhrase = phrases[textIndex];

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, 75);
    } else {
      timeout = setTimeout(() => {
        setDisplayText((prev) => currentPhrase.slice(0, prev.length + 1));
      }, 150);
    }

    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, phrases]);

  const travelVideoAdvert =
    "https://res.cloudinary.com/dyaetoldv/video/upload/v1724841886/fk9nebssz8bvgfkjbrat.mp4";

  return (
    <>
      <section className="relative bg-hero bg-cover bg-center bg-no-repeat h-[165vh] w-full z-10 pb-12 text-white">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-10"></div>

        {/* Content */}
        <div className="max-container padding-container px-300 relative top-28 sm:top-1/3 z-20 hero-wrapper">
          <div className="hero_subwrapper">
            <div className="hero_text_container">
              <Reveal>
                <SiStarship className="text-6xl" />
              </Reveal>
              <Reveal>
                <h1 className="text-green-800 text-xl">
                  Welcome <span className="text-green-800">{userName}</span>
                </h1>
              </Reveal>
              <Reveal>
                <motion.h1
                  className="playfair-italic hero-text font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-green-500"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  {displayText}
                </motion.h1>
              </Reveal>
              <div className="hero_feature">
                <Reveal>
                  <span>
                    <LuCheckCircle2 />
                  </span>
                </Reveal>
                <Reveal>
                  <p className="japa_subtitle flex items-baseline gap-2">
                    Apply for a travel loan to visit your dream destination
                    without worrying about immediate financial constraints.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
          <Reveal>
            <h5 className="mt-2 pl-2">Explore the key points.</h5>
          </Reveal>
          <ul className="flex flex-wrap gap-4 mt-2 pl-2">
            {CATEGORIES.map((category) => (
              <CategoryItem
                title={category.title}
                icon={category.icon}
                key={category.title}
              />
            ))}
          </ul>
        </div>

        {/* Video */}
        <video
          src={travelVideoAdvert}
          autoPlay
          muted
          loop
          className="absolute inset-0 h-full w-full object-cover"
        ></video>
      </section>
    </>
  );
};

type CategoryItem = {
  title: string;
  icon: ReactNode;
};

const CategoryItem = ({ title, icon }: CategoryItem) => {
  return (
    <Link
      href="/"
      className="bg-[#2a523b] flex items-center gap-1 px-5 py-2 rounded-xl hover:translate-y-[2px] transition-all duration-500"
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

export default Hero;
