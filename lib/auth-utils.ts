/**
 * OAuth Configuration Validation and Utility Functions
 * This file provides utilities for validating OAuth configuration and handling OAuth-related operations.
 */

/**
 * Validates that all required OAuth environment variables are present
 * @throws {Error} If required OAuth variables are missing
 */
export function validateOAuthConfig(): void {
  const requiredVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // LinkedIn disabled at user request
    // LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    // LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required OAuth environment variables: ${missingVars.join(", ")}`
    );
  }
}

/**
 * Gets OAuth provider configuration
 * @param provider - The OAuth provider ('google' or 'linkedin')
 * @returns Provider configuration object
 */
export function getOAuthProviderConfig(provider: "google" | "linkedin") {
  switch (provider) {
    case "google":
      return {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: { scope: "profile email" },
        },
      };
    /*
    case "linkedin":
      return {
        clientId: process.env.LINKEDIN_CLIENT_ID!,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        authorization: {
          params: { scope: "r_liteprofile r_emailaddress" },
        },
      };
    */
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
}

/**
 * Formats OAuth error messages for user display
 * @param error - The OAuth error object
 * @returns Formatted error message
 */
export function formatOAuthError(error: any): string {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error) {
    switch (error.error) {
      case "OAuthCallback":
        return "OAuth authentication failed. Please try again.";
      case "AccessDenied":
        return "Access was denied. Please try signing in again.";
      case "Configuration":
        return "OAuth configuration error. Please contact support.";
      case "Verification":
        return "Email verification failed. Please check your email.";
      default:
        return `Authentication error: ${error.error}`;
    }
  }

  return "An unexpected error occurred during authentication.";
}

/**
 * Checks if a provider is a valid OAuth provider
 * @param provider - The provider to check
 * @returns True if valid OAuth provider
 */
export function isOAuthProvider(
  provider: string
): provider is "google" {
  return ["google"].includes(provider);
}

/**
 * Validates OAuth callback URL
 * @param url - The callback URL to validate
 * @returns True if valid callback URL
 */
export function isValidCallbackUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const allowedHosts = [
      "localhost",
      "127.0.0.1",
      "dealo.com",
      "www.dealo.com",
      "api.dealo.com",
    ];

    return allowedHosts.some(
      (host) =>
        parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

/**
 * Generates OAuth state parameter for CSRF protection
 * @returns Random state string
 */
export function generateOAuthState(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Validates OAuth state parameter
 * @param state - The state parameter to validate
 * @param expectedState - The expected state value
 * @returns True if state is valid
 */
export function validateOAuthState(
  state: string,
  expectedState: string
): boolean {
  return state === expectedState;
}

/**
 * Extracts user information from OAuth profile
 * @param profile - The OAuth profile object
 * @param provider - The OAuth provider
 * @returns Extracted user information
 */
export function extractUserFromOAuthProfile(
  profile: any,
  provider: "google"
) {
  switch (provider) {
    case "google":
      return {
        email: profile.email,
        name: profile.name,
        image: profile.picture,
        firstName: profile.given_name || profile.name?.split(" ")[0] || "User",
        lastName:
          profile.family_name ||
          profile.name?.split(" ").slice(1).join(" ") ||
          "User",
      };
    /*
    case "linkedin":
      return {
        email: profile.email,
        name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
        image:
          profile.profilePicture?.["displayImage~"]?.elements?.[0]
            ?.identifiers?.[0]?.identifier,
        firstName: profile.localizedFirstName || "User",
        lastName: profile.localizedLastName || "User",
      };
    */
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
}

/**
 * Logs OAuth events for debugging and monitoring
 * @param event - The OAuth event type
 * @param data - Additional event data
 */
export function logOAuthEvent(event: string, data?: any): void {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    event,
    data,
    environment: process.env.NODE_ENV,
  };

  if (process.env.NODE_ENV === "development") {
    console.log("OAuth Event:", logData);
  }

  // In production, you might want to send this to a logging service
  // like Winston, Sentry, or CloudWatch
}

/**
 * Checks if OAuth is properly configured for the current environment
 * @returns True if OAuth is configured
 */
export function isOAuthConfigured(): boolean {
  try {
    validateOAuthConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets OAuth configuration status for debugging
 * @returns Object with configuration status
 */
export function getOAuthConfigStatus(): {
  isConfigured: boolean;
  missingVars: string[];
  providers: "google"[];
} {
  const requiredVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    // LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  const providers: "google"[] = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push("google");
  }
  /*
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    providers.push("linkedin");
  }
  */

  return {
    isConfigured: missingVars.length === 0,
    missingVars,
    providers,
  };
}

/**
 * Validates all required environment variables for the authentication system
 * This should be called at startup to ensure everything is configured correctly
 */
export function validateAuthEnvironment() {
  const requiredVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    MONGODB_URL: process.env.MONGODB_URL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars);
    console.error(
      "Please check your .env.local file and ensure all variables are set."
    );
    return false;
  }

  // Validate OAuth configuration
  const hasGoogleOAuth = !!(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const hasLinkedInOAuth = !!(
    process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
  );

  console.log("✅ Environment validation passed");
  console.log("📧 Email configuration:", {
    user: process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASS,
  });
  console.log("🔐 OAuth providers:", {
    google: hasGoogleOAuth ? "✅ Configured" : "❌ Missing",
    // linkedin: hasLinkedInOAuth ? "✅ Configured" : "❌ Missing",
  });
  console.log(
    "🗄️ Database:",
    process.env.MONGODB_URL ? "✅ Configured" : "❌ Missing"
  );

  return true;
}
