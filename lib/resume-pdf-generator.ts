import jsPDF from "jspdf";
import { IResume } from "@/models/Resume";

export class ResumePDFGenerator {
  private doc: jsPDF;
  private yPosition: number = 20;
  private margin: number = 20;
  private pageWidth: number = 210;
  private contentWidth: number = 170;
  private template: string = "modern-minimal";

  constructor() {
    this.doc = new jsPDF();
  }

  generatePDF(resume: IResume): jsPDF {
    this.doc = new jsPDF();
    this.yPosition = 20;
    this.template = (resume as any)?.template || "modern-minimal";

    // Add header with personal info
    this.addHeader(resume.personalInfo);

    // Add summary
    if (resume.summary) {
      this.addSection("Professional Summary", resume.summary);
    }

    // Add experience
    if (resume.experience && resume.experience.length > 0) {
      this.addExperienceSection(resume.experience);
    }

    // Add education
    if (resume.education && resume.education.length > 0) {
      this.addEducationSection(resume.education);
    }

    // Add skills
    if (resume.skills) {
      this.addSkillsSection(resume.skills);
    }

    // Add projects
    if (resume.projects && resume.projects.length > 0) {
      this.addProjectsSection(resume.projects);
    }

    // Add certifications
    if (resume.certifications && resume.certifications.length > 0) {
      this.addCertificationsSection(resume.certifications);
    }

    // Add languages
    if (resume.languages && resume.languages.length > 0) {
      this.addLanguagesSection(resume.languages);
    }

    return this.doc;
  }

  private addHeader(personalInfo: any) {
    // Name
    if (this.template === "classic") {
      this.doc.setFontSize(22);
      this.doc.setFont("times", "bold");
    } else if (this.template === "creative") {
      this.doc.setFontSize(26);
      this.doc.setFont("helvetica", "bold");
    } else {
      this.doc.setFontSize(24);
      this.doc.setFont("helvetica", "bold");
    }
    this.doc.text(
      `${personalInfo.firstName} ${personalInfo.lastName}`,
      this.margin,
      this.yPosition
    );
    this.yPosition += 10;

    // Contact info
    this.doc.setFontSize(10);
    this.doc.setFont(
      this.template === "classic" ? "times" : "helvetica",
      "normal"
    );

    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
    ].filter(Boolean);

    contactInfo.forEach((info: string) => {
      this.doc.text(info, this.margin, this.yPosition);
      this.yPosition += 5;
    });

    // Social links
    const socialLinks = [
      personalInfo.linkedin && `LinkedIn: ${personalInfo.linkedin}`,
      personalInfo.github && `GitHub: ${personalInfo.github}`,
      personalInfo.website && `Website: ${personalInfo.website}`,
    ].filter(Boolean);

    socialLinks.forEach((link: string) => {
      this.doc.text(link, this.margin, this.yPosition);
      this.yPosition += 5;
    });

