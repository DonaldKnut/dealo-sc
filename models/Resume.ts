import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
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
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    gpa?: number;
    relevantCourses?: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    startDate?: Date;
    endDate?: Date;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: Date;
    expiryDate?: Date;
    credentialId?: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: "Basic" | "Intermediate" | "Advanced" | "Native";
  }>;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "My Resume",
    },
    template: {
      type: String,
      required: true,
      default: "modern-minimal",
    },
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      location: { type: String, required: true },
      linkedin: { type: String },
      github: { type: String },
      website: { type: String },
    },
    summary: {
      type: String,
      default: "",
    },
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String, required: true },
        achievements: [{ type: String }],
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        gpa: { type: Number },
        relevantCourses: [{ type: String }],
      },
    ],
    skills: {
      technical: [{ type: String }],
      soft: [{ type: String }],
      languages: [{ type: String }],
    },
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [{ type: String }],
        link: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        date: { type: Date, required: true },
        expiryDate: { type: Date },
        credentialId: { type: String },
      },
    ],
    languages: [
      {
        language: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ["Basic", "Intermediate", "Advanced", "Native"],
          required: true,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ResumeSchema.index({ userId: 1, isDefault: 1 });
ResumeSchema.index({ userId: 1, createdAt: -1 });

// Ensure only one default resume per user
ResumeSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await (this.constructor as any).updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

export default mongoose.models.Resume ||
  mongoose.model<IResume>("Resume", ResumeSchema);
