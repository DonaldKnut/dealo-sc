"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  ChevronDown,
  Filter,
  Clock,
  X,
  ArrowRight,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { useSafeSession } from "@/hooks/use-safe-session";
import toast from "react-hot-toast";

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
  createdAt: string;
  updatedAt?: string;
  jobIcon?: string;
  skillsRequired?: string[];
  location?: string;
  experienceRequired?: string | number;
  category?: string;
}

interface Resume {
  _id: string;
  title: string;
  template: string;
  isDefault: boolean;
  updatedAt: string;
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const locationParam = searchParams.get("location") || "";
  const session = useSafeSession();
  const { data: sessionData } = session || {};

  const [searchQuery, setSearchQuery] = useState(query);
  const [workLocation, setWorkLocation] = useState(
    locationParam || "All Locations"
  );
  const [experience, setExperience] = useState("All");
  const [sortBy, setSortBy] = useState("Last updated");
  const [showFilters, setShowFilters] = useState(false);

  const [workingSchedule, setWorkingSchedule] = useState({
    fullTime: true,
    partTime: true,
    internship: false,
    projectWork: false,
    volunteering: false,
  });

  const [employmentType, setEmploymentType] = useState({
    fullDay: true,
    flexibleSchedule: true,
    shiftWork: false,
    distantWork: true,
    shiftMethod: false,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        let url = "/api/dealo-jobs";
        if (query) {
          url = `/api/employment/search?q=${encodeURIComponent(query)}`;
        }
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        if (response.ok && data.jobs) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        } else if (response.ok && Array.isArray(data)) {
          setJobs(data);
          setFilteredJobs(data);
        }
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [query]);

  useEffect(() => {
    async function fetchResumes() {
      if (!sessionData?.user) return;
      try {
        const response = await fetch("/api/resume/save", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.resumes) {
          setResumes(data.resumes);
          const def = data.resumes.find((r: Resume) => r.isDefault);
          setSelectedResume(
            def?._id || data.resumes[0]?._id || ""
          );
        }
      } catch {
        // silent
      }
    }
    fetchResumes();
  }, [sessionData]);

