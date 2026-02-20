/**
 * Database query helper utilities
 * Ensures consistent use of .lean() and best practices
 */

import { Model, Query, Document } from "mongoose";

/**
 * Execute a read-only query with .lean()
 * Use this for all read operations that don't need Mongoose document methods
 */
export function leanQuery<T extends Document>(
  query: Query<T[], T>
): Query<T[], T> {
  return query.lean();
}

/**
 * Execute a query with field selection
 * Reduces data transfer and improves performance
 */
export function selectFields<T extends Document>(
  query: Query<T[], T>,
  fields: string
): Query<T[], T> {
  return query.select(fields);
}

/**
 * Optimized find query with common optimizations
 */
export async function optimizedFind<T extends Document>(
  model: Model<T>,
  filter: any,
  options: {
    select?: string;
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
    populate?: string | { path: string; select?: string }[];
    lean?: boolean;
  } = {}
): Promise<T[]> {
  let query = model.find(filter);

  if (options.select) {
    query = query.select(options.select);
  }

  if (options.sort) {
    query = query.sort(options.sort);
  }

  if (options.skip !== undefined) {
    query = query.skip(options.skip);
  }

  if (options.limit !== undefined) {
    query = query.limit(options.limit);
  }

  if (options.populate) {
    if (typeof options.populate === "string") {
      query = query.populate(options.populate);
    } else {
      options.populate.forEach((pop) => {
        query = query.populate(pop.path, pop.select);
      });
    }
  }

  // Use lean for read-only queries by default
  if (options.lean !== false) {
    query = query.lean();
  }

  return query.exec();
}

/**
 * Optimized findOne query
 */
export async function optimizedFindOne<T extends Document>(
  model: Model<T>,
  filter: any,
  options: {
    select?: string;
    populate?: string | { path: string; select?: string }[];
    lean?: boolean;
  } = {}
): Promise<T | null> {
  let query = model.findOne(filter);

  if (options.select) {
    query = query.select(options.select);
  }

  if (options.populate) {
    if (typeof options.populate === "string") {
      query = query.populate(options.populate);
    } else {
      options.populate.forEach((pop) => {
        query = query.populate(pop.path, pop.select);
      });
    }
  }

  // Use lean for read-only queries by default
  if (options.lean !== false) {
    query = query.lean();
  }

  return query.exec();
}

/**
 * Count documents efficiently
 */
export async function optimizedCount<T extends Document>(
  model: Model<T>,
  filter: any
): Promise<number> {
  return model.countDocuments(filter).exec();
}

/**
 * Check if documents exist without fetching them
 */
export async function exists<T extends Document>(
  model: Model<T>,
  filter: any
): Promise<boolean> {
  const count = await model.countDocuments(filter).limit(1).exec();
  return count > 0;
}



