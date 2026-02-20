"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

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

interface ModernMinimalTemplateProps {
    resume: Resume;
    preview?: boolean;
}

const ModernMinimalTemplate = ({
    resume,
    preview = false,
}: ModernMinimalTemplateProps) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.getFullYear().toString();
    };

    const fullName = `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim();

    return (
        <div
            className={`${preview ? "scale-90 origin-top" : "min-h-[297mm]"} w-full bg-white text-black p-12 md:p-16 flex flex-col gap-12`}
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Header - Nexus Elite Style */}
            <header className="flex flex-col items-center text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-gray-900 leading-none">
                        {fullName || "OPERATIVE NAME"}
                    </h1>
                    <p className="text-[12px] font-black tracking-[0.4em] uppercase text-emerald-600">
                        {resume.experience?.[0]?.title || "PROFESSIONAL PROFILE"}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {resume.personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-emerald-500" />
                            <span>{resume.personalInfo.email}</span>
                        </div>
                    )}
                    {resume.personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <span>{resume.personalInfo.phone}</span>
                        </div>
                    )}
                    {resume.personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            <span>{resume.personalInfo.location}</span>
                        </div>
                    )}
                    {resume.personalInfo.website && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-emerald-500" />
                            <span>{resume.personalInfo.website.replace(/^https?:\/\//, "")}</span>
                        </div>
                    )}
                </div>

                <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            </header>

            {/* Summary */}
            {resume.summary && (
                <section className="max-w-3xl mx-auto">
                    <p className="text-sm text-center leading-relaxed text-gray-600 italic">
                        "{resume.summary}"
                    </p>
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                {/* Main Content */}
                <div className="md:col-span-8 space-y-12">
                    {/* Experience */}
                    {resume.experience && resume.experience.length > 0 && (
                        <section className="space-y-8">
                            <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-emerald-600 border-b border-emerald-500/10 pb-4">
                                Professional Trajectory
                            </h2>
                            <div className="space-y-10">
                                {resume.experience.map((exp, index) => (
                                    <div key={index} className="space-y-3 relative pl-8 border-l border-gray-100">
                                        <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-emerald-500" />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-black tracking-tight text-gray-900 uppercase leading-none mb-1">
                                                    {exp.title}
                                                </h3>
                                                <p className="text-[10px] font-black tracking-widest text-emerald-600/60 uppercase">
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap pt-1">
                                                {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : exp.current ? "Present" : ""}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {resume.projects && resume.projects.length > 0 && (
                        <section className="space-y-8">
                            <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-emerald-600 border-b border-emerald-500/10 pb-4">
                                Strategic Manifestations
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {resume.projects.map((project, index) => (
                                    <div key={index} className="space-y-2">
                                        <h3 className="text-[12px] font-black tracking-wider text-gray-900 uppercase">
                                            {project.title}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="md:col-span-4 space-y-12">
                    {/* Skills */}
                    <section className="space-y-6">
                        <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-emerald-600">
                            Core Expertise
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {resume.skills.technical.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-50 text-[9px] font-black text-gray-600 border border-gray-100 uppercase tracking-widest rounded-lg">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    {resume.education && resume.education.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-emerald-600">
                                Foundational Logic
                            </h2>
                            <div className="space-y-6">
                                {resume.education.map((edu, index) => (
                                    <div key={index} className="space-y-1">
                                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-tight">
                                            {edu.institution}
                                        </h3>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                            {edu.degree}
                                        </p>
                                        <p className="text-[9px] font-black text-emerald-600/40 uppercase">
                                            {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "PRESENT"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {resume.certifications && resume.certifications.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-emerald-600">
                                Verified Credentials
                            </h2>
                            <div className="space-y-4">
                                {resume.certifications.map((cert, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-1 h-auto bg-emerald-500/10" />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-800 uppercase tracking-tight leading-tight">
                                                {cert.name}
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                {cert.issuer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModernMinimalTemplate;
