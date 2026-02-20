"use client";
import React from "react";

import { Reveal } from "@/app/reveal";
import FooterLogo from "../_footer-components/FooterLogo";
import FooterLinks from "../_footer-components/FooterLinks";
import FooterSubscribe from "../_footer-components/FooterSubscribe";
import FooterBottom from "../_footer-components/FooterBottom";

const Footer = () => {
  const companyLinks = ["About", "Careers", "Ventures", "Grants"];
  const discoverLinks = [
    "Engineering & Law",
    "Graphics & Design",
    "Video & Animation",
    "Writing & Translation",
    "AI Services",
    "Digital Marketing",
    "Music & Audio",
    "Programming & Tech",
  ];
  const resourceLinks = [
    "Blog",
    "Case Studies",
    "Webinars",
    "Tutorials",
    "FAQs",
    "Community Forum",
    "API Documentation",
    "Support Center",
  ];
  const contactLinks = [
    { label: "Support", email: "support@dealonetwork.com" },
    { label: "Team", email: "team@dealonetwork.com" },
  ];

  return (
    <footer className="bg-[#2b2d2b] text-white py-12">
      <div className="container mx-auto px-4 w-[90%]">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <FooterLogo />
          <FooterLinks title="Company" links={companyLinks} />
          <FooterLinks title="Discover" links={discoverLinks} />
          <FooterLinks title="Resources" links={resourceLinks} />
          <FooterLinks title="Contact Us" links={contactLinks} isContact />
        </div>

        <FooterSubscribe />

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
