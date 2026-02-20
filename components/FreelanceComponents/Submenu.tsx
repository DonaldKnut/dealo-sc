"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SubMenuProps {
  hoveredNav?: string | null;
}

const SubMenu: React.FC<SubMenuProps> = ({ hoveredNav }) => {
  // Define background colors based on which nav item is hovered in the parent
  const getBackgroundColor = () => {
    switch (hoveredNav) {
      case "Education":
        return "bg-emerald-900/90";
      case "Freelance":
        return "bg-green-900/90";
      case "Jobs":
        return "bg-teal-900/90";
      case "Certification":
        return "bg-emerald-800/90";
      default:
        return "bg-[#323e33]/80";
    }
  };

  const navItems = [
    { label: "Video Conference", href: "/video-chat" },
    { label: "Travel Loans", href: "/explore" },
    { label: "Messaging", href: "/messenger" },
    { label: "Drive", href: "/dealoforge/create-course" },
    { label: "AI Resume Builder", href: "/launch-page" },
    { label: "Mock Interview", href: "/launch-page" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative py-3 shadow-2xl z-[999] hidden md:block w-full backdrop-blur-xl border-y border-white/5 transition-colors duration-500 ${getBackgroundColor()}`}
    >
      <div className="container mx-auto max-w-7xl px-6 flex justify-around items-center">
        {navItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className="text-white/80 hover:text-emerald-400 text-sm font-medium tracking-wide transition-all hover:scale-105 block py-1 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
    </motion.div>
  );
};

export default SubMenu;
