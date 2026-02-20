// components/JobList.tsx
import React from "react";
import JobCard from "./JobCard";
import { Job } from "@/types";
import { motion } from "framer-motion";

interface JobListProps {
  jobs: Job[];
  currentUserId: string;
  onApply: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs = [],
  currentUserId,
  onApply,
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.2 },
      },
    }}
    className="w-[85%] place-content-center m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    {jobs.map((job) => (
      <JobCard
        key={job.id}
        job={job}
        currentUserId={currentUserId}
        onApply={onApply}
      />
    ))}
  </motion.div>
);

export default JobList;
