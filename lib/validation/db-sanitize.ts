import { Types } from "mongoose";
import { z } from "zod";

/**
 * Database query sanitization utilities
 * Prevents NoSQL injection and ensures type safety
 */

/**
 * Sanitize MongoDB ObjectId
 */
export function sanitizeObjectId(id: string | Types.ObjectId | undefined | null): Types.ObjectId | null {
  if (!id) return null;
  
  if (id instanceof Types.ObjectId) {
    return id;
  }
  
  if (typeof id === "string") {
    // Validate ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error("Invalid ObjectId format");
    }
    return new Types.ObjectId(id);
  }
  
  throw new Error("Invalid ObjectId type");
}

/**
 * Sanitize array of ObjectIds
 */
export function sanitizeObjectIdArray(ids: (string | Types.ObjectId)[] | undefined | null): Types.ObjectId[] {
  if (!ids || !Array.isArray(ids)) {
    return [];
  }
  
  return ids.map((id) => sanitizeObjectId(id)).filter((id): id is Types.ObjectId => id !== null);
}

/**
 * Sanitize query parameters for MongoDB find operations
 */
export function sanitizeFindQuery<T extends Record<string, any>>(query: T): Partial<T> {
  const sanitized: Partial<T> = {};
  
  for (const key in query) {
    const value = query[key];
    
    // Skip undefined and null values
    if (value === undefined || value === null) {
      continue;
    }
    
    // Handle ObjectId fields
    if (key.endsWith("Id") || key === "_id" || key.endsWith("_id")) {
      try {
        sanitized[key] = sanitizeObjectId(value) as any;
      } catch {
        // Skip invalid ObjectIds
        continue;
      }
      continue;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      if (key.endsWith("Ids") || key.endsWith("_ids")) {
        sanitized[key] = sanitizeObjectIdArray(value) as any;
      } else {
        // Sanitize array elements
        sanitized[key] = value.map((item: any) => {
          if (typeof item === "string") {
            return sanitizeString(item);
          }
          return item;
        }) as any;
      }
      continue;
    }
    
    // Handle strings
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value) as any;
      continue;
    }
    
    // Handle numbers
    if (typeof value === "number") {
      if (isNaN(value) || !isFinite(value)) {
        continue; // Skip invalid numbers
      }
      sanitized[key] = value;
      continue;
    }
    
    // Handle booleans
    if (typeof value === "boolean") {
      sanitized[key] = value;
      continue;
    }
    
    // Handle dates
    if ((value as any) instanceof Date) {
      sanitized[key] = value as any;
      continue;
    }
    
    // Handle nested objects (recursive)
    if (typeof value === "object") {
      sanitized[key] = sanitizeFindQuery(value) as any;
      continue;
    }
  }
  
  return sanitized;
}

/**
 * Sanitize string to prevent injection
 */
function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .replace(/\$ne|\$gt|\$gte|\$lt|\$lte|\$in|\$nin|\$regex/gi, ""); // Remove MongoDB operators from strings
}

/**
 * Sanitize update query (prevents $ operators injection)
 */
export function sanitizeUpdateQuery<T extends Record<string, any>>(update: T): Partial<T> {
  const sanitized: Partial<T> = {};
  
  for (const key in update) {
    // Prevent MongoDB operator injection
    if (key.startsWith("$")) {
      // Only allow safe update operators
      const allowedOperators = ["$set", "$unset", "$inc", "$push", "$pull", "$addToSet"];
      if (!allowedOperators.includes(key)) {
        continue;
      }
      
      // Recursively sanitize operator values
      if (typeof update[key] === "object" && update[key] !== null) {
        sanitized[key] = sanitizeFindQuery(update[key]) as any;
      }
      continue;
    }
    
    const value = update[key];
    
    // Skip undefined and null values
    if (value === undefined || value === null) {
      continue;
    }
    
    // Handle ObjectId fields
    if (key.endsWith("Id") || key === "_id" || key.endsWith("_id")) {
      try {
        sanitized[key] = sanitizeObjectId(value) as any;
      } catch {
        continue;
      }
      continue;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      sanitized[key] = value.map((item: any) => {
        if (typeof item === "string") {
          return sanitizeString(item);
        }
        if (item instanceof Types.ObjectId || typeof item === "object") {
          return item;
        }
        return item;
      }) as any;
      continue;
    }
    
    // Handle strings
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value) as any;
      continue;
    }
    
    // Handle numbers
    if (typeof value === "number") {
      if (isNaN(value) || !isFinite(value)) {
        continue;
      }
      sanitized[key] = value;
      continue;
    }
    
    // Handle booleans and dates
    if (typeof value === "boolean" || (value as any) instanceof Date) {
      sanitized[key] = value as any;
      continue;
    }
    
    // Handle nested objects
    if (typeof value === "object") {
      sanitized[key] = sanitizeUpdateQuery(value) as any;
      continue;
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize MongoDB query with Zod schema
 */
export function validateAndSanitizeQuery<T>(
  query: Record<string, any>,
  schema: z.ZodSchema<T>
): T {
  // First sanitize the query
  const sanitized = sanitizeFindQuery(query);
  
  // Then validate with Zod
  try {
    return schema.parse(sanitized);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Query validation error: ${error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
    }
    throw error;
  }
}

/**
 * Safe MongoDB query builder
 */
export class SafeQueryBuilder {
  private query: Record<string, any> = {};
  
  equals(field: string, value: string | number | boolean | Types.ObjectId): this {
    if (field.endsWith("Id") || field.endsWith("_id") || field === "_id") {
      this.query[field] = sanitizeObjectId(value as string);
    } else if (typeof value === "string") {
      this.query[field] = sanitizeString(value);
    } else {
      this.query[field] = value;
    }
    return this;
  }
  
  in(field: string, values: (string | Types.ObjectId)[]): this {
    if (field.endsWith("Id") || field.endsWith("_id")) {
      this.query[field] = { $in: sanitizeObjectIdArray(values) };
    } else {
      this.query[field] = { $in: values.map(v => typeof v === "string" ? sanitizeString(v) : v) };
    }
    return this;
  }
  
  regex(field: string, pattern: string, flags?: string): this {
    // Only allow safe regex patterns
    const safePattern = pattern.replace(/[<>]/g, "");
    this.query[field] = { $regex: safePattern, $options: flags || "i" };
    return this;
  }
  
  build(): Record<string, any> {
    return sanitizeFindQuery(this.query);
  }
}



