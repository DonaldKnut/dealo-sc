#!/usr/bin/env node

/**
 * OAuth Configuration Checker
 * This script checks if all required OAuth environment variables are properly configured.
 */

require("dotenv").config({ path: ".env.local" });

const requiredVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

console.log("🔍 Checking OAuth Configuration...\n");

const missingVars = [];
const configuredProviders = [];

// Check each required variable
Object.entries(requiredVars).forEach(([key, value]) => {
  if (!value) {
    missingVars.push(key);
    console.log(`❌ ${key}: Missing`);
  } else {
    console.log(`✅ ${key}: Configured`);

    // Track which providers are configured
    if (key.includes("GOOGLE")) {
      if (!configuredProviders.includes("Google")) {
        configuredProviders.push("Google");
      }
    }
    if (key.includes("LINKEDIN")) {
      if (!configuredProviders.includes("LinkedIn")) {
        configuredProviders.push("LinkedIn");
      }
    }
  }
});

console.log("\n📊 Configuration Summary:");
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(
  `Configured Providers: ${
    configuredProviders.length > 0 ? configuredProviders.join(", ") : "None"
  }`
);

if (missingVars.length > 0) {
  console.log("\n❌ Missing Environment Variables:");
  missingVars.forEach((varName) => {
    console.log(`   - ${varName}`);
  });

  console.log("\n🔧 To fix this, you need to:");
  console.log("1. Create a .env.local file in your project root");
  console.log("2. Add the missing environment variables");
  console.log("3. For Google OAuth:");
  console.log("   - Go to https://console.cloud.google.com/");
  console.log("   - Create a new project or select existing");
  console.log("   - Enable Google+ API");
  console.log("   - Create OAuth 2.0 credentials");
  console.log(
    "   - Add authorized redirect URIs: http://localhost:3000/api/auth/callback/google"
  );
  console.log("4. For LinkedIn OAuth:");
  console.log("   - Go to https://www.linkedin.com/developers/");
  console.log("   - Create a new app");
  console.log(
    "   - Add OAuth 2.0 redirect URLs: http://localhost:3000/api/auth/callback/linkedin"
  );

  process.exit(1);
} else {
  console.log("\n✅ All OAuth environment variables are configured!");
  console.log("🚀 You should be able to use OAuth sign-in now.");

  if (configuredProviders.length > 0) {
    console.log(
      `\n🔗 Configured OAuth Providers: ${configuredProviders.join(", ")}`
    );
  }
}

// Additional checks
console.log("\n🔍 Additional Checks:");

// Check NEXTAUTH_URL
if (process.env.NEXTAUTH_URL) {
  console.log(`✅ NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
} else {
  console.log("⚠️  NEXTAUTH_URL: Not set (will use auto-detection)");
}

// Check NEXTAUTH_SECRET
if (process.env.NEXTAUTH_SECRET) {
  const secretLength = process.env.NEXTAUTH_SECRET.length;
  if (secretLength >= 32) {
    console.log(`✅ NEXTAUTH_SECRET: Configured (${secretLength} characters)`);
  } else {
    console.log(
      `⚠️  NEXTAUTH_SECRET: Too short (${secretLength} characters, recommend 32+)`
    );
  }
} else {
  console.log("❌ NEXTAUTH_SECRET: Missing (required for production)");
}

console.log("\n📝 Next Steps:");
console.log(
  "1. If all variables are configured, restart your development server"
);
console.log("2. Try signing in with OAuth providers");
console.log("3. Check the browser console and server logs for any errors");
console.log(
  '4. If you see "AccessDenied" errors, check your OAuth app settings'
);
