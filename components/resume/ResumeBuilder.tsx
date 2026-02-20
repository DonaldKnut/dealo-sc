"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Download,
  Share,
  Trash2,
  Eye,
  Check,
  Save,
  Wand2,
  X,
  ArrowLeft,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  FileText,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import ProfessionalTwoColumnTemplate from "./templates/ProfessionalTwoColumnTemplate";
import ModernMinimalTemplate from "./templates/ModernMinimalTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import ResumeEditor from "./ResumeEditor";

interface Resume {
  _id?: string;
  title: string;
  template: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
    avatar?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: number;
    relevantCourses?: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: Array<{
      language: string;
      proficiency: "Basic" | "Intermediate" | "Advanced" | "Native";
    }>;
  };
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    startDate?: string;
    endDate?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  isPublic: boolean;
  isDefault: boolean;
}

const templates = [
  {
    id: "professional-two-column",
    name: "Professional Two-Column",
    description: "Modern two-column layout with dark sidebar",
    preview: "professional-two-column",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean, single-column, ATS-friendly",
    preview: "modern-minimal",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional two-column layout",
    preview: "classic",
  },
];

const ResumeBuilder = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<"list" | "template-select" | "edit">("list");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const resumeId = searchParams?.get("id");
    if (resumeId) {
      loadResume(resumeId);
    } else {
      fetchResumes();
    }
  }, [searchParams]);

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

  const loadResume = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resume/save?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data.resume);
        setSelectedTemplate(data.resume.template);
        setMode("edit");
      }
    } catch (error) {
      console.error("Error loading resume:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setMode("template-select");
    setCurrentResume(null);
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);

    // If no resume loaded, create a new one with AI prepopulation
    if (!currentResume) {
      setAiLoading(true);
      try {
        const response = await fetch("/api/resume/ai-prepopulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentResume({
            ...data.resume,
            template: templateId,
          });
        } else {
          // Fallback to empty resume
          setCurrentResume(createEmptyResume(templateId));
        }
      } catch (error) {
        console.error("AI prepopulation error:", error);
        setCurrentResume(createEmptyResume(templateId));
      } finally {
        setAiLoading(false);
      }
    } else {
      setCurrentResume({ ...currentResume, template: templateId });
    }

    setMode("edit");
  };

  const createEmptyResume = (templateId: string): Resume => ({
    title: "My Resume",
    template: templateId,
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
    },
    projects: [],
    certifications: [],
    isPublic: false,
    isDefault: false,
  });

  const handleSave = async () => {
    if (!currentResume) return;

    try {
      const response = await fetch("/api/resume/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentResume),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data.resume);
        alert("Resume saved successfully!");
        fetchResumes();
      } else {
        alert("Failed to save resume");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const response = await fetch(`/api/resume/save?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setResumes(resumes.filter((resume) => resume._id !== id));
        if (currentResume?._id === id) {
          setMode("list");
          setCurrentResume(null);
        }
        alert("Resume deleted successfully");
      } else {
        alert("Failed to delete resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume");
    }
  };

  const handleExport = async (id: string) => {
    try {
      const response = await fetch("/api/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: id, format: "pdf" }),
      });

      if (response.ok) {
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

  if (loading && mode === "list") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (mode === "template-select") {
    return (
      <div className="space-y-12 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <button
              onClick={() => setMode("list")}
              className="group flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:border-white/20 transition-all"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Return to Catalog
            </button>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              SELECT YOUR <br />
              <span className="text-emerald-500">ARCHITECTURE</span>
            </h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] max-w-xl">
              Choose a structural framework to manifest your professional trajectory.
              Each architecture is engineered for maximum strategic impact.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">AI PRE-POPULATION ACTIVE</p>
              <p className="text-[10px] font-bold text-white/60 tracking-tight">Your data will be automatically synthesized into the selected template.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              {/* Card Container */}
              <div
                className="bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all duration-700 shadow-2xl flex flex-col h-full"
                onClick={() => handleTemplateSelect(template.id)}
              >
                {/* Preview Frame */}
                <div className="aspect-[4/5] relative bg-black/40 p-10 group-hover:p-8 transition-all duration-700">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />

                  <div className="relative h-full w-full bg-white rounded-xl shadow-2xl overflow-hidden shadow-emerald-500/5 group-hover:shadow-emerald-500/20 transition-all duration-700 transform group-hover:rotate-1 group-hover:scale-[1.02]">
                    {template.id === "professional-two-column" ? (
                      <div className="h-full flex flex-col md:flex-row">
                        <div className="w-1/3 bg-gray-700 p-4">
                          <div className="w-12 h-12 bg-gray-600 rounded-full mb-4 border-2 border-white/20"></div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-600 rounded w-full"></div>
                            <div className="h-1 bg-gray-600 rounded w-2/3"></div>
                            <div className="h-1 bg-gray-600 rounded w-1/2 mt-4"></div>
                            <div className="h-1 bg-gray-600 rounded w-full"></div>
                          </div>
                        </div>
                        <div className="w-2/3 p-4 space-y-4">
                          <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-50 rounded w-full"></div>
                            <div className="h-2 bg-gray-50 rounded w-full"></div>
                            <div className="h-2 bg-gray-50 rounded w-2/3"></div>
                          </div>
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-50 rounded w-full"></div>
                            <div className="h-2 bg-gray-50 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ) : template.id === "modern-minimal" ? (
                      <div className="h-full p-6 space-y-6">
                        <div className="text-center space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                          <div className="h-2 bg-gray-100 rounded w-1/3 mx-auto"></div>
                        </div>
                        <div className="h-px bg-emerald-500/20 w-1/3 mx-auto"></div>
                        <div className="space-y-4">
                          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-50 rounded w-full"></div>
                            <div className="h-2 bg-gray-50 rounded w-full"></div>
                            <div className="h-2 bg-gray-50 rounded w-2/3"></div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-50 rounded w-full"></div>
                            <div className="h-2 bg-gray-50 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full p-8 space-y-6">
                        <div className="space-y-4 border-b-2 border-gray-100 pb-4">
                          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                        </div>
                        <div className="flex gap-6">
                          <div className="w-1/3 space-y-4">
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                          </div>
                          <div className="w-2/3 space-y-4">
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            <div className="h-2 bg-gray-50 rounded w-full"></div>
                            <div className="h-2 bg-gray-50 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">{template.name}</h3>
                    </div>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <button className="w-full py-4 rounded-xl bg-white/[0.03] border border-white/[0.1] text-[10px] font-black text-white uppercase tracking-[0.3em] group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all duration-500">
                    Deploy Architecture
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "edit" && currentResume) {
    return (
      <ResumeEditor
        resume={currentResume}
        onResumeChange={setCurrentResume}
        onSave={handleSave}
        onBack={() => {
          setMode("list");
          setCurrentResume(null);
        }}
        onExport={() => currentResume._id && handleExport(currentResume._id)}
      />
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Resume Builder</h2>
          <p className="text-gray-400">
            Create and manage your professional resumes with AI assistance
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-colors text-white font-semibold shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
          <p className="text-gray-400 mb-8">
            Create your first professional resume with AI assistance
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-colors text-white font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            Create Resume with AI
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-emerald-500/50 transition-all group"
            >
              <div className="aspect-[3/4] bg-white p-4">
                {resume.template === "professional-two-column" ? (
                  <ProfessionalTwoColumnTemplate resume={resume} preview={true} />
                ) : resume.template === "modern-minimal" ? (
                  <ModernMinimalTemplate resume={resume} preview={true} />
                ) : resume.template === "classic" ? (
                  <ClassicTemplate resume={resume} preview={true} />
                ) : (
                  <div className="h-full bg-white p-3 rounded border border-gray-200">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {resume.title}
                      </h4>
                      <p className="text-xs text-gray-500 capitalize">
                        {resume.template.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{resume.title}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date((resume as any).updatedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentResume(resume as Resume);
                      setMode("edit");
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => resume._id && handleExport(resume._id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title="Export PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resume._id && handleDelete(resume._id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;

