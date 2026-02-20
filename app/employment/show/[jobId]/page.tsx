"use client";

// Force dynamic rendering for authentication
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/hooks/use-safe-session";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Globe,
  CheckCircle2,
  Heart,
  Share2,
  ArrowRight,
  Calendar,
  Star,
  ShoppingCart,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  Truck,
  CreditCard,
  Headphones,
  Sparkles,
  Users,
  TrendingUp,
  Award,
  Zap,
  Shield,
  Coffee,
  Home,
  Laptop,
  Target,
  BarChart3,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Job = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  postedBy: string;
  skillsRequired: string[];
  location: string;
  experienceRequired: number;
  isRemote: boolean;
  category: string;
  country: string;
  type: string;
  jobIcon: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  company?: {
    name: string;
    logo?: string;
  };
  companyName?: string;
};

export default function JobDetailsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState("Full-Time");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const router = useRouter();

  // Mock data for missing fields
  const mockRating = 4.8;
  const mockReviews = 245;
  const mockOriginalPrice = job?.budget ? Math.round(job.budget * 1.2) : 0;
  const mockApplicationCount = 12;
  const mockJobId = job?._id?.slice(-8).toUpperCase() || "JOB00000";
  
  // Enhanced mock data for rich UI
  const mockBenefits = [
    "Health Insurance",
    "Dental & Vision",
    "401(k) Matching",
    "Unlimited PTO",
    "Remote Work",
    "Learning Budget",
    "Stock Options",
    "Flexible Hours",
  ];
  
  const mockCompanySize = "50-200 employees";
  const mockFounded = "2015";
  const mockIndustry = job?.category || "Technology";
  const mockTeamSize = "10-15 people";
  const mockWorkCulture = [
    "Collaborative environment",
    "Fast-paced startup culture",
    "Innovation-focused",
    "Work-life balance",
  ];
  
  const mockApplicationTimeline = [
    { step: "Application Review", days: "1-2 days", icon: BookOpen },
    { step: "Initial Screening", days: "3-5 days", icon: Phone },
    { step: "Technical Interview", days: "5-7 days", icon: Laptop },
    { step: "Final Interview", days: "7-10 days", icon: Users },
    { step: "Offer", days: "10-14 days", icon: Award },
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/fetch-jobs-id/${params.jobId}`);
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch job details");

        setJob(data.job);
        setSelectedLocation(data.job?.isRemote ? "Remote" : data.job?.location || data.job?.country || "");
        setSelectedExperience(`${data.job?.experienceRequired || 0} Years`);

        // Fetch related jobs
        try {
          const relatedResponse = await fetch(`/api/dealo-jobs?limit=20`);
          const relatedData = await relatedResponse.json();
          if (relatedData.success && relatedData.jobs) {
            setRelatedJobs(
              relatedData.jobs
                .filter((j: Job) => j._id !== data.job._id)
                .slice(0, 4)
            );
          }
        } catch (err) {
          console.error("Failed to fetch related jobs:", err);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchDetails();
  }, [params.jobId]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white">
        <p className="text-red-500 font-medium text-xl">{error}</p>
        <button
          onClick={() => router.push("/employment")}
          className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  // Check if the logged-in user is the one who created the job
  const isCreator = sessionData?.user?.id === job.postedBy;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const jobTypes = ["Full-Time", "Part-Time", "Contract"];
  const experienceLevels = ["0 Years", "1-2 Years", "3-5 Years", "5+ Years"];
  const locationOptions = job.isRemote 
    ? ["Remote", job.location || job.country || "On-Site"]
    : [job.location || job.country || "On-Site", "Remote"];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-green-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Call Us: +123-456-789</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span>Sign up and GET 20% OFF for your first order. Sign up now</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/30"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Header />

      {/* Breadcrumb Section */}
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/employment" className="hover:text-green-600">
              Jobs
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Job Details</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Job Image/Icon */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center aspect-square">
              {job.jobIcon ? (
                <Image
                  src={job.jobIcon}
                  alt={job.title}
                  width={500}
                  height={500}
                  className="rounded-lg object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-32 h-32 text-green-600" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border-2 border-gray-200 hover:border-green-500 cursor-pointer transition-all p-3 aspect-square flex items-center justify-center"
                >
                  {job.jobIcon ? (
                    <Image
                      src={job.jobIcon}
                      alt={`${job.title} view ${i}`}
                      width={100}
                      height={100}
                      className="rounded-lg object-contain w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-green-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Job Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {job.category || "Job Opportunity"}
            </span>

            {/* Job Title */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {job.title}
              </h1>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isSaved ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* In Stock Badge */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-semibold">Accepting Applications</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i <= Math.floor(mockRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">{mockRating}</span>
              </div>
              <span className="text-gray-500">({mockReviews} Reviews)</span>
            </div>

            {/* Price/Salary */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-green-600">
                ${job.budget?.toLocaleString() || "Negotiable"}
              </span>
              {job.budget && (
                <span className="text-xl text-gray-400 line-through">
                  ${mockOriginalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {job.description.length > 200 
                ? `${job.description.substring(0, 200)}...` 
                : job.description}
            </p>

            {/* Job Type Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type
              </label>
              <div className="flex gap-3">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedJobType(type)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedJobType === type
                        ? "bg-yellow-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <div className="flex gap-3">
                {locationOptions.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedLocation === loc
                        ? "bg-yellow-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Level
              </label>
              <div className="flex gap-3 flex-wrap">
                {experienceLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedExperience(level)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedExperience === level
                        ? "bg-yellow-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Application Count */}
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">Applications: {mockApplicationCount}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {!isCreator ? (
                <>
                  <button
                    onClick={async () => {
                      if (!sessionData?.user) {
                        router.push(`/sign-in?redirect=/employment/show/${job._id}`);
                        return;
                      }
                      try {
                        const response = await fetch("/api/jobs/apply", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({ jobId: job._id }),
                        });
                        if (response.ok) {
                          router.push(`/employment/dealojobs/${job._id}`);
                        } else {
                          const data = await response.json();
                          alert(data.message || "Failed to apply");
                        }
                      } catch (error) {
                        console.error("Error applying:", error);
                        alert("Failed to apply. Please try again.");
                      }
                    }}
                    className="flex-1 bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Apply Now
                  </button>
                  <button
                    onClick={async () => {
                      if (!sessionData?.user) {
                        router.push(`/sign-in?redirect=/employment/show/${job._id}`);
                        return;
                      }
                      try {
                        const response = await fetch("/api/jobs/quick-apply", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({ jobId: job._id }),
                        });
                        const data = await response.json();
                        if (response.ok) {
                          alert("Quick application submitted successfully! The employer will review your profile.");
                          router.push(`/employment/dealojobs/${job._id}`);
                        } else {
                          alert(data.message || "Failed to quick apply");
                        }
                      } catch (error) {
                        console.error("Error quick applying:", error);
                        alert("Failed to quick apply. Please try again.");
                      }
                    }}
                    className="bg-yellow-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Quick Apply
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push(`/employment/jobs/edit/${job._id}`)}
                    className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg"
                  >
                    Edit Job Posting
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
                        return;
                      }
                      try {
                        const response = await fetch(`/api/jobs?id=${job._id}`, {
                          method: "DELETE",
                          credentials: "include",
                        });
                        const data = await response.json();
                        if (response.ok && data.success) {
                          alert("Job deleted successfully!");
                          router.push("/employment");
                        } else {
                          alert(data.message || "Failed to delete job");
                        }
                      } catch (error) {
                        console.error("Error deleting job:", error);
                        alert("Failed to delete job. Please try again.");
                      }
                    }}
                    className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg"
                  >
                    Delete Job
                  </button>
                </>
              )}
            </div>

            {/* Job ID (SKU) */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Job ID:</span> {mockJobId}
              </p>
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Tags:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {job.category}
                </span>
                {job.skillsRequired?.slice(0, 2).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Icons */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Share:</span>
              </p>
              <div className="flex gap-3">
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: "description", label: "Description" },
                { id: "additional", label: "Additional Information" },
                { id: "company", label: "Company Info" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-semibold text-lg transition-all relative ${
                    activeTab === tab.id
                      ? "text-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-green-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "description" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About the Role</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {job.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      Key Responsibilities
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Design and develop scalable software solutions",
                        "Collaborate with cross-functional teams",
                        "Write clean, maintainable code",
                        "Participate in code reviews",
                        "Contribute to technical documentation",
                      ].map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      What We're Looking For
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Strong problem-solving skills",
                        "Excellent communication abilities",
                        "Passion for continuous learning",
                        "Team player mindset",
                        "Attention to detail",
                      ].map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Benefits & Perks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockBenefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "additional" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {job.skillsRequired?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-medium border border-green-200 hover:border-green-300 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-green-600" />
                      Experience Required
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {job.experienceRequired || 0} {job.experienceRequired === 1 ? 'Year' : 'Years'}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">of relevant experience</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Team Size
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-gray-900">{mockTeamSize}</p>
                      <p className="text-gray-600 text-sm mt-1">in this department</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    Education & Qualifications
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Bachelor's degree in Computer Science or related field",
                      "Strong portfolio demonstrating relevant experience",
                      "Excellent written and verbal communication skills",
                      "Ability to work independently and in a team",
                      "Portfolio or work samples required",
                    ].map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Application Process Timeline
                  </h3>
                  <div className="space-y-4">
                    {mockApplicationTimeline.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.step}</p>
                            <p className="text-sm text-gray-600">{item.days}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "company" && (
              <div className="space-y-8">
                {job.company || job.companyName ? (
                  <>
                    <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                      {job.company?.logo && (
                        <div className="w-24 h-24 bg-white rounded-xl border border-gray-200 p-3 flex-shrink-0">
                          <Image
                            src={job.company.logo}
                            alt={(job.company?.name ?? job.companyName ?? "Company logo") as string}
                            width={96}
                            height={96}
                            className="rounded-lg w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {job.company?.name || job.companyName || "Company"}
                        </h3>
                        <p className="text-gray-600 mb-4">Leading {mockIndustry} Company</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{mockCompanySize}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Founded {mockFounded}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{job.location || job.country || "Global"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">About Us</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        We are a leading company in the {job.category || mockIndustry} industry,
                        committed to innovation and excellence. Our team is passionate about creating
                        impactful solutions and fostering a collaborative work environment. We value
                        diversity, creativity, and continuous learning. Join our team and be part of
                        something great!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Coffee className="w-5 h-5 text-green-600" />
                          Work Culture
                        </h3>
                        <ul className="space-y-2">
                          {mockWorkCulture.map((culture, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700">{culture}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          Company Growth
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Team Size</span>
                            <span className="font-semibold text-gray-900">{mockCompanySize}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Founded</span>
                            <span className="font-semibold text-gray-900">{mockFounded}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Industry</span>
                            <span className="font-semibold text-gray-900">{mockIndustry}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Funding</span>
                            <span className="font-semibold text-gray-900">Series B</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Why Join Us?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Competitive compensation packages",
                          "Cutting-edge technology stack",
                          "Professional growth opportunities",
                          "Inclusive and diverse team",
                          "Work-life balance",
                          "Impactful projects",
                        ].map((reason, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Company information not available.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Explore Related Jobs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedJobs.map((relatedJob) => (
                <Link
                  key={relatedJob._id}
                  href={`/employment/show/${relatedJob._id}`}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="relative">
                    {relatedJob.jobIcon ? (
                      <Image
                        src={relatedJob.jobIcon}
                        alt={relatedJob.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <Briefcase className="w-16 h-16 text-green-600" />
                      </div>
                    )}
                    {relatedJob.isFeatured && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        20% off
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-all">
                      <Heart className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-500 mb-2">
                      {relatedJob.category}
                    </p>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                      {relatedJob.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600">4.9</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        ${relatedJob.budget?.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${relatedJob.budget ? Math.round(relatedJob.budget * 1.2).toLocaleString() : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Service Highlights */}
      <div className="bg-gray-50 border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Free Application</h3>
                <p className="text-gray-600 text-sm">No application fees</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Flexible Payment</h3>
                <p className="text-gray-600 text-sm">Multiple payment options</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Headphones className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">24/7 Support</h3>
                <p className="text-gray-600 text-sm">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
