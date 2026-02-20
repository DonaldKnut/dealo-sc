import { z } from "zod";
import { Role } from "@/types/role";
import { paginationSchema } from "@/lib/db/pagination";

/**
 * Common validation schemas for API routes
 */

// Email validation
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(1, "Email is required")
  .max(255, "Email is too long")
  .toLowerCase()
  .trim();

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

// Name validation
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name is too long")
  .trim()
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

// Phone validation
export const phoneSchema = z
  .string()
  .min(10, "Phone number is too short")
  .max(20, "Phone number is too long")
  .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format")
  .trim();

// URL validation
export const urlSchema = z
  .string()
  .url("Invalid URL")
  .max(2048, "URL is too long")
  .trim();

// MongoDB ObjectId validation
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")
  .min(24)
  .max(24);

// Re-export pagination schema from db/pagination
export { paginationSchema } from "@/lib/db/pagination";

// Role validation
export const roleSchema = z.nativeEnum(Role);

// Date validation
export const dateSchema = z.coerce.date().refine(
  (date) => date <= new Date(),
  "Date cannot be in the future"
);

// File upload validation
export const fileSchema = z.object({
  name: z.string().min(1).max(255),
  size: z.number().int().min(1).max(100 * 1024 * 1024), // Max 100MB
  type: z.string().regex(/^(image|video|application|text)\//),
});

// Sanitize string input
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
}

// Sanitize object recursively
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj } as any;
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeString(sanitized[key] as string);
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  
  return sanitized as T;
}

// Common request body schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: roleSchema.optional(),
  phone: phoneSchema.optional(),
});

export const updateUserSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema.optional(),
  bio: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Search query validation
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200).trim(),
  filters: z.record(z.any()).optional(),
  ...paginationSchema.shape,
});

// ID parameter validation
export const idParamSchema = z.object({
  id: objectIdSchema,
});

// Validate and parse request body
export async function validateRequestBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
    }
    throw error;
  }
}

// Validate query parameters
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries());
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
    }
    throw error;
  }
}

// Validate route parameters
export function validateRouteParams<T>(
  params: Record<string, string | string[] | undefined>,
  schema: z.ZodSchema<T>
): T {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
    }
    throw error;
  }
}



