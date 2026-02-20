"use client";

import { Mail, Phone, MapPin, Globe } from "lucide-react";

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
    }>;
    skills: {
        technical: string[];
        soft: string[];
        languages: Array<{
            language: string;
            proficiency: string;
        }>;
    };
    certifications?: Array<{
        name: string;
        issuer: string;
        date: string;
    }>;
}

interface ClassicTemplateProps {
    resume: Resume;
    preview?: boolean;
}

const ClassicTemplate = ({
    resume,
    preview = false,
}: ClassicTemplateProps) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.getFullYear().toString();
    };

    const fullName = `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`.trim();

    return (
        <div
            className={`${preview ? "scale-90 origin-top" : "min-h-[297mm]"} w-full bg-white text-black p-12 md:p-20 flex flex-col gap-12`}
            style={{ fontFamily: "'Crimson Pro', serif, 'Inter', sans-serif" }}
        >
            {/* Header - Operational Cinematic */}
            <header className="border-b-4 border-gray-900 pb-8 space-y-4">
                <h1 className="text-5xl font-black tracking-tight text-gray-900 uppercase">
                    {fullName || "OPERATIVE NAME"}
                </h1>
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
                    {resume.personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-900" />
                            <span>{resume.personalInfo.location}</span>
                        </div>
                    )}
                    {resume.personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-900" />
                            <span>{resume.personalInfo.phone}</span>
                        </div>
                    )}
                    {resume.personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-gray-900" />
                            <span>{resume.personalInfo.email}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Profile */}
            {resume.summary && (
                <section className="space-y-4">
                    <h2 className="text-[14px] font-black tracking-[0.5em] uppercase text-gray-900 border-b border-gray-200 pb-2">
                        Professional Summary
                    </h2>
                    <p className="text-[13px] leading-relaxed text-gray-700 font-medium italic">
                        {resume.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-[14px] font-black tracking-[0.5em] uppercase text-gray-900 border-b border-gray-200 pb-2">
                        Operational Experience
                    </h2>
                    <div className="space-y-10">
                        {resume.experience.map((exp, index) => (
                            <div key={index} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-[16px] font-black tracking-tight text-gray-900 uppercase leading-none">
                                            {exp.title}
                                        </h3>
                                        <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                            {exp.company}
                                        </p>
                                    </div>
                                    <span className="text-[12px] font-black text-gray-900 uppercase tracking-widest whitespace-nowrap">
                                        {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : exp.current ? "PRESENT" : ""}
                                    </span>
                                </div>
                                <p className="text-[12px] text-gray-600 leading-relaxed font-medium">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Education & Certs */}
                <div className="space-y-12">
                    {resume.education && resume.education.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-[14px] font-black tracking-[0.5em] uppercase text-gray-900 border-b border-gray-200 pb-2">
                                Education
                            </h2>
                            <div className="space-y-8">
                                {resume.education.map((edu, index) => (
                                    <div key={index} className="space-y-1">
                                        <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-tight">
                                            {edu.institution}
                                        </h3>
                                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                            {edu.degree}
                                        </p>
                                        <p className="text-[11px] font-black text-gray-400 uppercase">
                                            {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "PRESENT"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {resume.certifications && resume.certifications.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-[14px] font-black tracking-[0.5em] uppercase text-gray-900 border-b border-gray-200 pb-2">
                                Certifications
                            </h2>
                            <ul className="space-y-3">
                                {resume.certifications.map((cert, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-1" />
                                        <div className="space-y-0.5">
                                            <p className="text-[12px] font-black text-gray-900 uppercase tracking-tight">
                                                {cert.name}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {cert.issuer} | {formatDate(cert.date)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Skills */}
                <section className="space-y-6">
                    <h2 className="text-[14px] font-black tracking-[0.5em] uppercase text-gray-900 border-b border-gray-200 pb-2">
                        Skillsets
                    </h2>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Technical Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {resume.skills.technical.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-900 text-[10px] font-black text-white uppercase tracking-widest rounded-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {resume.skills.languages && resume.skills.languages.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Linguistic Proficiencies</h3>
                                <div className="space-y-2">
                                    {resume.skills.languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between items-center border-b border-gray-50 pb-1">
                                            <span className="text-[12px] font-black text-gray-900 uppercase tracking-tighter">{lang.language}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ClassicTemplate;
