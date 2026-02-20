"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Download,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Wand2,
  X,
  Upload,
  Menu,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  FileText,
} from "lucide-react";
import ProfessionalTwoColumnTemplate from "./templates/ProfessionalTwoColumnTemplate";

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

interface ResumeEditorProps {
  resume: Resume;
  onResumeChange: (resume: Resume) => void;
  onSave: () => void;
  onBack: () => void;
  onExport: () => void;
}

type EditSection = 
  | "personalInfo" 
  | "summary" 
  | "experience" 
  | "education" 
  | "skills" 
  | "languages"
  | null;

const ResumeEditor = ({
  resume,
  onResumeChange,
  onSave,
  onBack,
  onExport,
}: ResumeEditorProps) => {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("preview");
  const [activeModal, setActiveModal] = useState<EditSection>(null);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setViewMode("preview");
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updateResume = (updates: Partial<Resume>) => {
    onResumeChange({ ...resume, ...updates });
  };

  const updatePersonalInfo = (updates: Partial<Resume["personalInfo"]>) => {
    updateResume({
      personalInfo: { ...resume.personalInfo, ...updates },
    });
  };

  const addExperience = () => {
    setEditingExperienceIndex(resume.experience.length);
    updateResume({
      experience: [
        ...resume.experience,
        {
          title: "",
          company: "",
          startDate: new Date().toISOString().split("T")[0],
          current: false,
          description: "",
          achievements: [],
        },
      ],
    });
    setActiveModal("experience");
  };

  const updateExperience = (index: number, updates: Partial<Resume["experience"][0]>) => {
    const newExperience = [...resume.experience];
    newExperience[index] = { ...newExperience[index], ...updates };
    updateResume({ experience: newExperience });
  };

  const deleteExperience = (index: number) => {
    updateResume({
      experience: resume.experience.filter((_, i) => i !== index),
    });
    setActiveModal(null);
  };

  const addEducation = () => {
    setEditingEducationIndex(resume.education.length);
    updateResume({
      education: [
        ...resume.education,
        {
          degree: "",
          institution: "",
          startDate: new Date().toISOString().split("T")[0],
          current: false,
        },
      ],
    });
    setActiveModal("education");
  };

  const updateEducation = (index: number, updates: Partial<Resume["education"][0]>) => {
    const newEducation = [...resume.education];
    newEducation[index] = { ...newEducation[index], ...updates };
    updateResume({ education: newEducation });
  };

  const deleteEducation = (index: number) => {
    updateResume({
      education: resume.education.filter((_, i) => i !== index),
    });
    setActiveModal(null);
  };

  const addLanguage = () => {
    updateResume({
      skills: {
        ...resume.skills,
        languages: [
          ...resume.skills.languages,
          { language: "", proficiency: "Intermediate" },
        ],
      },
    });
  };

  const updateLanguage = (index: number, updates: Partial<Resume["skills"]["languages"][0]>) => {
    const newLanguages = [...resume.skills.languages];
    newLanguages[index] = { ...newLanguages[index], ...updates };
    updateResume({
      skills: { ...resume.skills, languages: newLanguages },
    });
  };

  const deleteLanguage = (index: number) => {
    updateResume({
      skills: {
        ...resume.skills,
        languages: resume.skills.languages.filter((_, i) => i !== index),
      },
    });
  };

  const addSkill = (type: "technical" | "soft") => {
    updateResume({
      skills: {
        ...resume.skills,
        [type]: [...resume.skills[type], ""],
      },
    });
  };

  const updateSkill = (type: "technical" | "soft", index: number, value: string) => {
    const newSkills = [...resume.skills[type]];
    newSkills[index] = value;
    updateResume({
      skills: { ...resume.skills, [type]: newSkills },
    });
  };

  const deleteSkill = (type: "technical" | "soft", index: number) => {
    updateResume({
      skills: {
        ...resume.skills,
        [type]: resume.skills[type].filter((_, i) => i !== index),
      },
    });
  };

  const handleAIPopulate = async () => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/resume/ai-prepopulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentResume: resume,
          enhance: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onResumeChange(data.resume);
      }
    } catch (error) {
      console.error("AI prepopulation error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const EditModal = ({ section, onClose }: { section: EditSection; onClose: () => void }) => {
    // Use local state to prevent re-renders from clearing inputs
    const [localResume, setLocalResume] = useState(resume);

    // Sync local state with prop changes
    useEffect(() => {
      setLocalResume(resume);
    }, []);
    
    if (!section) return null;

    const handleUpdateResume = (updates: Partial<Resume>) => {
      const updated = { ...localResume, ...updates };
      setLocalResume(updated);
      onResumeChange(updated);
    };

    const handleUpdatePersonalInfo = (updates: Partial<Resume["personalInfo"]>) => {
      handleUpdateResume({
        personalInfo: { ...localResume.personalInfo, ...updates },
      });
    };

    const handleUpdateExperience = (index: number, updates: Partial<Resume["experience"][0]>) => {
      const newExperience = [...localResume.experience];
      newExperience[index] = { ...newExperience[index], ...updates };
      handleUpdateResume({ experience: newExperience });
    };

    const handleDeleteExperience = (index: number) => {
      handleUpdateResume({
        experience: localResume.experience.filter((_, i) => i !== index),
      });
    };

    const handleAddExperience = () => {
      handleUpdateResume({
        experience: [
          ...localResume.experience,
          {
            title: "",
            company: "",
            startDate: new Date().toISOString().split("T")[0],
            current: false,
            description: "",
            achievements: [],
          },
        ],
      });
    };

    const handleUpdateEducation = (index: number, updates: Partial<Resume["education"][0]>) => {
      const newEducation = [...localResume.education];
      newEducation[index] = { ...newEducation[index], ...updates };
      handleUpdateResume({ education: newEducation });
    };

    const handleDeleteEducation = (index: number) => {
      handleUpdateResume({
        education: localResume.education.filter((_, i) => i !== index),
      });
    };

    const handleAddEducation = () => {
      handleUpdateResume({
        education: [
          ...localResume.education,
          {
            degree: "",
            institution: "",
            startDate: new Date().toISOString().split("T")[0],
            current: false,
          },
        ],
      });
    };

    const handleUpdateSkill = (type: "technical" | "soft", index: number, value: string) => {
      const newSkills = [...localResume.skills[type]];
      newSkills[index] = value;
      handleUpdateResume({
        skills: { ...localResume.skills, [type]: newSkills },
      });
    };

    const handleDeleteSkill = (type: "technical" | "soft", index: number) => {
      handleUpdateResume({
        skills: {
          ...localResume.skills,
          [type]: localResume.skills[type].filter((_, i) => i !== index),
        },
      });
    };

    const handleAddSkill = (type: "technical" | "soft") => {
      handleUpdateResume({
        skills: {
          ...localResume.skills,
          [type]: [...localResume.skills[type], ""],
        },
      });
    };

    const handleUpdateLanguage = (index: number, updates: Partial<Resume["skills"]["languages"][0]>) => {
      const newLanguages = [...localResume.skills.languages];
      newLanguages[index] = { ...newLanguages[index], ...updates };
      handleUpdateResume({
        skills: { ...localResume.skills, languages: newLanguages },
      });
    };

    const handleDeleteLanguage = (index: number) => {
      handleUpdateResume({
        skills: {
          ...localResume.skills,
          languages: localResume.skills.languages.filter((_, i) => i !== index),
        },
      });
    };

    const handleAddLanguage = () => {
      handleUpdateResume({
        skills: {
          ...localResume.skills,
          languages: [
            ...localResume.skills.languages,
            { language: "", proficiency: "Intermediate" },
          ],
        },
      });
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
            <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-2xl border border-green-900/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-b border-green-900/30 p-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-white">
                {section === "personalInfo" && "Personal Information"}
                {section === "summary" && "Profile Summary"}
                {section === "experience" && "Experience"}
                {section === "education" && "Education"}
                {section === "skills" && "Technical Skills"}
                {section === "languages" && "Languages"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-gradient-to-br from-green-900 via-green-800 to-green-900">
              {section === "personalInfo" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/90 mb-2 font-medium">First Name</label>
                      <input
                        type="text"
                        value={localResume.personalInfo.firstName}
                        onChange={(e) => handleUpdatePersonalInfo({ firstName: e.target.value })}
                        className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/90 mb-2 font-medium">Last Name</label>
                      <input
                        type="text"
                        value={localResume.personalInfo.lastName}
                        onChange={(e) => handleUpdatePersonalInfo({ lastName: e.target.value })}
                        className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/90 mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={localResume.personalInfo.email}
                      onChange={(e) => handleUpdatePersonalInfo({ email: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/90 mb-2 font-medium">Phone</label>
                    <input
                      type="tel"
                      value={localResume.personalInfo.phone}
                      onChange={(e) => handleUpdatePersonalInfo({ phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/90 mb-2 font-medium">Location</label>
                    <input
                      type="text"
                      value={localResume.personalInfo.location}
                      onChange={(e) => handleUpdatePersonalInfo({ location: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    />
                  </div>
                  {/* Social Links Section */}
                  <div>
                    <label className="block text-sm text-white/90 mb-3 font-medium">Social Links</label>
                    
                    {/* Available Platforms */}
                    <div className="mb-4">
                      <p className="text-xs text-white/80 mb-2">Add social platforms:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "linkedin", name: "LinkedIn", icon: "💼" },
                          { id: "github", name: "GitHub", icon: "💻" },
                          { id: "behance", name: "Behance", icon: "🎨" },
                          { id: "dribbble", name: "Dribbble", icon: "🏀" },
                          { id: "twitter", name: "Twitter", icon: "🐦" },
                          { id: "instagram", name: "Instagram", icon: "📷" },
                          { id: "portfolio", name: "Portfolio", icon: "🌐" },
                          { id: "medium", name: "Medium", icon: "✍️" },
                          { id: "youtube", name: "YouTube", icon: "📺" },
                          { id: "custom", name: "Custom", icon: "🔗" },
                        ].map((platform) => {
                        const existingLink = localResume.personalInfo.socialLinks?.find(
                          (link) => link.platform === platform.id
                        );
                        const isAdded = !!existingLink;
                        
                        return (
                          <button
                            key={platform.id}
                            type="button"
                            onClick={() => {
                              const currentLinks = localResume.personalInfo.socialLinks || [];
                              if (isAdded) {
                                // Remove if already added
                                handleUpdatePersonalInfo({
                                  socialLinks: currentLinks.filter(
                                    (link) => link.platform !== platform.id
                                  ),
                                });
                              } else {
                                // Add new platform
                                handleUpdatePersonalInfo({
                                  socialLinks: [
                                    ...currentLinks,
                                    { platform: platform.id, url: "" },
                                  ],
                                });
                              }
                            }}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                                isAdded
                                  ? "bg-white/30 text-white backdrop-blur-sm border border-white/40"
                                  : "bg-white/20 text-white/90 hover:bg-white/30 backdrop-blur-sm border border-white/20"
                              }`}
                            >
                              <span>{platform.icon}</span>
                              <span>{platform.name}</span>
                              {isAdded && <span className="text-xs">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Input Fields for Selected Platforms */}
                    {localResume.personalInfo.socialLinks && localResume.personalInfo.socialLinks.length > 0 && (
                      <div className="space-y-3">
                        {localResume.personalInfo.socialLinks.map((link, index) => {
                          const platformInfo = [
                            { id: "linkedin", name: "LinkedIn" },
                            { id: "github", name: "GitHub" },
                            { id: "behance", name: "Behance" },
                            { id: "dribbble", name: "Dribbble" },
                            { id: "twitter", name: "Twitter" },
                            { id: "instagram", name: "Instagram" },
                            { id: "portfolio", name: "Portfolio" },
                            { id: "medium", name: "Medium" },
                            { id: "youtube", name: "YouTube" },
                            { id: "custom", name: "Custom" },
                          ].find((p) => p.id === link.platform);

                          return (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-24">
                                <span className="text-sm text-white/90 font-medium">
                                  {platformInfo?.name || link.platform}
                                </span>
                              </div>
                              <input
                                type="url"
                                value={link.url}
                                onChange={(e) => {
                                  const updatedLinks = [...(localResume.personalInfo.socialLinks || [])];
                                  updatedLinks[index] = { ...updatedLinks[index], url: e.target.value };
                                  handleUpdatePersonalInfo({ socialLinks: updatedLinks });
                                }}
                                placeholder={`https://${link.platform === "custom" ? "your-link.com" : link.platform + ".com/username"}`}
                                className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedLinks = localResume.personalInfo.socialLinks?.filter(
                                    (_, i) => i !== index
                                  );
                                  handleUpdatePersonalInfo({ socialLinks: updatedLinks });
                                }}
                                className="p-2 hover:bg-red-600/20 rounded text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

              {section === "summary" && (
                <div>
                  <label className="block text-sm text-white/90 mb-2 font-medium">Profile Summary</label>
                  <textarea
                    value={localResume.summary}
                    onChange={(e) => handleUpdateResume({ summary: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none"
                    placeholder="Write a brief professional summary..."
                  />
                </div>
              )}

              {section === "experience" && (
                <div className="space-y-4">
                  {localResume.experience.map((exp, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-medium">Experience {index + 1}</h4>
                        <button
                          onClick={() => handleDeleteExperience(index)}
                          className="p-1 hover:bg-red-600/20 rounded text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => handleUpdateExperience(index, { title: e.target.value })}
                          placeholder="Job Title"
                          className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(index, { company: e.target.value })}
                          placeholder="Company Name"
                          className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(index, { startDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                          />
                          <input
                            type="date"
                            value={exp.endDate || ""}
                            onChange={(e) => handleUpdateExperience(index, { endDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                            disabled={exp.current}
                          />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-white/90">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => handleUpdateExperience(index, { current: e.target.checked })}
                            className="w-4 h-4 accent-emerald-500"
                          />
                          Currently working here
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleUpdateExperience(index, { description: e.target.value })}
                          placeholder="Job description..."
                          rows={3}
                          className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddExperience}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                </div>
              )}

              {section === "education" && (
                <div className="space-y-4">
                  {localResume.education.map((edu, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-medium">Education {index + 1}</h4>
                        <button
                          onClick={() => handleDeleteEducation(index)}
                          className="p-1 hover:bg-red-600/20 rounded text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(index, { institution: e.target.value })}
                          placeholder="Institution Name"
                          className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                        />
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(index, { degree: e.target.value })}
                          placeholder="Degree"
                          className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => handleUpdateEducation(index, { startDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                          />
                          <input
                            type="date"
                            value={edu.endDate || ""}
                            onChange={(e) => handleUpdateEducation(index, { endDate: e.target.value })}
                            className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                            disabled={edu.current}
                          />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-white/90">
                          <input
                            type="checkbox"
                            checked={edu.current}
                            onChange={(e) => handleUpdateEducation(index, { current: e.target.checked })}
                            className="w-4 h-4 accent-emerald-500"
                          />
                          Currently studying
                        </label>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddEducation}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </div>
              )}

              {section === "skills" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/90 mb-2 font-medium">Technical Skills</label>
                    <div className="space-y-2">
                      {localResume.skills.technical.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleUpdateSkill("technical", index, e.target.value)}
                            placeholder="Skill name"
                            className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                          />
                          <button
                            onClick={() => handleDeleteSkill("technical", index)}
                            className="p-2 hover:bg-red-600/20 rounded text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAddSkill("technical")}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                </div>
              )}

              {section === "languages" && (
                <div className="space-y-3">
                  {localResume.skills.languages.map((lang, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={lang.language}
                          onChange={(e) => handleUpdateLanguage(index, { language: e.target.value })}
                          placeholder="Language"
                          className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                        />
                        <select
                          value={lang.proficiency}
                          onChange={(e) =>
                            handleUpdateLanguage(index, {
                              proficiency: e.target.value as "Basic" | "Intermediate" | "Advanced" | "Native",
                            })
                          }
                          className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm focus:ring-2 focus:ring-white/50 focus:border-white/50"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Native">Native</option>
                        </select>
                        <button
                          onClick={() => handleDeleteLanguage(index)}
                          className="p-2 hover:bg-red-600/20 rounded text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAddLanguage}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Language
                  </button>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-t border-green-900/30 p-4 flex items-center justify-end gap-2 z-10">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white text-sm transition-colors font-semibold"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] bg-gradient-to-br from-black via-[#0f1a0f] to-black">
      {/* Desktop: Left Sidebar - Editor */}
      {!isMobile && (
        <div
          className={`${
            viewMode === "edit" ? "w-1/2 lg:w-1/3" : "w-0"
          } transition-all duration-300 overflow-y-auto border-r border-gray-700 bg-gray-900/50 hidden lg:block`}
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAIPopulate}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-colors text-white text-sm disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4" />
                  {aiLoading ? "Enhancing..." : "AI Enhance"}
                </button>
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors text-white text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-400" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={resume.personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={resume.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={resume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {/* Social Links Section - Desktop */}
                <div>
                  <label className="block text-sm text-gray-300 mb-3">Social Links</label>
                  
                  {/* Available Platforms */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Add social platforms:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "linkedin", name: "LinkedIn", icon: "💼" },
                        { id: "github", name: "GitHub", icon: "💻" },
                        { id: "behance", name: "Behance", icon: "🎨" },
                        { id: "dribbble", name: "Dribbble", icon: "🏀" },
                        { id: "twitter", name: "Twitter", icon: "🐦" },
                        { id: "instagram", name: "Instagram", icon: "📷" },
                        { id: "portfolio", name: "Portfolio", icon: "🌐" },
                        { id: "medium", name: "Medium", icon: "✍️" },
                        { id: "youtube", name: "YouTube", icon: "📺" },
                        { id: "custom", name: "Custom", icon: "🔗" },
                      ].map((platform) => {
                        const existingLink = resume.personalInfo.socialLinks?.find(
                          (link) => link.platform === platform.id
                        );
                        const isAdded = !!existingLink;
                        
                        return (
                          <button
                            key={platform.id}
                            type="button"
                            onClick={() => {
                              const currentLinks = resume.personalInfo.socialLinks || [];
                              if (isAdded) {
                                updatePersonalInfo({
                                  socialLinks: currentLinks.filter(
                                    (link) => link.platform !== platform.id
                                  ),
                                });
                              } else {
                                updatePersonalInfo({
                                  socialLinks: [
                                    ...currentLinks,
                                    { platform: platform.id, url: "" },
                                  ],
                                });
                              }
                            }}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                              isAdded
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                          >
                            <span>{platform.icon}</span>
                            <span>{platform.name}</span>
                            {isAdded && <span className="text-xs">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Fields for Selected Platforms */}
                  {resume.personalInfo.socialLinks && resume.personalInfo.socialLinks.length > 0 && (
                    <div className="space-y-3">
                      {resume.personalInfo.socialLinks.map((link, index) => {
                        const platformInfo = [
                          { id: "linkedin", name: "LinkedIn" },
                          { id: "github", name: "GitHub" },
                          { id: "behance", name: "Behance" },
                          { id: "dribbble", name: "Dribbble" },
                          { id: "twitter", name: "Twitter" },
                          { id: "instagram", name: "Instagram" },
                          { id: "portfolio", name: "Portfolio" },
                          { id: "medium", name: "Medium" },
                          { id: "youtube", name: "YouTube" },
                          { id: "custom", name: "Custom" },
                        ].find((p) => p.id === link.platform);

                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-24">
                              <span className="text-sm text-gray-400">
                                {platformInfo?.name || link.platform}
                              </span>
                            </div>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => {
                                const updatedLinks = [...(resume.personalInfo.socialLinks || [])];
                                updatedLinks[index] = { ...updatedLinks[index], url: e.target.value };
                                updatePersonalInfo({ socialLinks: updatedLinks });
                              }}
                              placeholder={`https://${link.platform === "custom" ? "your-link.com" : link.platform + ".com/username"}`}
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedLinks = resume.personalInfo.socialLinks?.filter(
                                  (_, i) => i !== index
                                );
                                updatePersonalInfo({ socialLinks: updatedLinks });
                              }}
                              className="p-2 hover:bg-red-600/20 rounded text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Profile Summary</h3>
              <textarea
                value={resume.summary}
                onChange={(e) => updateResume({ summary: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Write a brief professional summary..."
              />
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Experience</h3>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {resume.experience.map((exp, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-white font-medium">Experience {index + 1}</h4>
                      <button
                        onClick={() => deleteExperience(index)}
                        className="p-1 hover:bg-red-600/20 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, { title: e.target.value })}
                        placeholder="Job Title"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, { company: e.target.value })}
                        placeholder="Company Name"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, { startDate: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="date"
                          value={exp.endDate || ""}
                          onChange={(e) => updateExperience(index, { endDate: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                          disabled={exp.current}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(index, { current: e.target.checked })}
                          className="w-4 h-4 accent-emerald-500"
                        />
                        Currently working here
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, { description: e.target.value })}
                        placeholder="Job description..."
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Education</h3>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {resume.education.map((edu, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-white font-medium">Education {index + 1}</h4>
                      <button
                        onClick={() => deleteEducation(index)}
                        className="p-1 hover:bg-red-600/20 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, { institution: e.target.value })}
                        placeholder="Institution Name"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, { degree: e.target.value })}
                        placeholder="Degree"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, { startDate: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="date"
                          value={edu.endDate || ""}
                          onChange={(e) => updateEducation(index, { endDate: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                          disabled={edu.current}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducation(index, { current: e.target.checked })}
                          className="w-4 h-4 accent-emerald-500"
                        />
                        Currently studying
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Technical Skills</h3>
                <button
                  onClick={() => addSkill("technical")}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {resume.skills.technical.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill("technical", index, e.target.value)}
                      placeholder="Skill name"
                      className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50"
                    />
                    <button
                      onClick={() => deleteSkill("technical", index)}
                      className="p-2 hover:bg-red-600/20 rounded text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Languages</h3>
                <button
                  onClick={addLanguage}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {resume.skills.languages.map((lang, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={lang.language}
                        onChange={(e) => updateLanguage(index, { language: e.target.value })}
                        placeholder="Language"
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                      <select
                        value={lang.proficiency}
                        onChange={(e) =>
                          updateLanguage(index, {
                            proficiency: e.target.value as "Basic" | "Intermediate" | "Advanced" | "Native",
                          })
                        }
                        className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Native">Native</option>
                      </select>
                      <button
                        onClick={() => deleteLanguage(index)}
                        className="p-2 hover:bg-red-600/20 rounded text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Mobile: Floating Action Button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <button
            onClick={() => setActiveModal("personalInfo")}
            className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-lg flex items-center justify-center text-white"
            title="Edit Resume"
          >
            <Edit2 className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile: Quick Edit Menu */}
      {isMobile && (
        <div className="fixed top-20 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-4 lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAIPopulate}
                disabled={aiLoading}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
              >
                <Wand2 className="w-4 h-4" />
              </button>
              <button
                onClick={onSave}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveModal("personalInfo")}
              className="flex flex-col items-center gap-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-white">Personal</span>
            </button>
            <button
              onClick={() => setActiveModal("summary")}
              className="flex flex-col items-center gap-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-white">Summary</span>
            </button>
            <button
              onClick={() => setActiveModal("experience")}
              className="flex flex-col items-center gap-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-white">Experience</span>
            </button>
            <button
              onClick={() => setActiveModal("education")}
              className="flex flex-col items-center gap-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-white">Education</span>
            </button>
            <button
              onClick={() => setActiveModal("skills")}
              className="flex flex-col items-center gap-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Code className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-white">Skills</span>
            </button>
            <button
              onClick={() => setActiveModal("languages")}
              className="flex flex-col items-center gap-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Languages className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-white">Languages</span>
            </button>
          </div>
        </div>
      )}

      {/* Right Side - Preview */}
      <div
        className={`${
          isMobile ? "w-full" : viewMode === "preview" ? "w-full lg:w-2/3" : "w-1/2 lg:w-2/3"
        } transition-all duration-300 overflow-y-auto bg-gray-100 p-4 lg:p-8`}
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-100 pb-4 border-b border-gray-300 z-10">
          <h3 className="text-xl font-bold text-gray-900">Preview</h3>
          <div className="flex items-center gap-2">
            {!isMobile && (
              <button
                onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm"
              >
                {viewMode === "edit" ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Preview Only
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Mode
                  </>
                )}
              </button>
            )}
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm"
            >
              <Download className="w-4 h-4" />
              {isMobile ? "" : "Export PDF"}
            </button>
          </div>
        </div>

        <div 
          className="bg-white shadow-2xl mx-auto" 
          style={{ 
            minHeight: isMobile ? "auto" : "297mm", 
            width: isMobile ? "100%" : "210mm",
            transform: isMobile ? "scale(0.8)" : "scale(1)",
            transformOrigin: "top center"
          }}
        >
          {resume.template === "professional-two-column" ? (
            <ProfessionalTwoColumnTemplate resume={resume} />
          ) : (
            <div className="p-8">
              <p className="text-gray-500">Template preview not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {activeModal && (
        <EditModal
          section={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default ResumeEditor;
