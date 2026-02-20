"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Search,
  Star,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import EmptyState from "@/components/EmptyState";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "freelance";
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
  featured: boolean;
  urgent: boolean;
  matchScore?: number;
  matchReasons?: string[];
  _id?: string;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Fetch personalized job recommendations
      const res = await fetch("/api/jobs/personalized", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      const mapped: Job[] = (data.jobs || []).map((j: any) => ({
        id: String(j._id || j.id),
        title: j.title,
        company: j.company?.name || j.companyName || "Company",
        location: j.location || j.city || j.country || "Location not specified",
        type: (j.type || "full-time") as any,
        salary: j.budget ? `$${j.budget.toLocaleString()}` : "Not specified",
        posted: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recently",
        description: j.description || "",
        requirements: j.skillsRequired || [],
        benefits: [],
        featured: !!j.isFeatured,
        urgent: false,
        matchScore: j.matchScore,
        matchReasons: j.matchReasons || [],
        _id: j._id,
      }));
      setJobs(mapped);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.type === selectedType;
    const matchesLocation =
      selectedLocation === "all" ||
      job.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-600";
      case "part-time":
        return "bg-blue-600";
      case "contract":
        return "bg-purple-600";
      case "freelance":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Personalized Job Recommendations</h1>
            <p className="text-gray-400">
              Jobs matched to your skills, interests, and profile
            </p>
          </div>
          <a
            href="/jobs"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Browse All Jobs
          </a>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Locations</option>
            <option value="remote">Remote</option>
            <option value="san francisco">San Francisco</option>
            <option value="new york">New York</option>
            <option value="london">London</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{jobs.length}</p>
              <p className="text-gray-400 text-sm">Total Jobs</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {jobs.filter((job) => job.featured).length}
              </p>
              <p className="text-gray-400 text-sm">Featured</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {jobs.filter((job) => job.urgent).length}
              </p>
              <p className="text-gray-400 text-sm">Urgent</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">1,247</p>
              <p className="text-gray-400 text-sm">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 && jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Jobs Available"
            description="There are currently no job listings. Check back later for new opportunities!"
            illustration="💼"
            action={{
              label: "Browse All Jobs",
              href: "/jobs",
            }}
          />
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Jobs Found"
            description="Try adjusting your search criteria or filters to find matching opportunities."
            illustration="🔍"
          />
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gray-800/50 rounded-2xl p-6 border transition-all hover:border-gray-600 ${
                job.featured
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-gray-700"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-white">
                      {job.title}
                    </h3>
                    {job.matchScore !== undefined && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {job.matchScore}% Match
                      </span>
                    )}
                    {job.featured && (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                        Featured
                      </span>
                    )}
                    {job.urgent && (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  
                  {job.matchReasons && job.matchReasons.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-green-400 mb-1">Why this matches you:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.matchReasons.slice(0, 3).map((reason, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs text-white ${getTypeColor(
                        job.type
                      )}`}
                    >
                      {job.type.replace("-", " ")}
                    </span>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                      <DollarSign className="w-3 h-3 inline mr-1" />
                      {job.salary}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={job._id ? `/employment/dealojobs/${job._id}` : `/jobs`}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                  >
                    View Details
                  </a>
                  <a
                    href="/jobs"
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-center"
                  >
                    Browse All
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsPage;
