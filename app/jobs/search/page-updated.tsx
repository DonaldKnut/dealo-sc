"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronDown,
  Filter,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  Star,
  ArrowRight,
  Heart,
  Bookmark,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useSafeSession } from "@/hooks/use-safe-session";

interface Job {
  _id: string;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  postedBy?: string;
  country: string;
  remote: boolean;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  jobIcon?: string;
  skillsRequired?: string[];
  location?: string;
  city?: string;
  experienceRequired?: string | number;
  applications?: string[];
  category?: string;
  company?: {
    name: string;
    logo?: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const getCompanyInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const getCompanyColor = (name: string) => {
  const colors = [
    "bg-orange-100 text-orange-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-blue-100 text-blue-600",
    "bg-pink-100 text-pink-600",
    "bg-gray-100 text-gray-600",
  ];
  const index = name.length % colors.length;
  return colors[index];
};

const getCardHeaderColor = (index: number) => {
  const colors = [
    "bg-orange-50",
    "bg-green-50",
    "bg-purple-50",
    "bg-blue-50",
    "bg-pink-50",
    "bg-gray-50",
  ];
  return colors[index % colors.length];
};

export default function JobSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const isAuthenticated = !!sessionData?.user;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [savingJob, setSavingJob] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [workLocation, setWorkLocation] = useState(searchParams.get("location") || "");
  const [experience, setExperience] = useState(searchParams.get("experience") || "");
  const [salaryRange, setSalaryRange] = useState([1200, 20000]);
  const [workingSchedule, setWorkingSchedule] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch saved jobs for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/jobs/save")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const savedIds = (data.savedJobs as any[])
              .map((sj: any) => {
                const directId = sj?.job?._id ? sj.job._id.toString() : undefined;
                if (directId) return directId;
                if (typeof sj?.job?.toString === "function") {
                  return sj.job.toString();
                }
                return undefined;
              })
              .filter((id: string | undefined): id is string => Boolean(id));
            setSavedJobs(new Set<string>(savedIds));
          }
        })
        .catch((err) => console.error("Error fetching saved jobs:", err));
    }
  }, [isAuthenticated]);

  // Fetch jobs with server-side filtering and pagination
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (workLocation) params.set("location", workLocation);
        if (experience) params.set("experience", experience);
        if (salaryRange[0]) params.set("minSalary", salaryRange[0].toString());
        if (salaryRange[1]) params.set("maxSalary", salaryRange[1].toString());
        if (workingSchedule.length > 0) {
          // Map working schedule to job types
          const typeMap: Record<string, string> = {
            "Full time": "full-time",
            "Part time": "part-time",
            "Internship": "internship",
            "Project work": "contract",
          };
          const types = workingSchedule.map((s) => typeMap[s]).filter(Boolean);
          if (types.length > 0) params.set("type", types[0]); // API supports single type for now
        }
        if (employmentType.includes("Flexible schedule")) {
          params.set("remote", "true");
        }
        params.set("page", currentPage.toString());
        params.set("limit", "12");
        params.set("sortBy", sortBy);

        const response = await fetch(`/api/dealo-jobs?${params.toString()}`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setJobs(data.jobs || []);
            setPagination(data.pagination || null);

            // Check which jobs user has applied to
            if (isAuthenticated && data.jobs) {
              const appliedChecks = data.jobs.map((job: Job) =>
                fetch(`/api/jobs/apply?jobId=${job._id}`)
                  .then((res) => res.json())
                  .then((data) => ({ jobId: job._id, applied: data.applied || false }))
              );
              Promise.all(appliedChecks).then((results) => {
                const applied = new Set(results.filter((r) => r.applied).map((r) => r.jobId));
                setAppliedJobs(applied);
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, workLocation, experience, salaryRange, workingSchedule, employmentType, sortBy, currentPage, isAuthenticated]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const formatSalary = (budget?: number) => {
    if (!budget) return "Not specified";
    if (budget >= 1000) {
      return `$${(budget / 1000).toFixed(0)}K`;
    }
    return `$${budget}`;
  };

  const toggleFilter = (filterArray: string[], setFilterArray: (arr: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((item) => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const handleSaveJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/sign-in?redirect=/jobs/search");
      return;
    }

    setSavingJob(jobId);
    try {
      if (savedJobs.has(jobId)) {
        // Unsave
        const response = await fetch(`/api/jobs/save?jobId=${jobId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          setSavedJobs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
        }
      } else {
        // Save
        const response = await fetch("/api/jobs/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ jobId }),
        });
        if (response.ok) {
          setSavedJobs((prev) => {
            const next = new Set(prev);
            next.add(jobId);
            return next;
          });
        }
      }
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setSavingJob(null);
    }
  };

  const handleApply = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/sign-in?redirect=/jobs/search");
      return;
    }

    if (appliedJobs.has(jobId)) {
      router.push(`/employment/dealojobs/${jobId}`);
      return;
    }

    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ jobId }),
      });

      if (response.ok) {
        setAppliedJobs((prev) => {
          const next = new Set(prev);
          next.add(jobId);
          return next;
        });
        router.push(`/employment/dealojobs/${jobId}`);
      }
    } catch (error) {
      console.error("Error applying:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Search and Filter Bar - Mobile Optimized */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
            {/* Search Input */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Designer"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Work Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={workLocation}
                onChange={(e) => {
                  setWorkLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Work location</option>
                <option value="Remote">Remote</option>
                <option value="Lagos">Lagos, Nigeria</option>
                <option value="Abuja">Abuja, Nigeria</option>
                <option value="Port Harcourt">Port Harcourt, Nigeria</option>
                <option value="Kano">Kano, Nigeria</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Experience */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Experience</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Expert Level">Expert Level</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Salary Range */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select className="w-full pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                <option>Per month</option>
                <option>Per hour</option>
                <option>Per year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Salary Range Slider - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:block mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={salaryRange[0]}
                onChange={(e) => {
                  setSalaryRange([parseInt(e.target.value), salaryRange[1]]);
                  setCurrentPage(1);
                }}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={salaryRange[1]}
                onChange={(e) => {
                  setSalaryRange([salaryRange[0], parseInt(e.target.value)]);
                  setCurrentPage(1);
                }}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Sidebar - Filters - Hidden on mobile, shown on larger screens */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Promotional Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Get Your Best Profession with Dealo</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Find the perfect job that matches your skills and career goals.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              {/* Working Schedule */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Working schedule</h4>
                <div className="space-y-2">
                  {["Full time", "Part time", "Internship", "Project work", "Volunteering"].map((schedule) => (
                    <label key={schedule} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workingSchedule.includes(schedule)}
                        onChange={() => {
                          toggleFilter(workingSchedule, setWorkingSchedule, schedule);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{schedule}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Employment type</h4>
                <div className="space-y-2">
                  {["Full day", "Flexible schedule"].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={employmentType.includes(type)}
                        onChange={() => {
                          toggleFilter(employmentType, setEmploymentType, type);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Job Listings */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Recommended jobs
                </h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {pagination?.total || 0} jobs found
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="updatedAt">Last updated</option>
                  <option value="salaryHigh">Salary: High to Low</option>
                  <option value="salaryLow">Salary: Low to High</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Job Cards Grid - Mobile Optimized */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 animate-pulse"
                  >
                    <div className="h-24 bg-gray-200 rounded-t-2xl"></div>
                    <div className="p-4 sm:p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {jobs.map((job, index) => {
                    const companyName = job.company?.name || "Company";
                    const companyInitial = getCompanyInitial(companyName);
                    const companyColor = getCompanyColor(companyName);
                    const headerColor = getCardHeaderColor(index);
                    const isSaved = savedJobs.has(job._id);
                    const hasApplied = appliedJobs.has(job._id);

                    return (
                      <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col"
                        onClick={() => router.push(`/employment/dealojobs/${job._id}`)}
                      >
                        {/* Colored Header */}
                        <div className={`${headerColor} p-4 flex items-center justify-between`}>
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {job.company?.logo ? (
                              <Image
                                src={job.company.logo}
                                alt={companyName}
                                width={40}
                                height={40}
                                className="rounded-full flex-shrink-0"
                              />
                            ) : (
                              <div className={`w-10 h-10 ${companyColor} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
                                {companyInitial}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 truncate">{companyName}</p>
                              <p className="text-xs text-gray-600 truncate">{job.title}</p>
                            </div>
                          </div>
                          {/* Save Button */}
                          <button
                            onClick={(e) => handleSaveJob(job._id, e)}
                            disabled={savingJob === job._id}
                            className="ml-2 p-2 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0"
                            title={isSaved ? "Unsave job" : "Save job"}
                          >
                            {savingJob === job._id ? (
                              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : isSaved ? (
                              <Bookmark className="w-5 h-5 text-blue-600 fill-current" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        {/* Job Details */}
                        <div className="p-4 sm:p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <span className="text-xs text-gray-500">
                              {formatDate(job.updatedAt || job.createdAt)}
                            </span>
                            {job.budget && (
                              <span className="text-sm font-semibold text-gray-900">
                                {formatSalary(job.budget)}/hr
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3 sm:mb-4">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{job.location || job.city || job.country || "Location not specified"}</span>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.type && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                {job.type}
                              </span>
                            )}
                            {job.experienceRequired && (
                              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                                {typeof job.experienceRequired === "number"
                                  ? `${job.experienceRequired} years`
                                  : job.experienceRequired}
                              </span>
                            )}
                            {job.remote && (
                              <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                Remote
                              </span>
                            )}
                            {job.category && (
                              <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                                {job.category}
                              </span>
                            )}
                          </div>

                          {/* Application Count */}
                          {job.applications && job.applications.length > 0 && (
                            <div className="text-xs text-gray-500 mb-4">
                              {job.applications.length} {job.applications.length === 1 ? "application" : "applications"}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="mt-auto flex gap-2">
                            <button
                              onClick={(e) => handleApply(job._id, e)}
                              className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                hasApplied
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                            >
                              {hasApplied ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Applied
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Apply
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => router.push(`/employment/dealojobs/${job._id}`)}
                              className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                      {pagination.total} jobs
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                pagination.page === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={!pagination.hasNext}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




