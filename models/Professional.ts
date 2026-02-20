import mongoose, { Schema, Document } from "mongoose";

export interface IProfessional extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: "FREELANCER" | "INSTRUCTOR" | "CONSULTANT" | "MENTOR";
  isCertified: boolean;
  isVerified: boolean;
  isProfileComplete: boolean;
  isAvailable: boolean;
  experience: string;
  servicesOffered: string[];
  serviceArea: string;
  rating: number;
  totalReviews: number;
  completedProjects: number;
  hourlyRate: string;
  skills: string[];
  bio: string;
  portfolio: Array<{
    title: string;
    description: string;
    image: string;
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: Date;
    image?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  specializations: string[];
  languages: string[];
  availability: {
    available: boolean;
    schedule?: string;
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String },
});

const certificationSchema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String },
});

const educationSchema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: Number, required: true },
});

const socialLinksSchema = new Schema({
  linkedin: { type: String },
  twitter: { type: String },
  github: { type: String },
  website: { type: String },
});

const availabilitySchema = new Schema({
  available: { type: Boolean, default: true },
  schedule: { type: String },
  timezone: { type: String, default: "Africa/Lagos" },
});

const professionalSchema = new Schema<IProfessional>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["FREELANCER", "INSTRUCTOR", "CONSULTANT", "MENTOR"],
      required: true,
    },
    isCertified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    experience: {
      type: String,
      required: true,
    },
    servicesOffered: [
      {
        type: String,
        required: true,
      },
    ],
    serviceArea: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    bio: {
      type: String,
      required: true,
      maxlength: 500,
    },
    portfolio: [portfolioSchema],
    certifications: [certificationSchema],
    education: [educationSchema],
    socialLinks: socialLinksSchema,
    specializations: [
      {
        type: String,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    availability: availabilitySchema,
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
professionalSchema.index({ firstName: 1, lastName: 1 });
professionalSchema.index({ servicesOffered: 1 });
professionalSchema.index({ skills: 1 });
professionalSchema.index({ serviceArea: 1 });
professionalSchema.index({ role: 1 });
professionalSchema.index({ isAvailable: 1 });
professionalSchema.index({ rating: -1 });
professionalSchema.index({ isCertified: 1 });

// Text search index
professionalSchema.index({
  firstName: "text",
  lastName: "text",
  bio: "text",
  servicesOffered: "text",
  skills: "text",
});

export const ProfessionalModel =
  mongoose.models.Professional ||
  mongoose.model<IProfessional>("Professional", professionalSchema);





