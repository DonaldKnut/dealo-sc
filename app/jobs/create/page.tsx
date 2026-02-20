"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSafeSession } from "@/hooks/use-safe-session";
import dynamicImport from "next/dynamic";

const ReactQuill = dynamicImport(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface CompanyFromAPI {
  _id: string;
  name: string;
  industry: string;
}

export default function CreateJobPage() {
  const router = useRouter();
  const session = useSafeSession();
  const { data: sessionData } = session || {};
  const isAuthenticated = !!sessionData?.user;

  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [companies, setCompanies] = useState<CompanyFromAPI[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    country: "",
    city: "",
    remote: "onsite",
    type: "full-time",
    category: "",
    contactEmail: "",
    contactPhone: "",
    companyName: "",
    experienceRequired: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/companies")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCompanies(data.companies || []);
          }
        })
        .catch((err) => console.error("Error fetching companies:", err));
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData: any = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        remote: formData.remote === "remote",
      };

      if (isAuthenticated && selectedCompany) {
        submitData.organizationId = selectedCompany;
      }

      const response = await fetch("/api/jobs/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save job");
      }

      const result = await response.json();

      if (result.success) {
        if (!isAuthenticated && result.requiresVerification) {
          setEmailSent(true);
        } else {
          router.push(`/employment/dealojobs/${result.job._id}`);
        }
      } else {
        alert(result.message || "An error occurred");
      }
    } catch (error: any) {
      console.error("Error submitting job:", error);
      alert(error.message || "An error occurred while posting the job");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-md w-full border border-white/20"
        >
          <div className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
            <Mail className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Check Your Email!</h2>
          <p className="text-gray-300 text-lg mb-6">
            We've sent a verification email to your address. Please verify your email to publish your job listing.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Jobs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1a0f] to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Post a Job</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Your Job Listing
          </h1>
          <p className="text-gray-300 text-lg">
            {isAuthenticated
              ? "Fill in the details to create your job listing"
              : "Post your job for free. Email verification required."}
          </p>
        </motion.div>

        {/* Two Column Layout: Form and Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column - Takes 2/3 on large screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 md:p-12 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Selection (for authenticated users) */}
            {isAuthenticated && companies.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Select Company (Optional)
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                >
                  <option value="">Post without company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Company Name (for unauthenticated users) */}
            {!isAuthenticated && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Tech Solutions Inc."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                />
              </div>
            )}

            {/* Contact Email (for unauthenticated users) */}
            {!isAuthenticated && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Your Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                />
              </div>
            )}

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior UI/UX Designer"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Job Description *
              </label>
              {typeof window !== "undefined" && ReactQuill && (
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className="bg-white/10 rounded-lg"
                />
              )}
            </div>

            {/* Location and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Lagos, Nigeria"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Work Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>

            {/* Remote and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Location
                </label>
                <select
                  name="remote"
                  value={formData.remote}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                >
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required
                </label>
                <select
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                >
                  <option value="">Select experience level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Expert Level">Expert Level</option>
                </select>
              </div>
            </div>

            {/* Budget and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Salary/Budget (USD) *
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Phone *
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                placeholder="+234 800 000 0000"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500/50 text-white"
              >
                <option value="">Select category</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
                <option value="Finance">Finance</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Posting Job...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Post Job Listing
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
            </div>

            {/* Footer Link */}
            <div className="text-center mt-8">
              <Link
                href="/jobs"
                className="text-green-400 hover:text-green-300 font-medium inline-flex items-center gap-2"
              >
                ← Back to Job Listings
              </Link>
            </div>
          </motion.div>

          {/* Sticky Sidebar - Takes 1/3 on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-24">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                {/* Information Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-green-400" />
                      Tips for Success
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Be specific about job requirements and responsibilities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Include competitive salary ranges to attract top talent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Mention company culture and benefits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Use clear, engaging job titles</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Why Post Here?
                    </h3>
                    <div className="space-y-3 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span>Reach 50K+ active job seekers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-green-400" />
                        <span>Free job posting for verified employers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span>Get applications within 24 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Advert Space - Ready for future use */}
                  <div className="pt-6 border-t border-white/20">
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
                      <h4 className="text-base font-semibold text-white mb-2">Premium Features</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        Boost your job listing visibility and reach more qualified candidates.
                      </p>
                      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}