    this.yPosition += 10;
  }

  private addSection(title: string, content: string) {
    this.checkPageBreak(15);

    // Section title
    this.doc.setFontSize(this.template === "creative" ? 16 : 14);
    this.doc.setFont(
      this.template === "classic" ? "times" : "helvetica",
      "bold"
    );
    this.doc.text(title, this.margin, this.yPosition);
    this.yPosition += 8;

    // Section content
    this.doc.setFontSize(10);
    this.doc.setFont(
      this.template === "classic" ? "times" : "helvetica",
      "normal"
    );

    const lines = this.doc.splitTextToSize(content, this.contentWidth);
    lines.forEach((line: string) => {
      this.checkPageBreak(5);
      this.doc.text(line, this.margin, this.yPosition);
      this.yPosition += 5;
    });

    this.yPosition += 5;
  }

  private addExperienceSection(experience: any[]) {
    this.checkPageBreak(20);

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Work Experience", this.margin, this.yPosition);
    this.yPosition += 10;

    experience.forEach((exp: any) => {
      this.checkPageBreak(25);

      // Job title and company
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(exp.title, this.margin, this.yPosition);
      this.yPosition += 5;

      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(exp.company, this.margin, this.yPosition);
      this.yPosition += 5;

      // Date range
      const startDate = new Date(exp.startDate).getFullYear();
      const endDate = exp.current
        ? "Present"
        : new Date(exp.endDate).getFullYear();
      this.doc.text(`${startDate} - ${endDate}`, this.margin, this.yPosition);
      this.yPosition += 5;

      // Description
      const lines = this.doc.splitTextToSize(
        exp.description,
        this.contentWidth
      );
      lines.forEach((line: string) => {
        this.checkPageBreak(5);
        this.doc.text(line, this.margin, this.yPosition);
        this.yPosition += 5;
      });

      // Achievements
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach((achievement: string) => {
          this.checkPageBreak(5);
          this.doc.text(`• ${achievement}`, this.margin + 5, this.yPosition);
          this.yPosition += 5;
        });
      }

      this.yPosition += 5;
    });
  }

  private addEducationSection(education: any[]) {
    this.checkPageBreak(20);

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Education", this.margin, this.yPosition);
    this.yPosition += 10;

    education.forEach((edu: any) => {
      this.checkPageBreak(20);

      // Degree and institution
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(edu.degree, this.margin, this.yPosition);
      this.yPosition += 5;

      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(edu.institution, this.margin, this.yPosition);
      this.yPosition += 5;

      // Date range
      const startDate = new Date(edu.startDate).getFullYear();
      const endDate = edu.current
        ? "Present"
        : new Date(edu.endDate).getFullYear();
      this.doc.text(`${startDate} - ${endDate}`, this.margin, this.yPosition);
      this.yPosition += 5;

      if (edu.gpa) {
        this.doc.text(`GPA: ${edu.gpa}`, this.margin, this.yPosition);
        this.yPosition += 5;
      }

      this.yPosition += 5;
    });
  }

  private addSkillsSection(skills: any) {
    this.checkPageBreak(20);

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Skills", this.margin, this.yPosition);
    this.yPosition += 10;

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");

    if (skills.technical && skills.technical.length > 0) {
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Technical Skills:", this.margin, this.yPosition);
      this.yPosition += 5;

      this.doc.setFont("helvetica", "normal");
      const techSkills = skills.technical.join(", ");
      const lines = this.doc.splitTextToSize(techSkills, this.contentWidth);
      lines.forEach((line: string) => {
        this.checkPageBreak(5);
        this.doc.text(line, this.margin, this.yPosition);
        this.yPosition += 5;
      });
      this.yPosition += 5;
    }

    if (skills.soft && skills.soft.length > 0) {
      this.doc.setFont("helvetica", "bold");
      this.doc.text("Soft Skills:", this.margin, this.yPosition);
      this.yPosition += 5;

      this.doc.setFont("helvetica", "normal");
      const softSkills = skills.soft.join(", ");
      const lines = this.doc.splitTextToSize(softSkills, this.contentWidth);
      lines.forEach((line: string) => {
        this.checkPageBreak(5);
        this.doc.text(line, this.margin, this.yPosition);
        this.yPosition += 5;
      });
      this.yPosition += 5;
    }
  }

  private addProjectsSection(projects: any[]) {
    this.checkPageBreak(20);

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Projects", this.margin, this.yPosition);
    this.yPosition += 10;

    projects.forEach((project: any) => {
      this.checkPageBreak(25);

      // Project title
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(project.title, this.margin, this.yPosition);
      this.yPosition += 5;

      // Description
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      const lines = this.doc.splitTextToSize(
        project.description,
        this.contentWidth
      );
      lines.forEach((line: string) => {
        this.checkPageBreak(5);
        this.doc.text(line, this.margin, this.yPosition);
        this.yPosition += 5;
      });

      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        this.doc.text(
          `Technologies: ${project.technologies.join(", ")}`,
          this.margin,
          this.yPosition
        );
        this.yPosition += 5;
      }

      this.yPosition += 5;
    });
  }

  private addCertificationsSection(certifications: any[]) {
    this.checkPageBreak(20);

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Certifications", this.margin, this.yPosition);
    this.yPosition += 10;

    certifications.forEach((cert: any) => {
      this.checkPageBreak(15);

      // Certification name
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "bold");
      this.doc.text(cert.name, this.margin, this.yPosition);
      this.yPosition += 5;

      // Issuer and date
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(
        `${cert.issuer} - ${new Date(cert.date).getFullYear()}`,
        this.margin,
        this.yPosition
      );
      this.yPosition += 5;

      this.yPosition += 5;
    });
  }

  private addLanguagesSection(languages: any[]) {
    this.checkPageBreak(20);

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Languages", this.margin, this.yPosition);
    this.yPosition += 10;

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");

    languages.forEach((lang: any) => {
      this.checkPageBreak(10);
      this.doc.text(
        `${lang.language} - ${lang.proficiency}`,
        this.margin,
        this.yPosition
      );
      this.yPosition += 5;
    });
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.yPosition + requiredSpace > 280) {
      this.doc.addPage();
      this.yPosition = 20;
    }
  }
}

export const generateResumePDF = (resume: IResume): jsPDF => {
  const generator = new ResumePDFGenerator();
  return generator.generatePDF(resume);
};
