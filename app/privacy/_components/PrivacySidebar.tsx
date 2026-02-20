"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const touchStartX = useRef<number | null>(null);

  const sections = useMemo(() => {
    return [
      { id: "section-1", title: "1. Information We Collect" },
      { id: "section-2", title: "2. How We Use Your Data" },
      { id: "section-3", title: "3. Data Sharing" },
      { id: "section-4", title: "4. User Rights" },
      { id: "section-5", title: "5. Security Measures" },
      { id: "section-6", title: "6. Third-Party Links & Embeds" },
      { id: "section-7", title: "7. Cookies & Tracking" },
      { id: "section-8", title: "8. Teen Accounts & Children’s Privacy" },
      { id: "section-9", title: "9. Changes to This Policy" },
      { id: "section-10", title: "10. Contact Us" },
    ];
  }, []);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current) return;
      const touchEndX = e.touches[0].clientX;
      const distance = touchStartX.current - touchEndX;
      if (distance > 50) {
        setIsOpen(false);
        touchStartX.current = null;
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      let current = "";
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollY + 100) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-between w-6 h-6 focus:outline-none"
        >
          <span
            className={`h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`h-0.5 w-full bg-white transition-opacity duration-300 ease-in-out ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`h-0.5 w-full bg-white transform transition duration-300 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${
          isOpen
            ? "bg-black bg-opacity-50 opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-64 bg-[rgb(54,78,54)] text-white p-4 overflow-y-auto transition-transform duration-300 z-40 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden shadow-[4px_0_10px_0_rgba(0,0,0,0.3)]`}
      >
        <h2 className="text-xl font-bold mb-4">Privacy Policy Sections</h2>
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/privacy#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block hover:text-[#9ad7a3] hover:underline ${
                    activeSection === section.id
                      ? "text-[#9ad7a3] font-bold"
                      : "text-[#cacccb]"
                  }`}
                >
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 w-64 h-screen bg-[rgb(54,78,54)] text-white p-4 overflow-y-auto shadow-[4px_0_10px_0_rgba(0,0,0,0.3)]">
        <h2 className="text-xl font-bold mb-4">Privacy Policy Sections</h2>
        <nav>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/privacy#${section.id}`}
                  className={`block hover:text-[#9ad7a3] hover:underline ${
                    activeSection === section.id
                      ? "text-[#9ad7a3] font-bold"
                      : "text-[#cacccb]"
                  }`}
                >
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Sidebar spacing for desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
};

export default Sidebar;
