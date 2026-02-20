import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { Role } from "@/types/role";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: Role;
    isAdmin: boolean;
    isEmailVerified: boolean;
  };
}

/**
 * Authentication middleware for API routes
 * Ensures the user is authenticated before accessing protected routes
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ id: string; email: string; role: Role; isAdmin: boolean; isEmailVerified: boolean }> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required");
  }

  if (!session.user.id || !session.user.email) {
    throw new Error("Unauthorized: Invalid session data");
  }

  return {
    id: session.user.id,
    email: session.user.email,
    role: (session.user.role as Role) || Role.STUDENT,
    isAdmin: session.user.isAdmin || false,
    isEmailVerified: session.user.isEmailVerified || false,
  };
}

/**
 * Wrapper for API route handlers that require authentication
 */
export function withAuth<T = any>(
  handler: (req: NextRequest, user: Awaited<ReturnType<typeof requireAuth>>, ...args: any[]) => Promise<T>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse<T | { error: string }>> => {
    try {
      const user = await requireAuth(req);
      const result = await handler(req, user, ...args);
      return NextResponse.json(result);
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Check if user email is verified
 */
export async function requireEmailVerification(req: NextRequest) {
  const user = await requireAuth(req);
  
  if (!user.isEmailVerified) {
    throw new Error("Email verification required");
  }
  
  return user;
}

/**
 * Wrapper for API route handlers that require email verification
 */
export function withEmailVerification<T = any>(
  handler: (req: NextRequest, user: Awaited<ReturnType<typeof requireEmailVerification>>, ...args: any[]) => Promise<T>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse<T | { error: string }>> => {
    try {
      const user = await requireEmailVerification(req);
      const result = await handler(req, user, ...args);
      return NextResponse.json(result);
    } catch (error: any) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
      if (error.message.includes("Email verification")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      console.error("Email verification middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}



