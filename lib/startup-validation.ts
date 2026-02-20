import { validateAuthEnvironment } from "./auth-utils";
import { connect } from "../database";

/**
 * Comprehensive startup validation for the authentication system
 * This should be called when the app starts to ensure everything is working
 */
export async function validateAuthSystem() {
  console.log("🔍 Starting authentication system validation...");

  try {
    // 1. Validate environment variables
    console.log("\n📋 Step 1: Validating environment variables");
    const envValid = validateAuthEnvironment();
    if (!envValid) {
      throw new Error("Environment validation failed");
    }

    // 2. Test database connection
    console.log("\n🗄️ Step 2: Testing database connection");
    await connect();
    console.log("✅ Database connection successful");

    // 3. Test email configuration (optional - only if we want to test email sending)
    console.log("\n📧 Step 3: Email configuration check");
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log("✅ Email credentials found");
      console.log("📧 Email user:", process.env.EMAIL_USER);
    } else {
      console.warn(
        "⚠️ Email credentials not found - email functionality will not work"
      );
    }

    console.log(
      "\n🎉 Authentication system validation completed successfully!"
    );
    return true;
  } catch (error) {
    console.error("\n❌ Authentication system validation failed:", error);
    console.error("Please check your configuration and try again.");
    return false;
  }
}

/**
 * Quick validation for development
 */
export function quickAuthCheck() {
  const required = [
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "MONGODB_URL",
    "EMAIL_USER",
    "EMAIL_PASS",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing);
    return false;
  }

  console.log("✅ Quick auth check passed");
  return true;
}
