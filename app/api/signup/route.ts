import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { hash } from "bcryptjs";
import { UserModel } from "@/models/User";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import {
  validateSignupData,
  validateEmail,
  sanitizeString,
} from "@/lib/validation";
import {
  checkRateLimit,
  getRateLimitHeaders,
} from "@/lib/rate-limit";

// Force dynamic rendering to prevent fs module issues
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    if (!requestBody) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting: 5 signups per hour per IP
    const rateLimit = checkRateLimit(
      `signup:${clientIp}`,
      5,
      60 * 60 * 1000 // 1 hour
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message:
            "Too many signup attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: getRateLimitHeaders(0, rateLimit.resetTime),
        }
      );
    }

    // Extract and sanitize required fields
    const firstName = sanitizeString(requestBody.firstName || "");
    const lastName = sanitizeString(requestBody.lastName || "");
    const email = sanitizeString(requestBody.email || "").toLowerCase();
    const password = requestBody.password || "";
    const phone = requestBody.phone ? sanitizeString(requestBody.phone) : undefined;
    const avatar = requestBody.avatar ? sanitizeString(requestBody.avatar) : undefined;

    // Validate all required fields
    const validation = validateSignupData({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    if (!validation.valid) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.errors,
        },
        {
          status: 400,
          headers: getRateLimitHeaders(
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        }
      );
    }

    await connect();

    // Check for existing user with rate limiting
    const emailRateLimit = checkRateLimit(
      `signup-email:${email}`,
      3,
      60 * 60 * 1000 // 3 attempts per hour per email
    );

    if (!emailRateLimit.allowed) {
      return NextResponse.json(
        {
          message:
            "Too many attempts for this email. Please try again later.",
          retryAfter: Math.ceil(
            (emailRateLimit.resetTime - Date.now()) / 1000
          ),
        },
        {
          status: 429,
          headers: getRateLimitHeaders(0, emailRateLimit.resetTime),
        }
      );
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "An account with this email already exists. Please sign in instead.",
          code: 11000,
        },
        {
          status: 409,
          headers: getRateLimitHeaders(
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        }
      );
    }

    const hashedPassword = await hash(password, 10);
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpires = new Date();
    codeExpires.setHours(codeExpires.getHours() + 24); // 24 hours

    const userData: any = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      avatar,
      role: "FREELANCER", // Default role - user can change during complete profile
      dateOfBirth: new Date(1990, 0, 1), // Default DOB - user can update during complete profile
      isCertified: false,
      isVerified: false,
      certificationAttempts: 0,
      isEmailVerified: false,
      emailVerificationCode: verificationCode,
      emailVerificationCodeExpires: codeExpires,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      credits: 5,
      status: "UNVERIFIED", // New users start as unverified
    };

    const newUser = new UserModel(userData);
    await newUser.save();

    // Send verification email immediately after user creation
    try {
      console.log("Sending verification email to:", email);
      const emailResult = await sendVerificationEmail(
        email,
        firstName,
        lastName,
        verificationCode
      );

      if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error);
        // Don't fail the signup, but log the error
      } else {
        console.log("Verification email sent successfully to:", email);
      }
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Don't fail the signup, but log the error
    }

    return NextResponse.json(
      {
        message:
          "Account created successfully! Please check your email for verification code.",
        success: true,
      },
      {
        status: 201,
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Don't expose internal error details in production
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? error.message
        : "An error occurred during signup. Please try again.";

    return NextResponse.json(
      {
        message: "Unable to create account at this time. Please try again later.",
        ...(process.env.NODE_ENV === "development" && {
          details: errorMessage,
        }),
      },
      { status: 500 }
    );
  }
}
