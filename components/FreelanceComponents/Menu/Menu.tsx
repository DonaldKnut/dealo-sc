"use client";
import React from "react";
import "./Menu.css";
import images from "@/public/assets/images";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

type MenuItem = {
  name: string;
  image: StaticImageData | undefined; // Allow undefined for missing images
  link: string;
  extraClasses?: string;
};

// Define all categories, with a fallback for missing images
const menuItems: MenuItem[] = [
  {
    name: "Graphics Design",
    image: images.categoryImages.graphicsDesign,
    link: "/gigs",
  },
  {
    name: "Coding & Tech",
    image: images.categoryImages.codingTech,
    link: "/gig/123",
    extraClasses: "tech-logo",
  },
  {
    name: "Photography",
    image: images.categoryImages.photography,
    link: "/gig/123",
    extraClasses: "icon-logo photocopy",
  },
  {
    name: "Lifestyle",
    image: images.categoryImages.lifestyle,
    link: "/gig/123",
    extraClasses: "lifestyle icon-logo",
  },
  {
    name: "Video & Animation",
    image: images.categoryImages.videoAnimation,
    link: "/gig/123",
    extraClasses: "video-logo",
  },
  {
    name: "Writing & Translation",
    image: images.categoryImages.writingTranslation,
    link: "/gig/123",
    extraClasses: "paper-logo icon-logo",
  },
  {
    name: "Law",
    image: images.categoryImages.law,
    link: "/gig/123",
    extraClasses: "icon-logo",
  },
  {
    name: "Data Science",
    image: images.categoryImages.dataScience,
    link: "/gig/123",
    extraClasses: "data-science icon-logo",
  },
  {
    name: "Digital Marketing",
    image: images.categoryImages.digitalMarketing,
    link: "/gig/123",
    extraClasses: "data-science digital-marketing",
  },
  {
    name: "Music",
    image: images.categoryImages.music,
    link: "/gig/123",
    extraClasses: "data-science icon-logo",
  },
  {
    name: "Engineering",
    image: images.categoryImages.engineering,
    link: "/gig/123",
    extraClasses: "icon-logo",
  },
  {
    name: "Aviation",
    image: images.categoryImages.aviation,
    link: "/gig/123",
    extraClasses: "aviation icon-logo",
  },
  // New categories (image will be undefined until added to images.ts)
  // {
  //   name: "Fitness",
  //   image: images.categoryImages.fitness,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "AI Trainer",
  //   image: images.categoryImages.aiTrainer,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "AI Services",
  //   image: images.categoryImages.aiServices,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "IT",
  //   image: images.categoryImages.it,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "CyberSecurity",
  //   image: images.categoryImages.cyberSecurity,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Business Consulting",
  //   image: images.categoryImages.businessConsulting,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Voice Over",
  //   image: images.categoryImages.voiceOver,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Animation",
  //   image: images.categoryImages.animation,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "SEO Services",
  //   image: images.categoryImages.seoServices,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Web Development",
  //   image: images.categoryImages.webDevelopment,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Mobile Development",
  //   image: images.categoryImages.mobileDevelopment,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Game Development",
  //   image: images.categoryImages.gameDevelopment,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Fashion Design",
  //   image: images.categoryImages.fashionDesign,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Interior Design",
  //   image: images.categoryImages.interiorDesign,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Education & Tutoring",
  //   image: images.categoryImages.educationTutoring,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Health & Wellness",
  //   image: images.categoryImages.healthWellness,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
  // {
  //   name: "Event Planning",
  //   image: images.categoryImages.eventPlanning,
  //   link: "/gig/123",
  //   extraClasses: "icon-logo",
  // },
];

const Menu: React.FC = () => {
  return (
    <div className="menu-section-wrapper">
      <div className="menu-wrapper_container text-center">
        <h1 className="text-center text-3xl font-bold text-[#195b0f] playfair-italic">
          Menu
        </h1>
        <div className="gig-elements">
          {menuItems.map(({ name, image, link, extraClasses = "" }, index) => (
            <div key={index} className="label-n-image">
              <Link href={link} className="link-text">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    className={`menu-image ${extraClasses}`}
                  />
                ) : (
                  <span className="text-gray-500">Image not found</span>
                )}
                <h3 className="img-label">{name}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
