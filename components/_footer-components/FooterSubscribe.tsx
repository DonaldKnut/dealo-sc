"use client";

import React, { useState } from "react";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialGithub,
  TiSocialInstagram,
} from "react-icons/ti";
import { CircleArrowRight, CheckCircle } from "lucide-react";
import { Reveal } from "@/app/reveal";

const FooterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socialIcons = [
    TiSocialFacebook,
    TiSocialLinkedin,
    TiSocialTwitter,
    TiSocialGithub,
    TiSocialYoutube,
    TiSocialInstagram,
  ];

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "footer",
          tags: ["footer-subscriber"],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Subscription failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 border-t border-[#50876c] pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="w-full md:w-auto">
          <Reveal>
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Subscribe
            </h3>
          </Reveal>
          {!submitted ? (
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:w-80 px-4 py-2 rounded-[33px] bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
              >
                <CircleArrowRight className="w-5 h-5 text-white" />
              </button>
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-green-700 px-4 py-2 rounded-md">
              <CheckCircle className="text-white w-5 h-5" />
              <p className="text-white text-sm">
                Thanks for subscribing! You&apos;ll receive updates from us
                soon.
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-6">
          {socialIcons.map((Icon, index) => (
            <Reveal key={index}>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <Icon className="w-6 h-6" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <p className="text-center text-gray-400 text-sm mt-6">
          Bridging Talent, Breaking Borders
        </p>
      </Reveal>
    </div>
  );
};

export default FooterSubscribe;
