import mongoose from "mongoose";
import { Role, Status } from "@/types/role";

// Enum for role-based access throughout Dealo
export enum Role {
  COMPANY = "COMPANY",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
  FREELANCER = "FREELANCER",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
  JOB_SEEKER = "JOB_SEEKER",
}

// Import Status from types/role.ts instead of defining it here
// This prevents conflicts with the main Status enum

export type CustomUser = {
  _id: string;
  accessToken: string;
  role: Role;
  isAdmin: boolean;
  avatar?: { id: string; url: string } | null;
  cart: string[];
  wishlist: string[];
  status: Status;
  credits: number;
  company?: string | null;
  jobSeekerInfo?: string | null;
  // Make these optional if they're not always needed
  id?: string;
  email?: string;
};

// ✅ Creator model (for embedded minimal author display)
export interface Creator {
  _id: string;
  username: string;
  profileImagePath: string;
}

// ✅ Work (Gig/Portfolio/Service Listing)
export interface IWork {
  _id: Types.ObjectId | string; // Works for both MongoDB and frontend
  creator: Types.ObjectId | UserReference; // Flexible reference
  category: string;
  title: string;
  description: string;
  price: number;
  workMedia: { url: string; type: "image" | "video" }[];
  deliveryDate: Date | string; // Accepts both Date and ISO strings
  deliveryTime: string;
  skills: string[];
  contactInfo: {
    email: string;
    phone: string;
  };
  experienceLevel: "Junior" | "Mid" | "Senior";
  portfolioLink: string;
  languagesSpoken?: string[];
  certifications?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ✅ Job listing (aligned with JobPost model)
export interface Job {
  id: string;
  jobIcon?: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  postedBy: string; // company ID
  createdBy: string; // author ID (optional if same as postedBy)
  country: string;
  type: string;
  isRemote?: boolean;
  skillsRequired?: string[];
  experienceRequired?: number | string;
  category?: string;
  location?: string;
  salaryFrom?: number;
  salaryTo?: number;
  benefits?: string[];
  status?: "DRAFT" | "ACTIVE" | "EXPIRED";
  expiresAt?: string;
  isPaid?: boolean;
}

// ✅ Course (user-facing course summary)
export interface Course {
  id: string;
  title: string;
  description: string;
  createdBy: {
    firstName: string;
    avatar: string;
  };
  category: string;
  price: number;
  thumbnail?: string;
  duration?: string;
  lessonsCount?: number;
}

// ✅ Full course structure for admin/backend views
export interface CourseList {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  courseOutput: {
    description?: string;
    outcomes?: string[];
  };
  videos?: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  createdBy: {
    firstName: string;
    avatar: string;
  };
  courseDuration: string;
  noOfChapters: number;
  addVideo?: boolean;
  courseBanner?: string;
  publish?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
