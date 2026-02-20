/**
 * Centralized middleware exports
 * Combine authentication, RBAC, rate limiting, and validation
 */

export * from "./auth";
export * from "./rbac";
export * from "./rate-limit";

/**
 * Combined middleware for protected API routes
 * Includes: Authentication + Rate Limiting + Optional RBAC
 */
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/types/role";
import { withAuth, requireAuth } from "./auth";
import { withRole, requireRole } from "./rbac";
import { withRateLimit, rateLimiters } from "./rate-limit";

export interface MiddlewareOptions {
  requireAuth?: boolean;
  allowedRoles?: Role[];
  rateLimit?: "strict" | "standard" | "moderate" | "generous" | "upload" | "auth";
  requireEmailVerification?: boolean;
}

/**
 * Create a protected API route handler with all security middleware
 */
export function createProtectedHandler<T = any>(
  handler: (req: NextRequest, user: Awaited<ReturnType<typeof requireAuth>>, ...args: any[]) => Promise<T>,
  options: MiddlewareOptions = {}
) {
  const {
    requireAuth: needsAuth = true,
    allowedRoles,
    rateLimit = "standard",
    requireEmailVerification = false,
  } = options;

  let protectedHandler = handler;

  // Apply email verification if needed
  if (requireEmailVerification) {
    const originalHandler = protectedHandler;
    protectedHandler = async (req, user, ...args) => {
      if (!user.isEmailVerified) {
        throw new Error("Email verification required");
      }
      return originalHandler(req, user, ...args);
    };
  }

  // Apply RBAC if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    protectedHandler = withRole(allowedRoles, protectedHandler as any) as any;
  } else if (needsAuth) {
    // Apply authentication
    protectedHandler = withAuth(protectedHandler) as any;
  }

  // Apply rate limiting
  const rateLimiter = rateLimiters[rateLimit];
  return withRateLimit(rateLimiter, protectedHandler);
}

/**
 * Example usage:
 * 
 * export const POST = createProtectedHandler(
 *   async (req, user) => {
 *     // Your handler logic here
 *     // user is guaranteed to be authenticated
 *     return { success: true };
 *   },
 *   {
 *     allowedRoles: [Role.ADMIN, Role.INSTRUCTOR],
 *     rateLimit: "standard",
 *     requireEmailVerification: true,
 *   }
 * );
 */



