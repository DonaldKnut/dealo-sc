"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Video,
  CreditCard,
  UserCheck,
  GraduationCap,
  Briefcase,
  Search,
} from "lucide-react";
// GSAP will be loaded dynamically in useEffect

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  keywords: string[];
  index: number;
}

function FeatureCard({ icon, title, description, link, keywords, index }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const loadAndAnimate = async () => {
      try {
        const gsapModule = await import("gsap");
        const stModule = await import("gsap/ScrollTrigger");
        const gsapInstance = gsapModule.default;
        const ScrollTriggerInstance = stModule.ScrollTrigger;
        gsapInstance.registerPlugin(ScrollTriggerInstance);

        gsapInstance.from(cardRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      } catch (e) {
        // GSAP not available, skip animation
      }
    };

    loadAndAnimate();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 mb-4">{description}</p>
          <Link
            href={link}
            className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
          >
            Learn More <span>→</span>
          </Link>
        </div>
      </div>
      
      {/* SEO Keywords - Hidden but crawlable */}
      <div className="hidden">
        {keywords.map((keyword, i) => (
          <span key={i} className="text-transparent">{keyword} </span>
        ))}
      </div>
    </div>
  );
}

export function FeatureSEOSections() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const loadAndAnimate = async () => {
      try {
        const gsapModule = await import("gsap");
        const stModule = await import("gsap/ScrollTrigger");
        const gsapInstance = gsapModule.default;
        const ScrollTriggerInstance = stModule.ScrollTrigger;
        gsapInstance.registerPlugin(ScrollTriggerInstance);

        const h2 = sectionRef.current?.querySelector("h2");
        if (h2) {
          gsapInstance.from(h2, {
            opacity: 0,
            y: -30,
            duration: 1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          });
        }
      } catch (e) {
        // GSAP not available, skip animation
      }
    };

    loadAndAnimate();
  }, []);

  const features = [
    {
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      title: "Online Examination Platform in Nigeria",
      description:
        "Take AI-powered examinations and assessments on Dealo. Our examination platform in Nigeria offers secure, proctored tests for certifications, job assessments, and skill evaluations. Perfect for students, professionals, and employers across Lagos, Abuja, and all Nigerian cities.",
      link: "/examinations",
      keywords: [
        "examination platform Nigeria",
        "online examination Nigeria",
        "exam platform Lagos",
        "certification examination Nigeria",
        "proctored exams Nigeria",
        "online assessment Nigeria",
        "examination system Nigeria",
      ],
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Professional Resume Builder for Nigerian Jobs",
      description:
        "Build ATS-friendly resumes that get you hired in Nigeria. Our resume builder includes Nigerian job market templates, industry-specific formats, and AI-powered suggestions. Create professional CVs for jobs in Lagos, Abuja, Port Harcourt, and across Nigeria.",
      link: "/resume-builder",
      keywords: [
        "resume builder Nigeria",
        "CV builder Nigeria",
        "resume builder Lagos",
        "professional resume Nigeria",
        "ATS resume builder Nigeria",
        "Nigerian resume template",
        "resume builder for Nigerian jobs",
      ],
    },
    {
      icon: <Briefcase className="w-6 h-6 text-white" />,
      title: "Freelancing Platform in Nigeria",
      description:
        "Start freelancing in Nigeria with Dealo's marketplace. Connect with clients locally and globally. Offer services in programming, design, writing, marketing, and more. Get paid in Naira with secure payment methods. Join thousands of Nigerian freelancers earning online.",
      link: "/marketplace",
      keywords: [
        "freelancing Nigeria",
        "freelance platform Nigeria",
        "freelance jobs Nigeria",
        "freelancing Lagos",
        "online freelancing Nigeria",
        "freelance marketplace Nigeria",
        "Nigerian freelancers",
      ],
    },
    {
      icon: <CreditCard className="w-6 h-6 text-white" />,
      title: "Scratch Cards in Nigeria - Digital Rewards",
      description:
        "Buy and redeem scratch cards in Nigeria on Dealo. Get instant rewards, course discounts, and cashback. Our digital scratch card system works across all Nigerian banks and mobile money platforms. Perfect for students and professionals looking for deals.",
      link: "/scratch-cards",
      keywords: [
        "scratch cards Nigeria",
        "digital scratch cards Nigeria",
        "scratch card Nigeria",
        "online scratch cards Nigeria",
        "scratch cards Lagos",
        "Nigerian scratch cards",
        "redeem scratch cards Nigeria",
      ],
    },
    {
      icon: <Video className="w-6 h-6 text-white" />,
      title: "Video Conferencing Platform for Nigeria",
      description:
        "Host professional video conferences, online classes, and virtual meetings on Dealo. Our video conferencing platform is optimized for Nigerian internet speeds with HD quality, screen sharing, and recording. Perfect for remote work, online education, and business meetings across Nigeria.",
      link: "/video-chat",
      keywords: [
        "video conferencing Nigeria",
        "online video calls Nigeria",
        "video conferencing platform Nigeria",
        "virtual meetings Nigeria",
        "video conferencing Lagos",
        "online meetings Nigeria",
        "video call Nigeria",
      ],
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-br from-gray-900/50 to-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-4">
          Everything You Need for{" "}
          <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Career Success
          </span>{" "}
          in Nigeria
        </h2>
        <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          From examinations to freelancing, resume building to video conferencing - Dealo has all the tools you need to succeed in Nigeria's job market.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>

        {/* Additional SEO Content */}
        <div className="mt-16 bg-white/5 rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-4">
            Why Choose Dealo for Your Career Needs in Nigeria?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="text-green-400 font-semibold mb-2">For Examinations</h4>
              <p>
                Our examination platform in Nigeria supports secure, AI-proctored tests for certifications, job assessments, and academic evaluations. Available in Lagos, Abuja, Port Harcourt, and all major Nigerian cities.
              </p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold mb-2">For Resume Building</h4>
              <p>
                Build professional, ATS-friendly resumes tailored for Nigerian employers. Our resume builder includes templates for all industries and job levels across Nigeria.
              </p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold mb-2">For Freelancing</h4>
              <p>
                Join Nigeria's fastest-growing freelancing platform. Connect with clients, get paid in Naira, and grow your freelance business in Lagos, Abuja, and beyond.
              </p>
            </div>
            <div>
              <h4 className="text-green-400 font-semibold mb-2">For Video Conferencing</h4>
              <p>
                Host professional video conferences optimized for Nigerian internet. Perfect for remote work, online classes, and business meetings across Nigeria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

