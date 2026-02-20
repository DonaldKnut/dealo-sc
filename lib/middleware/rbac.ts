import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/types/role";
import { requireAuth, type AuthenticatedRequest } from "./auth";

/**
 * Role-Based Access Control (RBAC) middleware
 */

/**
 * Check if user has one of the required roles
 */
export async function requireRole(
  req: NextRequest,
  allowedRoles: Role[]
): Promise<ReturnType<typeof requireAuth>> {
  const user = await requireAuth(req);

  // Admin has access to everything
  if (user.isAdmin) {
    return user;
  }

  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      `Forbidden: Access denied. Required roles: ${allowedRoles.join(", ")}`
    );
  }

  return user;
}

/**
 * Check if user is admin
 */
export async function requireAdmin(req: NextRequest) {
  return requireRole(req, [Role.ADMIN]);
}

/**
 * Check if user is instructor
 */
export async function requireInstructor(req: NextRequest) {
  return requireRole(req, [Role.INSTRUCTOR, Role.ADMIN]);
}

/**
 * Check if user is company
 */
export async function requireCompany(req: NextRequest) {
  return requireRole(req, [Role.COMPANY, Role.ADMIN]);
}

/**
 * Check if user owns the resource or is admin
 */
export async function requireOwnershipOrAdmin(
  req: NextRequest,
  resourceUserId: string
) {
  const user = await requireAuth(req);

  // Admin can access anything
  if (user.isAdmin) {
    return user;
  }

  // Check if user owns the resource
  if (user.id !== resourceUserId) {
    throw new Error("Forbidden: You don't have permission to access this resource");
  }

  return user;
}

/**
 * Wrapper for API route handlers that require specific roles
 */
export function withRole<T = any>(
  allowedRoles: Role[],
  handler: (req: NextRequest, user: Awaited<ReturnType<typeof requireRole>>, ...args: any[]) => Promise<T>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse<T | { error: string }>> => {
    try {
      const user = await requireRole(req, allowedRoles);
      const result = await handler(req, user, ...args);
      return NextResponse.json(result);
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      console.error("RBAC middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Wrapper for admin-only routes
 */
export function withAdmin<T = any>(
  handler: (req: NextRequest, user: Awaited<ReturnType<typeof requireAdmin>>, ...args: any[]) => Promise<T>
) {
  return withRole([Role.ADMIN], handler);
}

/**
 * Check if user can access resource based on custom permission function
 */
export async function requirePermission(
  req: NextRequest,
  checkPermission: (user: Awaited<ReturnType<typeof requireAuth>>) => boolean | Promise<boolean>
) {
  const user = await requireAuth(req);
  const hasPermission = await checkPermission(user);

  if (!hasPermission) {
    throw new Error("Forbidden: You don't have permission to perform this action");
  }

  return user;
}

