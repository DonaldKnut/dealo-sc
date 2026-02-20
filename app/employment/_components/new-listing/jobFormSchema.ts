import { z } from "zod";

/**
 * Zod Schema for Job Posting Form Validation
 * Ensures all required fields are properly validated
 */
export const jobFormSchema = z.object({
  // Required fields
  title: z
    .string()
    .min(3, "Job title must be at least 3 characters")
    .max(100, "Job title must not exceed 100 characters")
    .trim(),

  description: z
    .string()
    .refine((val) => {
      if (!val) return false;
      // Strip HTML tags to count actual text content
      const textContent = val.replace(/<[^>]*>/g, "").trim();
      return textContent.length >= 50;
    }, "Job description must be at least 50 characters")
    .refine((val) => {
      if (!val) return false;
      // Strip HTML tags to count actual text content
      const textContent = val.replace(/<[^>]*>/g, "").trim();
      return textContent.length <= 5000;
    }, "Job description must not exceed 5000 characters"),

  budget: z
    .number()
    .min(0, "Budget must be a positive number")
    .or(z.string().transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) throw new Error("Budget must be a valid positive number");
      return num;
    })),

  deadline: z
    .string()
    .min(1, "Application deadline is required")
    .refine((date) => {
      if (!date) return false;
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Deadline must be today or in the future"),

  contactPhone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .refine((val) => {
      if (!val) return false;
      // Remove formatting characters (spaces, dashes, parentheses)
      const cleaned = val.replace(/[\s\-\(\)]/g, '');
      // Accept E.164 format (+ followed by digits) or plain digits
      if (cleaned.startsWith('+')) {
        // E.164: + followed by 1-15 digits (first digit after + should be 1-9)
        return /^\+[1-9]\d{0,14}$/.test(cleaned);
      } else {
        // Plain number: 7-15 digits, first digit should be 1-9
        return /^[1-9]\d{6,14}$/.test(cleaned);
      }
    }, "Please enter a valid international phone number (e.g., +1234567890)"),

  category: z
    .string()
    .min(1, "Please select a job category"),

  // Optional but validated fields
  skillsRequired: z
    .array(z.string())
    .default([])
    .optional(),

  experienceRequired: z
    .union([
      z.string(),
      z.number(),
    ])
    .transform((val) => {
      if (typeof val === "number") return val.toString();
      if (val === "" || val === null || val === undefined) return "";
      return String(val);
    })
    .refine((val) => {
      if (!val || val === "") return true; // Optional field
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Experience must be a valid positive number")
    .optional(),

  remote: z
    .enum(["onsite", "hybrid", "remote"], {
      errorMap: () => ({ message: "Please select a work location type" }),
    })
    .default("onsite"),

  type: z
    .enum(["full-time", "part-time", "contract", "internship", "temporary"], {
      errorMap: () => ({ message: "Please select a job type" }),
    })
    .default("full-time"),

  country: z
    .string()
    .optional(),

  state: z
    .string()
    .optional(),

  city: z
    .string()
    .optional(),

  jobIcon: z
    .string()
    .url("Please provide a valid URL for job icon")
    .optional()
    .or(z.literal("")),


  // Conditional fields for unauthenticated users
  contactEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional(),

  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .optional(),

  organizationId: z
    .string()
    .optional(),
});

/**
 * Schema for authenticated users (email and company name not required)
 */
export const authenticatedJobFormSchema = jobFormSchema.omit({
  contactEmail: true,
  companyName: true,
});

/**
 * Schema for unauthenticated users (email and company name required)
 */
export const unauthenticatedJobFormSchema = jobFormSchema.extend({
  contactEmail: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters")
    .min(1, "Company name is required"),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
export type AuthenticatedJobFormData = z.infer<typeof authenticatedJobFormSchema>;
export type UnauthenticatedJobFormData = z.infer<typeof unauthenticatedJobFormSchema>;

