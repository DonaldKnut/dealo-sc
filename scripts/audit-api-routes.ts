/**
 * API Route Security Audit Script
 * 
 * This script audits all API routes for:
 * 1. Authentication checks
 * 2. Rate limiting
 * 3. Sensitive data exposure
 * 
 * Run with: npx tsx scripts/audit-api-routes.ts
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

interface RouteAudit {
  path: string;
  hasAuth: boolean;
  hasRateLimit: boolean;
  exposesSensitiveData: boolean;
  methods: string[];
  issues: string[];
}

const sensitiveDataPatterns = [
  /password/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /\.password/,
  /\.secret/,
  /\.token/,
  /\.apiKey/,
  /\.privateKey/,
];

function findRouteFiles(dir: string, basePath: string = ""): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = join(basePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...findRouteFiles(fullPath, relativePath));
    } else if (entry.name === "route.ts" || entry.name === "route.js") {
      files.push(fullPath);
    }
  }

  return files;
}

function auditRoute(filePath: string): RouteAudit {
  const content = readFileSync(filePath, "utf-8");
  const relativePath = filePath
    .replace(process.cwd(), "")
    .replace(/\\/g, "/")
    .replace(/^\/app/, "/api")
    .replace(/\/route\.(ts|js)$/, "");

  const issues: string[] = [];
  let hasAuth = false;
  let hasRateLimit = false;
  let exposesSensitiveData = false;

  // Check for authentication
  const authPatterns = [
    /requireAuth/i,
    /withAuth/i,
    /getServerSession/i,
    /session\?\.user/i,
  ];
  hasAuth = authPatterns.some((pattern) => pattern.test(content));

  // Check for rate limiting
  const rateLimitPatterns = [
    /rateLimit/i,
    /withRateLimit/i,
    /rateLimiters/i,
    /checkRateLimit/i,
  ];
  hasRateLimit = rateLimitPatterns.some((pattern) => pattern.test(content));

  // Check for sensitive data exposure
  const responsePatterns = [
    /Response\.json\([^)]*password/i,
    /Response\.json\([^)]*secret/i,
    /Response\.json\([^)]*token/i,
    /\.json\([^)]*\.password/i,
    /\.json\([^)]*\.secret/i,
    /\.json\([^)]*\.token/i,
    /return.*password/i,
    /return.*secret/i,
    /return.*token/i,
  ];
  exposesSensitiveData = responsePatterns.some((pattern) =>
    pattern.test(content)
  );

  // Detect HTTP methods
  const methods: string[] = [];
  if (/export\s+(async\s+)?function\s+GET/i.test(content)) methods.push("GET");
  if (/export\s+(async\s+)?function\s+POST/i.test(content)) methods.push("POST");
  if (/export\s+(async\s+)?function\s+PUT/i.test(content)) methods.push("PUT");
  if (/export\s+(async\s+)?function\s+PATCH/i.test(content)) methods.push("PATCH");
  if (/export\s+(async\s+)?function\s+DELETE/i.test(content)) methods.push("DELETE");

  // Identify issues
  if (!hasAuth && methods.length > 0) {
    // Skip public routes
    const publicRoutes = [
      "/api/signup",
      "/api/verify-email",
      "/api/resend-verification",
      "/api/contact",
      "/api/webhooks",
      "/api/auth",
      "/api/writers/signup",
      "/api/writers/login",
      "/api/bulk-hiring/request",
    ];
    const isPublic = publicRoutes.some((route) =>
      relativePath.includes(route)
    );
    if (!isPublic) {
      issues.push("Missing authentication");
    }
  }

  if (!hasRateLimit && methods.length > 0) {
    issues.push("Missing rate limiting");
  }

  if (exposesSensitiveData) {
    issues.push("May expose sensitive data");
  }

  // Check for direct user data return without filtering
  if (
    /UserModel\.find/i.test(content) &&
    !/\.select\(/i.test(content) &&
    !/\.lean\(\)/i.test(content)
  ) {
    issues.push("May return full user document (should use .select() to filter fields)");
  }

  return {
    path: relativePath,
    hasAuth,
    hasRateLimit,
    exposesSensitiveData,
    methods,
    issues,
  };
}

function main() {
  const apiDir = join(process.cwd(), "app", "api");
  const routeFiles = findRouteFiles(apiDir);

  console.log(`\n🔍 Auditing ${routeFiles.length} API routes...\n`);

  const audits: RouteAudit[] = routeFiles.map(auditRoute);

  const routesWithIssues = audits.filter((a) => a.issues.length > 0);
  const routesWithoutAuth = audits.filter(
    (a) => !a.hasAuth && a.issues.includes("Missing authentication")
  );
  const routesWithoutRateLimit = audits.filter(
    (a) => !a.hasRateLimit && a.issues.includes("Missing rate limiting")
  );
  const routesExposingData = audits.filter((a) => a.exposesSensitiveData);

  console.log("📊 Audit Summary:\n");
  console.log(`Total routes: ${audits.length}`);
  console.log(`Routes with issues: ${routesWithIssues.length}`);
  console.log(`Routes without auth: ${routesWithoutAuth.length}`);
  console.log(`Routes without rate limiting: ${routesWithoutRateLimit.length}`);
  console.log(`Routes exposing sensitive data: ${routesExposingData.length}\n`);

  if (routesWithoutAuth.length > 0) {
    console.log("❌ Routes Missing Authentication:\n");
    routesWithoutAuth.forEach((route) => {
      console.log(`  - ${route.path} (${route.methods.join(", ")})`);
    });
    console.log();
  }

  if (routesWithoutRateLimit.length > 0) {
    console.log("⚠️  Routes Missing Rate Limiting:\n");
    routesWithoutRateLimit.slice(0, 20).forEach((route) => {
      console.log(`  - ${route.path} (${route.methods.join(", ")})`);
    });
    if (routesWithoutRateLimit.length > 20) {
      console.log(`  ... and ${routesWithoutRateLimit.length - 20} more`);
    }
    console.log();
  }

  if (routesExposingData.length > 0) {
    console.log("🚨 Routes Potentially Exposing Sensitive Data:\n");
    routesExposingData.forEach((route) => {
      console.log(`  - ${route.path}`);
      console.log(`    Issues: ${route.issues.join(", ")}`);
    });
    console.log();
  }

  // Generate fix recommendations
  console.log("💡 Recommendations:\n");
  console.log("1. Add authentication to all protected routes using requireAuth()");
  console.log("2. Add rate limiting using withRateLimit() or createProtectedHandler()");
  console.log("3. Use .select() to filter sensitive fields from user documents");
  console.log("4. Review routes exposing sensitive data and sanitize responses");
  console.log("\nSee SECURITY_IMPLEMENTATION.md for implementation details.\n");
}

if (require.main === module) {
  main();
}

export { auditRoute, findRouteFiles };



