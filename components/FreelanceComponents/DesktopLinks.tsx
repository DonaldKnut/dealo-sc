"use client";

import Link from "next/link";
import Image from "next/image";
import { useSafeSession } from "@/hooks/use-safe-session";
import { motion } from "framer-motion";

interface DesktopLinksProps {
  setOpen: (open: boolean) => void;
  setHoveredNav: (nav: string | null) => void;
}

const DesktopLinks: React.FC<DesktopLinksProps> = ({ setOpen, setHoveredNav }) => {
  const session = useSafeSession();
  const { data: sessionData } = session || {};

  const links = [
    { label: "Education", href: "/dealoforge" },
    { label: "Freelance", href: "/marketplace" },
    { label: "Jobs", href: "/employment" },
    { label: "Certification", href: "/certification" },
  ];

  return (
    <div className="hidden md:flex items-center space-x-8">
      {links.map((link) => (
        <motion.div
          key={link.label}
          onHoverStart={() => setHoveredNav(link.label)}
          onHoverEnd={() => setHoveredNav(null)}
          whileHover={{ y: -2 }}
          className="relative group"
        >
          <Link
            href={link.href}
            className="text-white font-semibold text-sm tracking-wide hover:text-emerald-400 transition-colors"
          >
            {link.label}
          </Link>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
        </motion.div>
      ))}

      {/* User Profile / Authentication Button */}
      <div className="relative z-[1001] hidden md:block pl-4 border-l border-white/10">
        <Link href={sessionData?.user ? "/dealoforge/dashboard" : "/sign-in"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 px-4 py-2 rounded-full transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 p-0.5 overflow-hidden ring-2 ring-emerald-500/20">
              <Image
                src="/user.png"
                alt="User"
                className="rounded-full bg-black object-cover"
                width={30}
                height={30}
              />
            </div>
            <span className="text-white font-bold text-sm">
              {sessionData?.user ? "Dashboard" : "Get Started"}
            </span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default DesktopLinks;
