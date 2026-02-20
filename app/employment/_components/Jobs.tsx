"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import TimeAgo from "./TimeAgo";

// Define the Job interface specifically for frontend usage
interface FrontendJob {
  _id: string;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  postedBy?: string;
  country: string; // Ensure country is always a string
  remote: boolean;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  jobIcon?: string;
  skillsRequired?: string[];
  location?: string;
  experienceRequired?: string | number;
  applications?: string[];
  category?: string;
}

export default function Jobs({
  header,
  jobs,
}: {
  header: string;
  jobs: FrontendJob[];
}) {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 relative bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-purple-400 mb-3 uppercase tracking-wider">
            Opportunities
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {header || "Featured Jobs"}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover your next career opportunity from top companies
          </p>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => {
            const descriptionText = job.description
              ? job.description.replace(/<[^>]*>/g, "").substring(0, 120)
              : "No description available";

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Link href={`/employment/show/${job._id}`}>
                  <div className="group relative h-full bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                    
                    <div className="relative z-10">
                      {/* Header with Icon and Category */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {job.jobIcon ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                              <Image
                                src={job.jobIcon}
                                alt={job.title}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                              <Briefcase className="w-6 h-6 text-purple-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-medium text-purple-400 uppercase tracking-wide">
                              {job.category || "General"}
                            </p>
                          </div>
                        </div>
                        {job.createdAt && (
                          <div className="text-xs text-gray-500">
                            <TimeAgo createdAt={new Date(job.createdAt)} />
                          </div>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                        {job.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {descriptionText}...
                      </p>

                      {/* Job Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span>
                            {job.remote ? "Remote" : "On-site"} • {job.country || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span className="capitalize">{job.type || "Full-time"}</span>
                        </div>
                        {job.budget && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <DollarSign className="w-4 h-4 text-purple-400" />
                            <span>
                              {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: "NGN",
                                minimumFractionDigits: 0,
                              }).format(job.budget)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Skills Tags */}
                      {job.skillsRequired && job.skillsRequired.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skillsRequired.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skillsRequired.length > 3 && (
                            <span className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400">
                              +{job.skillsRequired.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* View Details Link */}
                      <div className="flex items-center gap-2 text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
                        View Details
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
