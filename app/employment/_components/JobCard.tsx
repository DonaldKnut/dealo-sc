// components/JobCard.tsx
import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaRegBookmark } from "react-icons/fa";
import { motion } from "framer-motion";

interface Job {
  id: string;
  jobIcon?: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  postedBy: string;
  skillsRequired?: string[];
  experienceRequired?: string | number; // Match the imported type
  country: string;
  type: string;
  isRemote?: boolean;
  createdBy: string;
}

interface JobCardProps {
  job: Job;
  currentUserId: string;
  onApply: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, currentUserId, onApply }) => {
  // Shorten the description if it's too long
  const shortenedDescription =
    job.description.length > 100
      ? `${job.description.substring(0, 100)}...`
      : job.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border rounded-lg shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow"
    >
      {/* Header Section */}
      <div className="flex justify-between items-start">
        {/* Company Logo */}
        {job.jobIcon && (
          <Image src={job.jobIcon} alt={job.title} width={45} height={40} />
        )}
        {/* Country and Save Icon */}
        <div className="flex flex-col items-end">
          <span className="text-gray-700 bg-[#b5ddb0] px-4 py-2 rounded-[5px] my-2  font-bold">
            {job.country}
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            <FaRegBookmark size={20} />
          </button>
        </div>
      </div>

      {/* Job Title and Description */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 playfair-italic">
          {job.title || "Job Title"}
        </h3>
        <p className="text-gray-600 text-sm mt-2">{shortenedDescription}</p>
      </div>

      {/* Skills and Experience Required */}
      {job.skillsRequired && job.skillsRequired.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {job.skillsRequired.map((skill, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.1 }}
              className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      )}

      {/* Salary, Type, and Deadline */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-green-700 font-semibold">
            Salary: ${job.budget.toLocaleString()}
          </p>
          <p className="text-gray-600 text-sm">
            Type: {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
          </p>
          <p className="text-gray-600 text-sm">
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </p>
        </div>
        {/* Apply Button */}
        {job.createdBy !== currentUserId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onApply(job)}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Apply Now
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;
