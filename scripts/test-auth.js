#!/usr/bin/env node

/**
 * Authentication Test Script
 * This script tests the authentication configuration
 */

require("dotenv").config({ path: ".env.local" });

async function testAuth() {
  console.log("🔍 Testing Authentication Configuration...\n");

  try {
    // Test 1: Check OAuth configuration
    console.log("🔧 OAuth Configuration:");
    console.log(
      `✅ Google Client ID: ${
        process.env.GOOGLE_CLIENT_ID ? "Configured" : "Missing"
      }`
    );
    console.log(
      `✅ Google Client Secret: ${
        process.env.GOOGLE_CLIENT_SECRET ? "Configured" : "Missing"
      }`
    );
    console.log(
      `✅ LinkedIn Client ID: ${
        process.env.LINKEDIN_CLIENT_ID ? "Configured" : "Missing"
      }`
    );
    console.log(
      `✅ LinkedIn Client Secret: ${
        process.env.LINKEDIN_CLIENT_SECRET ? "Configured" : "Missing"
      }`
    );
    console.log(
      `✅ NextAuth Secret: ${
        process.env.NEXTAUTH_SECRET ? "Configured" : "Missing"
      }`
    );
    console.log(
      `✅ NextAuth URL: ${process.env.NEXTAUTH_URL || "Auto-detection"}`
    );

    // Test 2: Check database configuration
    console.log("\n🗄️ Database Configuration:");
    console.log(
      `✅ MongoDB URL: ${process.env.MONGODB_URL ? "Configured" : "Missing"}`
    );
    console.log(
      `✅ MongoDB CA Cert: ${
        process.env.MONGODB_CA_CERT ? "Configured" : "Missing"
      }`
    );

    // Test 3: Check if all required variables are present
    const requiredVars = {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
      LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      MONGODB_URL: process.env.MONGODB_URL,
    };

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.log("\n❌ Missing Environment Variables:");
      missingVars.forEach((varName) => {
        console.log(`   - ${varName}`);
      });
      console.log(
        "\n🔧 Please add the missing variables to your .env.local file"
      );
    } else {
      console.log("\n✅ All required environment variables are configured!");
    }

    // Test 4: Check NextAuth secret length
    if (process.env.NEXTAUTH_SECRET) {
      const secretLength = process.env.NEXTAUTH_SECRET.length;
      if (secretLength >= 32) {
        console.log(
          `✅ NextAuth Secret length: ${secretLength} characters (Good)`
        );
      } else {
        console.log(
          `⚠️ NextAuth Secret length: ${secretLength} characters (Should be 32+)`
        );
      }
    }

    console.log("\n📝 Authentication Status Summary:");
    if (missingVars.length === 0) {
      console.log("✅ OAuth is properly configured");
      console.log("✅ Database connection should work");
      console.log("✅ Email/password authentication should work");
      console.log("✅ OAuth sign-in should work");
    } else {
      console.log("❌ Some configuration is missing");
      console.log("❌ Authentication may not work properly");
    }

    console.log("\n🚀 Next Steps:");
    console.log("1. Start your development server: npm run dev");
    console.log("2. Try signing in with existing credentials");
    console.log("3. Try OAuth sign-in with Google/LinkedIn");
    console.log("4. Try creating a new account");
    console.log("5. Check browser console and server logs for any errors");
  } catch (error) {
    console.error("❌ Authentication test failed:", error.message);
    console.error("\n🔧 Troubleshooting:");
    console.error("1. Check your .env.local file");
    console.error("2. Verify your environment variables");
    console.error("3. Check the server logs for more details");
  }
}

testAuth();
