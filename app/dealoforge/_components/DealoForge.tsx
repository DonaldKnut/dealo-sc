"use client";
import React from "react";
import Link from "next/link";
import "./DealoForge.css";
import Image from "next/image";
import { MdOutlineArrowOutward } from "react-icons/md";

// import { Reveal } from "../../app/reveal";

type Props = {};

const DealoForge = (props: Props) => {
  return (
    <div>
      <div className="dealo-art text-white p-14">
        <div className="second-wrap">
          <Image
            src="/hero-imv.png"
            alt="art image"
            className="art-img"
            width={300}
            height={300}
          />
        </div>
        <div className="first-wrap">
          <h1 className="label-top">Be an Instructor, Earn Money</h1>
          <p className="bait-label_second">
            Our Artificial Intelligence, Forge is a dedicated space for diverse
            professionals, Instructors. Students, researchers, and organizations
            to teach, connect, collaborate, and advance knowledge and skills.
            {/* Whether you're a physician,
            researcher, or healthcare institution, Dealo Health Hub provides the
            tools and resources you need to make breakthroughs in healthcare. */}
          </p>
          <a href="/dealoforge/create-course">
            <button className="learn-btn_second">
              Get Started{" "}
              <MdOutlineArrowOutward className="text-2xl text-green-300" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DealoForge;
