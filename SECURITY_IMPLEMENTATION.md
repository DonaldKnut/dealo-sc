# Security Implementation Guide

This document describes the comprehensive security measures implemented across the platform.

## Overview

The security implementation includes:
1. ✅ **Authentication Middleware** - Protects all API routes
2. ✅ **Rate Limiting** - Prevents abuse and DDoS attacks
3. ✅ **Role-Based Access Control (RBAC)** - Enforces permissions
4. ✅ **Input Validation** - Validates and sanitizes all user inputs
5. ✅ **Database Query Sanitization** - Prevents NoSQL injection

## 1. Authentication Middleware

### Location
- `lib/middleware/auth.ts`

### Usage

```typescript
import { requireAuth, withAuth } from "@/lib/middleware/auth";

// Simple authentication check
export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  // user.id, user.email, user.role, user.isAdmin are available
  return Response.json({ data: "protected" });
}

// Using wrapper
export const POST = withAuth(async (req, user) => {
  // User is guaranteed to be authenticated
  return { success: true };
});
```

### Features
- ✅ Session validation
- ✅ Email verification check
- ✅ User data extraction
- ✅ Error handling

## 2. Rate Limiting

### Location
- `lib/middleware/rate-limit.ts`

### Pre-configured Limiters

```typescript
import { rateLimiters } from "@/lib/middleware/rate-limit";

// Available limiters:
rateLimiters.strict      // 5 requests/minute
rateLimiters.standard    // 20 requests/minute
rateLimiters.moderate    // 60 requests/minute
rateLimiters.generous    // 100 requests/minute
rateLimiters.upload      // 10 requests/hour
rateLimiters.auth        // 5 requests/15 minutes
```

### Usage

```typescript
import { withRateLimit, rateLimiters } from "@/lib/middleware/rate-limit";

// Apply rate limiting to a route
export const POST = withRateLimit(
  rateLimiters.standard,
  async (req) => {
    // Your handler
    return { success: true };
  }
);
```

### Features
- ✅ LRU cache-based (memory efficient)
- ✅ Per-user and per-IP tracking
- ✅ Configurable limits
- ✅ Rate limit headers in responses

## 3. Role-Based Access Control (RBAC)

### Location
- `lib/middleware/rbac.ts`

### Usage

```typescript
import { requireRole, requireAdmin, withRole } from "@/lib/middleware/rbac";
import { Role } from "@/types/role";

// Require specific roles
export async function GET(req: NextRequest) {
  const user = await requireRole(req, [Role.ADMIN, Role.INSTRUCTOR]);
  // User has one of the required roles
  return Response.json({ data: "authorized" });
}

// Admin-only route
export async function DELETE(req: NextRequest) {
  const user = await requireAdmin(req);
  // User is admin
  return Response.json({ success: true });
}

// Using wrapper
export const PUT = withRole(
  [Role.INSTRUCTOR, Role.ADMIN],
  async (req, user) => {
    // User has required role
    return { success: true };
  }
);
```

### Features
- ✅ Role-based permissions
- ✅ Admin override
- ✅ Ownership checks
- ✅ Custom permission functions

## 4. Input Validation

### Location
- `lib/validation/schemas.ts`
- `lib/middleware/validation.ts`

### Usage

```typescript
import { z } from "zod";
import { validateBody, validateQuery, withValidation } from "@/lib/middleware/validation";

// Define schema
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.nativeEnum(Role),
});

// Validate request body
export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  const body = await validateBody(createUserSchema)(req);
  // body is validated and typed
  return Response.json({ success: true });
}

// Validate query parameters
export async function GET(req: NextRequest) {
  const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  });
  
  const query = validateQuery(querySchema)(req);
  // query is validated and typed
  return Response.json({ data: [] });
}

// Using wrapper
export const POST = withValidation(
  { body: createUserSchema },
  async (req, validated) => {
    // validated.body is already validated
    return { success: true };
  }
);
```

### Pre-built Schemas
- `emailSchema` - Email validation
- `passwordSchema` - Password strength
- `nameSchema` - Name validation
- `phoneSchema` - Phone number
- `urlSchema` - URL validation
- `objectIdSchema` - MongoDB ObjectId
- `paginationSchema` - Pagination params

### Features
- ✅ Zod-based validation
- ✅ Type-safe
- ✅ Automatic error messages
- ✅ String sanitization

## 5. Database Query Sanitization

### Location
- `lib/validation/db-sanitize.ts`

### Usage