  useEffect(() => {
    let filtered = [...jobs];

    const scheduleFilters: string[] = [];
    if (workingSchedule.fullTime) scheduleFilters.push("full", "full-time");
    if (workingSchedule.partTime) scheduleFilters.push("part", "part-time");
    if (workingSchedule.internship) scheduleFilters.push("internship");
    if (workingSchedule.projectWork) scheduleFilters.push("project");
    if (workingSchedule.volunteering) scheduleFilters.push("volunteer");

    if (scheduleFilters.length > 0) {
      filtered = filtered.filter((job) => {
        const t = (job.type || "").toLowerCase();
        return scheduleFilters.some((f) => t.includes(f));
      });
    }

    if (!employmentType.distantWork) {
      filtered = filtered.filter((job) => !job.remote);
    }

    if (workLocation && workLocation !== "All Locations") {
      filtered = filtered.filter((job) => {
        const loc = (job.location || job.country || "").toLowerCase();
        return loc.includes(workLocation.toLowerCase());
      });
    }

    if (experience !== "All") {
      filtered = filtered.filter((job) => {
        const exp = String(job.experienceRequired || "").toLowerCase();
        return exp.includes(experience.toLowerCase());
      });
    }

    if (sortBy === "Last updated") {
      filtered.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime()
      );
    } else if (sortBy === "Salary: High to Low") {
      filtered.sort((a, b) => (b.budget || 0) - (a.budget || 0));
    } else if (sortBy === "Salary: Low to High") {
      filtered.sort((a, b) => (a.budget || 0) - (b.budget || 0));
    }

    setFilteredJobs(filtered);
  }, [
    jobs,
    workingSchedule,
    employmentType,
    workLocation,
    experience,
    sortBy,
  ]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (workLocation && workLocation !== "All Locations")
      params.set("location", workLocation);
    router.push(`/employment/search?${params.toString()}`);
  };

  const handleApply = async () => {
    if (!selectedJob || !selectedResume) {
      toast.error("Please select a resume");
      return;
    }
    if (!sessionData?.user) {
      toast.error("Please sign in to apply");
      router.push("/sign-in");
      return;
    }
    setApplying(true);
    try {
      const response = await fetch("/api/jobs/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          jobId: selectedJob._id,
          jobTitle: selectedJob.title,
          company: selectedJob.category || "Unknown",
          resumeId: selectedResume,
          coverLetter,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Application submitted!");
        setShowApplyModal(false);
        setCoverLetter("");
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return "Just now";
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  const clearFilters = () => {
    setWorkingSchedule({
      fullTime: true,
      partTime: true,
      internship: false,
      projectWork: false,
      volunteering: false,
    });
    setEmploymentType({
      fullDay: true,
      flexibleSchedule: true,
      shiftWork: false,
      distantWork: true,
      shiftMethod: false,
    });
    setExperience("All");
    setWorkLocation("All Locations");
  };

  const CheckboxItem = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
          checked
            ? "bg-green-500 border-green-500"
            : "border-white/15 bg-white/[0.03] group-hover:border-green-500/40"
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Search Bar */}
      <div className="border-b border-white/[0.06] bg-black/30 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5">
              <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 w-44">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <select
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none cursor-pointer [&>option]:bg-[#0f1a0f]"
              >
                <option>All Locations</option>
                <option>Lagos, Nigeria</option>
                <option>Abuja, Nigeria</option>
                <option>Port Harcourt</option>
                <option>Remote</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-all shadow-lg shadow-green-500/15 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-gray-400 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`${showFilters ? "block" : "hidden"} lg:block space-y-5`}
          >
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 sticky top-36">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-green-500 hover:text-green-400 transition-colors"
                >
                  Clear all
                </button>
              </div>

              {/* Experience */}
              <div className="mb-5">
                <h4 className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-2.5">
                  Experience
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Junior", "Middle", "Senior"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setExperience(lvl)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        experience === lvl
                          ? "bg-green-500/15 text-green-400 border border-green-500/20"
                          : "bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-5">
                <h4 className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-2.5">
                  Schedule
                </h4>
                <div className="space-y-2">
                  {(
                    [
                      ["fullTime", "Full time"],
                      ["partTime", "Part time"],
                      ["internship", "Internship"],
                      ["projectWork", "Project work"],
                      ["volunteering", "Volunteering"],
                    ] as const
                  ).map(([key, label]) => (
                    <CheckboxItem
                      key={key}
                      label={label}
                      checked={
                        workingSchedule[
                          key as keyof typeof workingSchedule
                        ]
                      }
                      onChange={(v) =>
                        setWorkingSchedule({
                          ...workingSchedule,
                          [key]: v,
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <h4 className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-2.5">
                  Type
                </h4>
                <div className="space-y-2">
                  {(
                    [
                      ["fullDay", "Full day"],
                      ["flexibleSchedule", "Flexible"],
                      ["shiftWork", "Shift work"],
                      ["distantWork", "Remote"],
                      ["shiftMethod", "Shift method"],
                    ] as const
                  ).map(([key, label]) => (
                    <CheckboxItem
                      key={key}
                      label={label}
                      checked={
                        employmentType[key as keyof typeof employmentType]
                      }
                      onChange={(v) =>
                        setEmploymentType({
                          ...employmentType,
                          [key]: v,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job Results */}
          <main>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {query ? `Results for "${query}"` : "Recommended Jobs"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-gray-300 outline-none cursor-pointer [&>option]:bg-[#0f1a0f]"
                >
                  <option>Last updated</option>
                  <option>Salary: High to Low</option>
                  <option>Salary: Low to High</option>
                </select>
              </div>
            </div>

            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-emerald-600/15 to-green-700/10 border border-green-500/15 rounded-xl p-5 mb-5 flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Get your best profession with Dealo
                </h3>
                <p className="text-xs text-gray-500">
                  Post a job listing and find top talent
                </p>
              </div>
              <Link
                href="/employment/new-listing"
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/15"
              >
                Post a Job
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* Job Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.06]" />
                      <div className="space-y-1.5">
                        <div className="w-20 h-3 bg-white/[0.06] rounded" />
                        <div className="w-14 h-2.5 bg-white/[0.04] rounded" />
                      </div>
                    </div>
                    <div className="w-3/4 h-4 bg-white/[0.06] rounded mb-2" />
                    <div className="w-1/2 h-3 bg-white/[0.04] rounded" />
                  </div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -2 }}
                    onClick={() => router.push(`/employment/show/${job._id}`)}
                    className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-green-500/15 hover:bg-white/[0.05] transition-all cursor-pointer group"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {job.jobIcon ? (
                          <Image
                            src={job.jobIcon}
                            alt={job.title}
                            width={36}
                            height={36}
                            className="rounded-xl"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-green-500/10 flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-green-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {job.category || "General"}
                          </p>
                          <p className="text-[10px] text-gray-600">
                            {timeAgo(job.createdAt)}
                          </p>
                        </div>
                      </div>
                      {job.remote && (
                        <span className="text-[10px] text-green-400 bg-green-500/[0.08] border border-green-500/15 px-2 py-0.5 rounded-full font-medium">
                          Remote
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-green-300 transition-colors leading-snug line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-2.5 text-[11px] text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location || job.country || "Not specified"}
                      </span>
                      <span className="text-gray-700">·</span>
                      <span className="capitalize">
                        {job.type || "Full Time"}
                      </span>
                      {job.experienceRequired && (
                        <>
                          <span className="text-gray-700">·</span>
                          <span>{String(job.experienceRequired)}</span>
                        </>
                      )}
                    </div>

                    {/* Skills */}
                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.skillsRequired.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] text-gray-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <span className="text-[10px] text-gray-600">
                            +{job.skillsRequired.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                      {job.budget ? (
                        <span className="text-sm font-semibold text-green-400">
                          ${job.budget.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">
                          Salary not listed
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                          setShowApplyModal(true);
                        }}
                        className="text-xs font-medium text-green-400 border border-green-500/20 bg-green-500/[0.06] px-3 py-1.5 rounded-lg hover:bg-green-500/[0.12] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-12 flex flex-col items-center justify-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm text-gray-400 mb-1 font-medium">
                  No jobs match your filters
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="text-xs text-green-400 border border-green-500/20 bg-green-500/[0.06] px-4 py-2 rounded-lg hover:bg-green-500/[0.12] transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111a11] border border-white/[0.08] rounded-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Apply for this position
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedJob.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-500 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Resume */}
              <div className="mb-5">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 block">
                  Resume
                </label>
                {resumes.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-lg p-6 text-center">
                    <Briefcase className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 mb-2">
                      No resumes found
                    </p>
                    <Link
                      href="/dealoforge/dashboard?page=resume-builder"
                      className="text-xs text-green-400 hover:text-green-300"
                    >
                      Create a Resume
                    </Link>
                  </div>
                ) : (
                  <select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/40 [&>option]:bg-[#0f1a0f]"
                  >
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title} {r.isDefault ? "(Default)" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Cover Letter */}
              <div className="mb-5">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 block">
                  Cover Letter (optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why you're a great fit..."
                  rows={5}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500/40 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  disabled={applying || !selectedResume}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium py-2.5 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/15 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2.5 text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-green-500" />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
