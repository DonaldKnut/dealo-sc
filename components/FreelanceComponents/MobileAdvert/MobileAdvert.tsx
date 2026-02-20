"use client";

import React from "react";
import images from "@/public/assets/images";
import Image from "next/image";
import { Reveal } from "@/app/reveal";
import "./MobileAdvert.css";

const MobileAdvert = () => {
  return (
    <div className="mobile-advert-container text-white">
      <div className="mobile_advert-wrap">
        <div className="label-text_wrapper">
          {/* Left: Logo or phone image */}
          <div className="label-text_wrapper-left">
            <Reveal>
              <Image
                src={images.dealoLogoIcon}
                alt="Dealo on mobile device"
                className="mobile-img"
              />
            </Reveal>
          </div>

          {/* Right: Text Content */}
          <div className="label-text_wrapper-section_right">
            <Reveal>
              <h3 className="mobile-h3-text">
                Build, Learn, and Earn —
                <span className="text-green-400"> Anywhere.</span>
              </h3>
            </Reveal>

            <Reveal>
              <h5 className="mobile-h5-text">Dealo on the go.</h5>
            </Reveal>

            <Reveal>
              <p className="label-text_wrapper-text">
                Access Dealo&apos;s learning, certification, and freelance
                features right from your phone. Whether you&apos;re upskilling,
                applying for gigs, or showcasing your portfolio — you&apos;re
                fully empowered, even on the move.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAdvert;
