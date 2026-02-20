import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Validation middleware for API routes
 */

/**
 * Validate request body with Zod schema
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return async (req: NextRequest): Promise<T> => {
    try {
      const body = await req.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`
        );
      }
      throw error;
    }
  };
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: NextRequest): T => {
    try {
      const params = Object.fromEntries(new URL(req.url).searchParams.entries());
      return schema.parse(params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`
        );
      }
      throw error;
    }
  };
}

/**
 * Validate route parameters with Zod schema
 */
export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (params: Record<string, string | string[] | undefined>): T => {
    try {
      return schema.parse(params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`
        );
      }
      throw error;
    }
  };
}

/**
 * Wrapper for API route handlers with validation
 */
export function withValidation<TBody = any, TQuery = any, TParams = any>(
  options: {
    body?: z.ZodSchema<TBody>;
    query?: z.ZodSchema<TQuery>;
    params?: z.ZodSchema<TParams>;
  },
  handler: (
    req: NextRequest,
    validated: {
      body?: TBody;
      query?: TQuery;
      params?: TParams;
    },
    ...args: any[]
  ) => Promise<any>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      const validated: any = {};

      if (options.body) {
        validated.body = await validateBody(options.body)(req);
      }

      if (options.query) {
        validated.query = validateQuery(options.query)(req);
      }

      if (options.params && args[0]) {
        validated.params = validateParams(options.params)(args[0]);
      }

      const result = await handler(req, validated, ...args);
      return NextResponse.json(result);
    } catch (error: any) {
      if (error.message.includes("Validation error")) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      console.error("Validation middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}



