/**
 * Professional-grade validation utilities
 */
import { z } from "zod";

/**
 * Validates email format using RFC 5322 compliant regex
 */
export function validateEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Check for common weak passwords
  const commonPasswords = [
    "password",
    "12345678",
    "qwerty",
    "abc123",
    "password123",
  ];
  if (commonPasswords.some((weak) => password.toLowerCase().includes(weak))) {
    errors.push("Password is too common. Please choose a stronger password");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .substring(0, 255); // Max length
}

/**
 * Validates name (firstName, lastName)
 */
export function validateName(name: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (name.length > 50) {
    errors.push("Name must be less than 50 characters");
  }

  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    errors.push("Name can only contain letters, spaces, hyphens, and apostrophes");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates phone number (basic validation)
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field

  // Remove spaces, dashes, parentheses, and plus sign for validation
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");

  // Check if it's all digits and has reasonable length (7-15 digits)
  return /^\d{7,15}$/.test(cleaned);
}

/**
 * Validates all signup form data
 */
export function validateSignupData(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}): {
  valid: boolean;
  errors: Record<string, string[]>;
} {
  const errors: Record<string, string[]> = {};

  // Validate first name
  const firstNameValidation = validateName(data.firstName);
  if (!firstNameValidation.valid) {
    errors.firstName = firstNameValidation.errors;
  }

  // Validate last name
  const lastNameValidation = validateName(data.lastName);
  if (!lastNameValidation.valid) {
    errors.lastName = lastNameValidation.errors;
  }

  // Validate email
  if (!validateEmail(data.email)) {
    errors.email = ["Invalid email address format"];
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors;
  }

  // Validate phone (optional)
  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = ["Invalid phone number format"];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Search validation schema using Zod
 */
export const SearchValidationSchema = z.object({
  query: z.string().min(1, "Search query is required").max(200, "Search query must be less than 200 characters"),
});
