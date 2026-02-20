"use client";

import React from "react";
import images from "@/public/assets/images";
import "./BadAss.css";
import { Reveal } from "@/app/reveal";
import Image from "next/image";
import { IoSearchCircle } from "react-icons/io5";

const BadAss = () => {
  return (
    <div className="client-image badass_bg text-white">
      <div className="client-advert_wrapper flex flex-col lg:flex-row items-center justify-between gap-8 px-6 py-12">
        {/* Left Text Section */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h1 className="advert-header-text playfair-italic font-bold text-3xl md:text-4xl">
            Dealo Business
          </h1>

          <Reveal>
            <h4 className="text-xl font-semibold">
              Built for agencies, startups, and scale.
            </h4>
          </Reveal>

          <Reveal>
            <p className="text-gray-300 leading-relaxed">
              Dealo Business gives you premium access to a pool of certified
              freelancers, tools for streamlined project management, and
              reliable payment workflows — all optimized for teams.
            </p>
          </Reveal>

          {/* Bullet Points */}
          <div className="space-y-4">
            {[
              "Access certified talent across skill levels and budgets.",
              "Collaborate and manage freelance teams in one dashboard.",
              "Streamlined invoicing, wallet control, and payouts.",
            ].map((point, index) => (
              <Reveal key={index}>
                <div className="flex items-start gap-3">
                  <Image
                    src={images.checkLogo}
                    alt="checkmark"
                    width={24}
                    height={24}
                  />
                  <p className="text-gray-300">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA Button in box */}
          <div className="mt-6">
            <Reveal>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4bb381] hover:bg-[#3a9166] transition text-white font-semibold rounded-full w-full sm:w-[280px]">
                Explore Dealo Business <IoSearchCircle size={20} />
              </button>
            </Reveal>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Reveal>
            <Image
              src={images.badass}
              className="w-full max-w-md rounded-lg"
              alt="Dealo for Business"
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default BadAss;
