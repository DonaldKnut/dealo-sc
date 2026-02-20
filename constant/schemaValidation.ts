// schemaValidation.ts
import { z } from "zod";
import { Role } from "@/types/role";
import { industryEnum } from "@/types/industries";

const baseSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (val) => {
        const dob = new Date(val);
        const age = new Date().getFullYear() - dob.getFullYear();
        return age >= 13;
      },
      {
        message: "You must be at least 13 years old to register.",
      }
    ),
  role: z.nativeEnum(Role),
  termsAccepted: z.boolean().refine((val) => val, {
    message: "Please accept the terms and conditions.",
  }),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

export const schemas = {
  [Role.COMPANY]: baseSchema.extend({
    companyName: z.string().min(1, "Company name is required"),
    industry: z.enum(industryEnum, {
      errorMap: () => ({ message: "Please select a valid industry." }),
    }),
    companyWebsite: z.string().url("Invalid company website URL"),
    certificateUrl: z.string().url("Invalid certificate URL").optional(),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().optional(),
    xAccount: z.string().optional(),
    about: z.string().optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
  }),

  [Role.DOCTOR]: baseSchema.extend({
    specialization: z.string().min(1, "Specialization is required"),
    licenseNumber: z.string().min(1, "License number is required"),
    yearsOfExperience: z
      .string()
      .transform((val) => Number(val))
      .refine(
        (val) => val >= 0,
        "Years of experience must be a positive number"
      ),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    certificateUrl: z.string().url("Invalid certificate URL").optional(),
  }),

  [Role.FREELANCER]: baseSchema.extend({
    bio: z
      .string()
      .min(10, "Bio is required and must be at least 10 characters"),
    skills: z.string().min(1, "Skills are required"),
    hourlyRate: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => val >= 0, "Hourly rate must be a positive number"),
    availability: z.enum(["full_time", "part_time", "as_needed"]),
    experienceLevel: z.string().min(1, "Experience level is required"),
    preferredWorkType: z.string().min(1, "Preferred work type is required"),
    portfolioUrl: z.string().url("Invalid portfolio URL"),
    location: z.string().min(1, "Location is required"),
    languagesSpoken: z.string().optional(),
  }),

  [Role.INSTRUCTOR]: baseSchema.extend({
    bio: z
      .string()
      .min(10, "Bio is required and must be at least 10 characters"),
    availability: z.enum(["full_time", "part_time", "as_needed"]),
    portfolioUrl: z.string().url("Invalid portfolio URL"),
    course: z.string().min(1, "Course is required"),
    qualifications: z.enum([
      "bachelors_degree",
      "masters_degree",
      "doctorate",
      "associate_degree",
    ]),
    certificateUrl: z.string().url("Invalid certificate URL").optional(),
  }),

  [Role.STUDENT]: baseSchema.extend({
    bio: z
      .string()
      .min(10, "Bio is required and must be at least 10 characters"),
    enrolledCourses: z.string().optional(),
  }),

  [Role.PATIENT]: baseSchema.extend({
    primaryPhysician: z.string().min(1, "Primary physician is required"),
    insuranceProvider: z.string().optional(),
    insurancePolicyNumber: z.string().optional(),
    allergies: z.string().optional(),
    medicalHistory: z.string().optional(),
    illnesses: z.string().optional(),
  }),

  [Role.JOB_SEEKER]: baseSchema.extend({
    about: z.string().min(1, "About is required"),
    coverLetter: z
      .string()
      .url("Invalid cover letter URL")
      .min(1, "Cover letter is required"),
    resume: z.string().url("Invalid resume URL").min(1, "Resume is required"),
  }),
} as const;

export type SchemaKeys = keyof typeof schemas;
