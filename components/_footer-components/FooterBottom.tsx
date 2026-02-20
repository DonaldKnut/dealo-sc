"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/app/reveal";

const FooterBottom = () => {
  const bottomLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <div className="mt-8 border-t border-[#50876c] pt-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-gray-400 text-sm">© 2025 Dealo Talent Network</p>
        <ul className="flex space-x-6">
          {bottomLinks.map((link, index) => (
            <Reveal key={index}>
              <li>
                <Link
                  href={link.href}
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FooterBottom;
