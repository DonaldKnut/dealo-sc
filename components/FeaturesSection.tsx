"use client";

import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaBriefcase,
  FaRobot,
  FaDollarSign,
} from "react-icons/fa"; // Import specific icons
import { MdArrowForward } from "react-icons/md"; // Icon for the arrow

const features = [
  {
    title: "AI-Powered Education",
    description:
      "Personalized learning with AI-enhanced YouTube courses and certifications.",
    icon: FaGraduationCap,
  },
  {
    title: "Freelancing Ecosystem",
    description:
      "Seamless transition from skill-building to gig opportunities.",
    icon: FaBriefcase,
  },
  {
    title: "AI Career Tools",
    description:
      "Mock interviews and career planning integrated with skill development.",
    icon: FaRobot,
  },
  {
    title: "Skill-Based Financing",
    description:
      "Skill loans tied to global job market demand, powered by blockchain.",
    icon: FaDollarSign,
  },
];

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section className="min-h-screen py-20 px-6">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-green-300">
            What Makes{" "}
            <span className="text-white playfair-italic text-5xl">Dealo</span>{" "}
            Unique?
          </h2>
          <p className="mt-4 text-[#20f584]">
            Dealo bridges the gap between learning, earning, and career growth.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-[90%] m-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon; // Use the icon directly from the array

            return (
              <motion.div
                key={index}
                className="group bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                variants={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-100 rounded-full text-green-600">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-gray-600">{feature.description}</p>
                <div className="mt-6 flex items-center gap-2 text-green-600 font-medium group-hover:underline">
                  Learn More <MdArrowForward size={18} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
