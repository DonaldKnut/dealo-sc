/**
 * Barrel export for all library utilities
 * Import utilities from here: import { cn, formatDateTime, handleError } from "@/lib"
 */

// Core utilities
export * from "./utils";
export * from "./utils/common";

// Re-export common utilities from utils/common
export {
  isEmpty,
  deepMerge,
  sleep,
  retry,
  truncate,
  capitalize,
  generateId,
  isBrowser,
  isServer,
  safeJsonParse,
  groupBy,
  debounce,
  throttle,
} from "./utils/common";

// Formatting utilities
export * from "./formatDate";
export * from "./formatPrice";

// Database utilities
export * from "./db/cache";
export * from "./db/pagination";
export * from "./db/query-helpers";

// Middleware
export * from "./middleware";

// Validation
export * from "./validation/schemas";
export * from "./validation/db-sanitize";

// Auth utilities
export * from "./auth";
export * from "./auth-utils";
export * from "./session";

// Cloudflare utilities
export * from "./cloudflareImages";
export * from "./cloudflareStreamUtils";
export * from "./cloudflareStreamHelpers";

// R2 utilities
export * from "./r2";

// Email utilities
export * from "./email";
export * from "./sendEmail";

// JWT utilities
export * from "./jwt";

// SEO utilities
export * from "./seo";
export * from "./global-keywords";
export * from "./nigerian-keywords";

// Payment utilities
export * from "./payments/providers";
export * from "./stripe";

// API utilities
export * from "./api/client";

// Other utilities
export * from "./userStatus";
export * from "./socket";

