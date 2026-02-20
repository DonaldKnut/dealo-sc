"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({
  className,
  img,
  title,
  description,
  handleClick,
}: HomeCardProps) => {
  return (
    <motion.section
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className={cn(
        "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col justify-between w-full min-h-[280px] cursor-pointer group hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl mb-6 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300">
        <Image
          src={img}
          alt="meeting"
          width={32}
          height={32}
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors font-heading">
          {title}
        </h1>
        <p className="text-gray-300 group-hover:text-gray-200 transition-colors font-body leading-relaxed">
          {description}
        </p>
      </div>

      {/* Hover effect indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </motion.section>
  );
};

export default HomeCard;
