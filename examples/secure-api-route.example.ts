/**
 * Example: Secure API Route Implementation
 * 
 * This file demonstrates how to use the security middleware
 * in your API routes. DO NOT use this file directly - copy
 * the patterns to your actual API routes.
 */

import { NextRequest } from "next/server";
import { createProtectedHandler, withAuth, withRole, withRateLimit, rateLimiters } from "@/lib/middleware";
import { requireAuth } from "@/lib/middleware/auth";
import { requireAdmin, requireRole } from "@/lib/middleware/rbac";
import { Role } from "@/types/role";
import { validateBody, validateQuery, validateParams, withValidation } from "@/lib/middleware/validation";
import { sanitizeFindQuery, sanitizeUpdateQuery, sanitizeObjectId } from "@/lib/validation/db-sanitize";
import { z } from "zod";
import { UserModel } from "@/models/User";

// ============================================
// EXAMPLE 1: Simple Protected Route
// ============================================
export async function GET(req: NextRequest) {
  // Require authentication
  const user = await requireAuth(req);
  
  // Your logic here
  return Response.json({ message: `Hello ${user.email}` });
}

// ============================================
// EXAMPLE 2: Protected Route with Rate Limiting
// ============================================
export async function POST(req: NextRequest) {
  // Require authentication
  const user = await requireAuth(req);
  
  // Apply rate limiting manually
  const rateLimitResult = await rateLimiters.standard(req, user.id);
  if (!rateLimitResult.allowed) {
    return Response.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }
  
  // Your logic here
  return Response.json({ success: true });
}

// ============================================
// EXAMPLE 3: Admin-Only Route
// ============================================
export async function DELETE(req: NextRequest) {
  // Require admin role
  const user = await requireAdmin(req);
  
  // Your admin logic here
  return Response.json({ success: true });
}

// ============================================
// EXAMPLE 4: Role-Based Access Control
// ============================================
export async function PUT(req: NextRequest) {
  // Require specific roles
  const user = await requireRole(req, [Role.INSTRUCTOR, Role.ADMIN]);
  
  // Your logic here
  return Response.json({ success: true });
}

// ============================================
// EXAMPLE 5: With Input Validation
// ============================================
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.nativeEnum(Role),
});

export async function POST_VALIDATED(req: NextRequest) {
  // Require authentication
  const user = await requireAuth(req);
  
  // Validate request body
  const body = await validateBody(createUserSchema)(req);
  
  // Sanitize before database operation
  const sanitized = sanitizeFindQuery(body);
  
  // Your logic here
  return Response.json({ success: true, data: sanitized });
}

// ============================================
// EXAMPLE 6: Using Combined Middleware
// ============================================
export const POST_COMBINED = createProtectedHandler(
  async (req, user) => {
    // User is already authenticated and authorized
    // Rate limiting is already applied
    
    // Validate body
    const body = await validateBody(createUserSchema)(req);
    
    // Sanitize query
    const sanitized = sanitizeFindQuery(body);
    
    // Safe database operation
    const result = await UserModel.create(sanitized);
    
    return { success: true, data: result };
  },
  {
    allowedRoles: [Role.ADMIN, Role.INSTRUCTOR],
    rateLimit: "standard",
    requireEmailVerification: true,
  }
);

// ============================================
// EXAMPLE 7: With Query Parameters
// ============================================
const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export async function GET_WITH_QUERY(req: NextRequest) {
  const user = await requireAuth(req);
  
  // Validate query parameters
  const query = validateQuery(querySchema)(req);
  
  // Sanitize search query
  const searchQuery = query.search 
    ? sanitizeFindQuery({ title: { $regex: query.search, $options: "i" } })
    : {};
  
  // Safe database query
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const results = await UserModel.find(searchQuery)
    .skip((page - 1) * limit)
    .limit(limit);
  
  return Response.json({ data: results });
}

// ============================================
// EXAMPLE 8: With Route Parameters
// ============================================
const paramsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export async function GET_WITH_PARAMS(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(req);
  
  // Validate and sanitize route parameter
  const { id } = validateParams(paramsSchema)(params);
  const objectId = sanitizeObjectId(id);
  
  if (!objectId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  
  // Safe database query
  const result = await UserModel.findById(objectId);
  
  if (!result) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  
  return Response.json({ data: result });
}

// ============================================
// EXAMPLE 9: Update with Sanitization
// ============================================
const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(req);
  
  // Validate params
  const { id } = validateParams(paramsSchema)(params);
  const objectId = sanitizeObjectId(id);
  
  // Validate body
  const body = await validateBody(updateSchema)(req);
  
  // Sanitize update query
  const sanitized = sanitizeUpdateQuery(body);
  
  // Check ownership or admin
  const targetUser = await UserModel.findById(objectId);
  if (!targetUser) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  
  if (user.id !== targetUser._id.toString() && !user.isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Safe update
  const updated = await UserModel.findByIdAndUpdate(objectId, sanitized, { new: true });
  
  return Response.json({ data: updated });
}

// ============================================
// EXAMPLE 10: Using Validation Wrapper
// ============================================
export const POST_WITH_WRAPPER = withValidation(
  {
    body: createUserSchema,
    query: querySchema,
  },
  async (req, validated) => {
    const user = await requireAuth(req);
    
    // validated.body and validated.query are already validated and typed
    const sanitized = sanitizeFindQuery(validated.body!);
    
    const result = await UserModel.create(sanitized);
    
    return { success: true, data: result };
  }
);



