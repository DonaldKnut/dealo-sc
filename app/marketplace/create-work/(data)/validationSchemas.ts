// ../(data)/validationSchemas.ts
import { z } from "zod";

// Define and export categories as a const array
export const categories = [
  "All",
  "Graphics Design", // From Menu.tsx
  "Coding & Tech", // From Menu.tsx (broader than "Programming")
  "Photography", // From Menu.tsx
  "Lifestyle", // From Menu.tsx
  "Video & Animation", // From Menu.tsx and your original
  "Writing & Translation", // From Menu.tsx
  "Law", // From Menu.tsx and your original
  "Data Science", // From Menu.tsx
  "Digital Marketing", // From Menu.tsx and your original
  "Music", // From Menu.tsx and your original
  "Engineering", // From Menu.tsx and your original
  "Aviation", // From Menu.tsx
  "Fitness", // New addition per your request
  "AI Trainer", // New addition per your request
  "AI Services", // From your original, Fiverr-inspired
  "IT", // From your original
  "CyberSecurity", // From your original
  "Business Consulting", // Fiverr-inspired
  "Voice Over", // Fiverr-inspired
  "Animation", // Fiverr-inspired, split from Video
  "SEO Services", // Fiverr-inspired
  "Web Development", // Fiverr-inspired
  "Mobile Development", // Fiverr-inspired
  "Game Development", // Fiverr-inspired
  "Fashion Design", // Fiverr-inspired
  "Interior Design", // Fiverr-inspired
  "Education & Tutoring", // Fiverr-inspired
  "Health & Wellness", // Fiverr-inspired
  "Event Planning", // Fiverr-inspired
] as const;

export const workSchema = z.object({
  category: z.enum(categories, {
    errorMap: () => ({ message: "Invalid category selected." }),
  }),
  title: z.string().min(1, "Title is required."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long."),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Price must be greater than 0.")
  ),
  workMedia: z
    .array(z.object({ url: z.string(), type: z.enum(["image", "video"]) }))
    .min(1, "At least one media file is required."),
  skills: z.array(z.string()).min(1, "At least one skill is required."),
  deliveryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid delivery date format.",
  }),
  deliveryTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format (HH:mm).",
  }),
  contactInfo: z.object({
    email: z.string().email("Invalid email format."),
    phone: z.string().optional(),
  }),
  portfolioLink: z.string().url("Invalid portfolio link format.").optional().or(z.literal("")),
  languagesSpoken: z.array(z.string()).default([]),
  experienceLevel: z.enum(["Junior", "Mid", "Senior"]),
  certifications: z.array(z.string()).default([]),
});

// Infer TypeScript type
export type Work = z.infer<typeof workSchema>;
