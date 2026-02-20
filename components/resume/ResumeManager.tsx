"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Download,
  Share,
  Trash2,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

interface Resume {
  _id: string;
  title: string;
  template: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const ResumeManager = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resume/save");
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const response = await fetch(`/api/resume/save?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setResumes(resumes.filter((resume) => resume._id !== id));
        alert("Resume deleted successfully");
      } else {
        alert("Failed to delete resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume");
    }
  };

  const copyResumeLink = async (id: string) => {
    try {
      const link = `${window.location.origin}/resume/${id}`;
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  const exportResume = async (id: string) => {
    try {
      const response = await fetch("/api/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: id, format: "pdf" }),
      });

      if (response.ok) {
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resume_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to export resume");
      }
    } catch (error) {
      console.error("Error exporting resume:", error);
      alert("Failed to export resume");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
          <p className="text-gray-600">
            Manage and organize your professional resumes
          </p>
        </div>
        <Link
          href="/dealoforge/dashboard?page=resume-builder"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Resume
        </Link>
      </div>

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No resumes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first professional resume to get started
          </p>
          <Link
            href="/dealoforge/dashboard?page=resume-builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Resume
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Resume Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="h-full bg-white rounded-lg border border-gray-200 p-3">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {resume.title}
                    </h4>
                    <p className="text-xs text-gray-500 capitalize">
                      {resume.template.replace("-", " ")}
                    </p>
                    {resume.isDefault && (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {resume.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dealoforge/dashboard?page=resume-builder&id=${resume._id}`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Link>
                  <button
                    onClick={() => exportResume(resume._id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Export PDF"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => copyResumeLink(resume._id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    {copiedId === resume._id ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Share className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete resume"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Features */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            AI-Powered Resume Building
          </h3>
          <p className="text-gray-600">
            Leverage artificial intelligence to create compelling resumes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Edit className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Smart Content Generation
            </h4>
            <p className="text-sm text-gray-600">
              AI generates professional summaries, skills, and achievements
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">
              ATS Optimization
            </h4>
            <p className="text-sm text-gray-600">
              Ensure your resume passes through Applicant Tracking Systems
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Professional Export
            </h4>
            <p className="text-sm text-gray-600">
              Download your resume in PDF format for job applications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;