```typescript
import { sanitizeFindQuery, sanitizeUpdateQuery, sanitizeObjectId } from "@/lib/validation/db-sanitize";

// Sanitize find query
export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  const rawQuery = { name: req.nextUrl.searchParams.get("name") };
  const sanitized = sanitizeFindQuery(rawQuery);
  // Safe to use in MongoDB query
  const results = await UserModel.find(sanitized);
  return Response.json({ data: results });
}

// Sanitize update query
export async function PATCH(req: NextRequest) {
  const user = await requireAuth(req);
  const body = await req.json();
  const sanitized = sanitizeUpdateQuery(body);
  // Safe to use in MongoDB update
  await UserModel.findByIdAndUpdate(user.id, sanitized);
  return Response.json({ success: true });
}

// Sanitize ObjectId
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const objectId = sanitizeObjectId(params.id);
  if (!objectId) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  const result = await UserModel.findById(objectId);
  return Response.json({ data: result });
}
```

### Features
- ✅ Prevents NoSQL injection
- ✅ ObjectId validation
- ✅ Operator filtering
- ✅ Recursive sanitization

## 6. Combined Middleware

### Location
- `lib/middleware/index.ts`

### Usage

```typescript
import { createProtectedHandler } from "@/lib/middleware";
import { Role } from "@/types/role";

// All-in-one security middleware
export const POST = createProtectedHandler(
  async (req, user) => {
    // User is authenticated, authorized, and rate-limited
    // Your handler logic
    return { success: true };
  },
  {
    allowedRoles: [Role.ADMIN, Role.INSTRUCTOR],
    rateLimit: "standard",
    requireEmailVerification: true,
  }
);
```

## Implementation Checklist

### For New API Routes

- [ ] Add authentication: `requireAuth(req)`
- [ ] Add rate limiting: `withRateLimit(rateLimiters.standard, handler)`
- [ ] Add RBAC if needed: `requireRole(req, [Role.ADMIN])`
- [ ] Validate inputs: `validateBody(schema)(req)`
- [ ] Sanitize queries: `sanitizeFindQuery(query)`
- [ ] Use `createProtectedHandler` for comprehensive protection

### For Existing API Routes

1. Import security middleware
2. Replace manual auth checks with `requireAuth`
3. Add rate limiting
4. Add input validation
5. Sanitize database queries
6. Test thoroughly

## Examples

See `examples/secure-api-route.example.ts` for comprehensive examples of:
- Simple protected routes
- Admin-only routes
- Role-based access
- Input validation
- Query sanitization
- Combined middleware usage

## Best Practices

1. **Always authenticate** - Use `requireAuth` for all protected routes
2. **Rate limit everything** - Apply appropriate rate limits based on endpoint sensitivity
3. **Validate inputs** - Never trust user input, always validate
4. **Sanitize queries** - Always sanitize before database operations
5. **Use RBAC** - Enforce role-based permissions
6. **Handle errors** - Return appropriate error responses
7. **Log security events** - Monitor and log authentication failures, rate limit hits, etc.

## Security Headers

Rate limiting middleware automatically adds these headers:
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset timestamp
- `Retry-After` - Seconds until retry (when rate limited)

## Testing

Test your security implementation:

```typescript
// Test authentication
// Should return 401 without valid session

// Test rate limiting
// Make multiple rapid requests, should return 429

// Test RBAC
// Try accessing admin route as non-admin, should return 403

// Test validation
// Send invalid data, should return 400 with error details

// Test sanitization
// Try NoSQL injection, should be sanitized
```

## Migration Guide

### Before
```typescript
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  // No validation, no sanitization
  await UserModel.create(body);
  return NextResponse.json({ success: true });
}
```

### After
```typescript
import { createProtectedHandler } from "@/lib/middleware";
import { validateBody } from "@/lib/middleware/validation";
import { sanitizeFindQuery } from "@/lib/validation/db-sanitize";
import { createUserSchema } from "@/lib/validation/schemas";

export const POST = createProtectedHandler(
  async (req, user) => {
    const body = await validateBody(createUserSchema)(req);
    const sanitized = sanitizeFindQuery(body);
    await UserModel.create(sanitized);
    return { success: true };
  },
  {
    rateLimit: "standard",
    requireEmailVerification: true,
  }
);
```

## Support

For questions or issues with security implementation, refer to:
- `examples/secure-api-route.example.ts` - Comprehensive examples
- `lib/middleware/` - Middleware source code
- `lib/validation/` - Validation utilities



