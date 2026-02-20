"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
// GSAP will be loaded dynamically in useEffect

interface AdvantageCardProps {
  title: string;
  description: string;
  features: string[];
  index: number;
}

function AdvantageCard({ title, description, features, index }: AdvantageCardProps) {
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
          y: 30,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
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
      className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-green-400/20 hover:border-green-400/40 transition-all duration-300"
    >
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 mb-4 text-sm">{description}</p>
      <div className="space-y-2">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImprovedCompetitorSection() {
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
            y: -20,
            duration: 0.8,
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

  const advantages = [
    {
      title: "Nigerian-First Approach",
      description:
        "Built specifically for the Nigerian market with local payment methods, Naira pricing, and culturally relevant content.",
      features: [
        "Bank transfer and mobile money support",
        "Naira pricing (no USD conversion fees)",
        "Nigerian instructors and case studies",
        "Local customer support in Nigerian timezone",
        "Optimized for Nigerian internet speeds",
      ],
    },
    {
      title: "AI-Powered Certifications",
      description:
        "Get industry-recognized certifications through AI-powered assessments that employers trust across Nigeria.",
      features: [
        "AI-proctored examinations",
        "Industry-recognized certificates",
        "Job placement for certified professionals",
        "Skills validation for Nigerian employers",
        "Portfolio-ready credentials",
      ],
    },
    {
      title: "Complete Career Platform",
      description:
        "Everything you need in one place: learn, get certified, build your resume, freelance, and find jobs.",
      features: [
        "10,000+ courses across all industries",
        "Resume builder for Nigerian jobs",
        "Freelance marketplace",
        "Job board with Nigerian employers",
        "Video conferencing for remote work",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-gray-900/80 to-black/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-4">
          Why{" "}
          <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Dealo
          </span>{" "}
          is the Best Choice for Nigerian Professionals
        </h2>
        <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Unlike international platforms, Dealo is designed specifically for the Nigerian market with local payment methods, Naira pricing, and features that matter to Nigerian professionals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {advantages.map((advantage, index) => (
            <AdvantageCard key={advantage.title} {...advantage} index={index} />
          ))}
        </div>

        {/* SEO-Rich Comparison Table */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Dealo vs International Platforms
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="pb-4 text-white font-semibold">Feature</th>
                  <th className="pb-4 text-green-400 font-semibold">Dealo</th>
                  <th className="pb-4 text-gray-400 font-semibold">Udemy</th>
                  <th className="pb-4 text-gray-400 font-semibold">Coursera</th>
                  <th className="pb-4 text-gray-400 font-semibold">LinkedIn Learning</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/10">
                  <td className="py-4">Pricing Currency</td>
                  <td className="py-4 text-green-400">Naira (₦)</td>
                  <td className="py-4">USD ($)</td>
                  <td className="py-4">USD ($)</td>
                  <td className="py-4">USD ($)</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4">Payment Methods</td>
                  <td className="py-4 text-green-400">Bank Transfer, Mobile Money</td>
                  <td className="py-4">Credit Card Only</td>
                  <td className="py-4">Credit Card Only</td>
                  <td className="py-4">Credit Card Only</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4">Nigerian Content</td>
                  <td className="py-4 text-green-400">Yes, Extensive</td>
                  <td className="py-4">Limited</td>
                  <td className="py-4">Limited</td>
                  <td className="py-4">Limited</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4">AI Certifications</td>
                  <td className="py-4 text-green-400">Included</td>
                  <td className="py-4">No</td>
                  <td className="py-4">Paid Add-on</td>
                  <td className="py-4">No</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4">Job Placement</td>
                  <td className="py-4 text-green-400">Yes</td>
                  <td className="py-4">No</td>
                  <td className="py-4">Limited</td>
                  <td className="py-4">LinkedIn Only</td>
                </tr>
                <tr>
                  <td className="py-4">Local Support</td>
                  <td className="py-4 text-green-400">24/7 Nigerian Timezone</td>
                  <td className="py-4">International</td>
                  <td className="py-4">International</td>
                  <td className="py-4">International</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Hidden SEO Keywords */}
        <div className="hidden">
          <span>
            Dealo vs Udemy Nigeria, Dealo vs Coursera Nigeria, Dealo vs LinkedIn Learning Nigeria,
            best learning platform Nigeria, Nigerian online courses, Naira pricing courses,
            local payment methods Nigeria, Nigerian instructors, AI certifications Nigeria
          </span>
        </div>
      </div>
    </section>
  );
}

