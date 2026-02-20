"use client";

import Image from "next/image";
import { Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";

interface Resume {
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
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

interface ProfessionalTwoColumnTemplateProps {
  resume: Resume;
  preview?: boolean;
}

const ProfessionalTwoColumnTemplate = ({
  resume,
  preview = false,
}: ProfessionalTwoColumnTemplateProps) => {
  const getProficiencyWidth = (proficiency: string) => {
    switch (proficiency) {
      case "Native":
        return "100%";
      case "Advanced":
        return "90%";
      case "Intermediate":
        return "75%";
      case "Basic":
        return "50%";
      default:
        return "75%";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const fullName = `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim();
  const title = resume.experience?.[0]?.title || "Professional";

  return (
    <div
      className={`${preview ? "scale-90 origin-top" : "min-h-[297mm]"} w-full flex flex-col md:flex-row bg-white text-black font-sans shadow-2xl relative overflow-hidden`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Left Column - Deep Sidebar */}
      <div className="w-full md:w-1/3 bg-[#1A1A1A] text-white p-8 md:p-12 flex flex-col gap-10 relative z-10 border-r border-white/5">
        <div className="space-y-6 text-center">
          {/* Profile Image */}
          {resume.personalInfo.avatar ? (
            <div className="w-32 h-32 mx-auto relative group">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={resume.personalInfo.avatar}
                  alt={fullName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-xl" />
              <span className="text-4xl font-black text-emerald-400 relative z-10">
                {resume.personalInfo.firstName?.[0] || "U"}
                {resume.personalInfo.lastName?.[0] || ""}
              </span>
            </div>
          )}

          {/* Identity */}
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{fullName || "Your Name"}</h1>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{title}</p>
          </div>
        </div>

        {/* Contact Intelligence */}
        <div className="space-y-6 pt-6 border-t border-white/5">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">Contact</h2>
          <div className="space-y-4 text-[11px] font-bold uppercase tracking-wider text-white/60">
            {resume.personalInfo.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>{resume.personalInfo.email}</span>
              </div>
            )}
            {resume.personalInfo.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>{resume.personalInfo.phone}</span>
              </div>
            )}
            {resume.personalInfo.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>{resume.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Proficiencies */}
        {resume.skills.languages && resume.skills.languages.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">Languages</h2>
            <div className="space-y-4">
              {resume.skills.languages.map((lang, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{lang.language}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: getProficiencyWidth(lang.proficiency) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expertise Grid */}
        {resume.skills.technical && resume.skills.technical.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.technical.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Matrix Content */}
      <div className="w-full md:w-2/3 bg-white text-black p-8 md:p-16 flex flex-col gap-12 relative">
        {/* Profile Synthesis */}
        {resume.summary && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-600 whitespace-nowrap">Profile Summary</h2>
              <div className="w-full h-px bg-emerald-500/10" />
            </div>
            <p className="text-[13px] leading-relaxed text-gray-700 font-medium italic">"{resume.summary}"</p>
          </section>
        )}

        {/* Operational Flow */}
        {resume.experience && resume.experience.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-600 whitespace-nowrap">Operational Experience</h2>
              <div className="w-full h-px bg-emerald-500/10" />
            </div>
            <div className="space-y-10">
              {resume.experience.map((exp, index) => (
                <div key={index} className="space-y-3 relative pl-8 border-l border-emerald-500/10">
                  <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-black tracking-tight text-gray-900 uppercase leading-none mb-1">{exp.title}</h3>
                      <p className="text-[10px] font-black tracking-[0.2em] text-emerald-500/60 uppercase">{exp.company}</p>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap pt-1">
                      {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : exp.current ? "PRESENT" : ""}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Foundation */}
        {resume.education && resume.education.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-600 whitespace-nowrap">Foundational Logic</h2>
              <div className="w-full h-px bg-emerald-500/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {resume.education.map((edu, index) => (
                <div key={index} className="space-y-1 p-4 bg-gray-50 border border-gray-100 rounded-xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{edu.institution}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{edu.degree}</p>
                    <p className="text-[10px] font-black text-emerald-500 opacity-40 uppercase mt-2">
                      {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "PRESENT"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTwoColumnTemplate;

