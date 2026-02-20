import { z } from "zod";

/**
 * Pagination utilities for API routes
 */

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
  return paginationSchema.parse({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
    sortBy: searchParams.get("sortBy"),
    sortOrder: searchParams.get("sortOrder") || "desc",
  });
}

/**
 * Calculate skip value for pagination
 */
export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Build sort object from pagination params
 */
export function buildSort(sortBy?: string, sortOrder: "asc" | "desc" = "desc"): Record<string, 1 | -1> {
  if (!sortBy) {
    return { createdAt: sortOrder === "asc" ? 1 : -1 };
  }

  return {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginationResult<T> {
  const totalPages = Math.ceil(total / params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
}

/**
 * Helper function to paginate a Mongoose query
 */
export async function paginateQuery<T>(
  query: any,
  params: PaginationParams
): Promise<{ data: T[]; total: number }> {
  const skip = getSkip(params.page, params.limit);
  const sort = buildSort(params.sortBy, params.sortOrder);

  const [data, total] = await Promise.all([
    query.clone().sort(sort).skip(skip).limit(params.limit).lean().exec(),
    query.countDocuments().exec(),
  ]);

  return { data, total };
}

/**
 * Common pagination defaults
 */
export const paginationDefaults = {
  page: 1,
  limit: 10,
  maxLimit: 100,
  sortOrder: "desc" as const,
};



