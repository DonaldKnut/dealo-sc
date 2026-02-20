"use client";

import React from "react";
import Image from "next/image";
import { LuCheckCircle2 } from "react-icons/lu";
import Button from "../../../app/explore/exploreComponents/Button/Button";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { SiCashapp } from "react-icons/si";
import { Reveal } from "@/app/reveal";
import "./CryptoAdvert.css";

const CryptoAdvert = () => {
  return (
    <div className="background_dealo_world mt-20 text-white">
      <div className="dealo_world_wrapper">
        {/* Right Section: Image + CTA */}
        <div className="dealo_world_right">
          <Reveal>
            <Image
              src="/crypto_hero.png"
              alt="Dealo wallet and financial tools"
              width={800}
              height={800}
            />
          </Reveal>
          <div className="apply_btn_wrap">
            <Reveal>
              <Button
                type="button"
                title="Join Now"
                icon={<FaSquareArrowUpRight />}
                variant="btn_green_rounded"
                to="/apply"
              />
            </Reveal>
          </div>
        </div>

        {/* Left Section: Text Content */}
        <div className="dealo_world_left">
          <Reveal>
            <SiCashapp className="text-4xl" />
          </Reveal>
          <Reveal>
            <h6 className="text-white dealoworld_text playfair-italic font-bold">
              Powering your freelance journey with secure, smart earnings.
            </h6>
          </Reveal>

          {/* Feature 1 */}
          <div className="skill_feature flex items-start">
            <Reveal>
              <span>
                <LuCheckCircle2 />
              </span>
            </Reveal>
            <Reveal>
              <p className="my-2">
                Monitor all your earnings, transactions, and wallet balance in
                real-time — transparently and securely.
              </p>
            </Reveal>
          </div>

          {/* Feature 2 */}
          <div className="skill_feature flex items-start">
            <Reveal>
              <span>
                <LuCheckCircle2 />
              </span>
            </Reveal>
            <Reveal>
              <p className="my-2">
                Withdraw directly to your local or preferred account — fast,
                smooth, and without drama.
              </p>
            </Reveal>
          </div>

          {/* Feature 3 */}
          <div className="skill_feature flex items-start">
            <Reveal>
              <span>
                <LuCheckCircle2 />
              </span>
            </Reveal>
            <Reveal>
              <p className="my-2">
                Whether you&apos;re a freelancer, instructor, or learner — Dealo
                gives you financial tools to thrive in today&apos;s economy.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoAdvert;
