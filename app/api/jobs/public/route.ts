import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobModel } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Function to send job verification email
async function sendJobVerificationEmail(
  email: string,
  companyName: string,
  verificationUrl: string,
  jobTitle: string
) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo-container { margin-bottom: 15px; }
            .logo { width: 60px; height: auto; opacity: 0.9; filter: brightness(0) invert(1); }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; padding: 20px; }
            .footer-logo { width: 40px; height: auto; opacity: 0.3; margin: 10px auto; display: block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <img src="https://pub-734ce1bac5434727ba9692dacb3d7441.r2.dev/logos/dealo-new.png" alt="Dealo Logo" class="logo" />
              </div>
              <h1 style="margin: 0; font-size: 24px;">Verify Your Job Listing</h1>
            </div>
            <div class="content">
              <p>Hello ${companyName},</p>
              <p>Thank you for posting your job listing "<strong>${jobTitle}</strong>" on Dealo.</p>
              <p>To publish your job listing and make it visible to candidates, please verify your email by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify & Publish Job</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create this job listing, please ignore this email.</p>
            </div>
            <div class="footer">
              <img src="https://pub-734ce1bac5434727ba9692dacb3d7441.r2.dev/logos/dealo-new.png" alt="Dealo" class="footer-logo" />
              <p>© ${new Date().getFullYear()} Dealo Talent Network. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Dealo Talent Network" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Job Listing - Dealo Talent Network",
      html: html,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending job verification email:", error);
    return { success: false, error: "Failed to send verification email." };
  }
}

export async function POST(request: NextRequest) {
  try {
    await connect();
    const session = await getServerSession({ req: request, ...authOptions });

    // Parse the job data from the request body
    const jobInput = await request.json();

    // Check if user is authenticated
    const isAuthenticated = session && session.user;

    let postedBy: string;
    let contactEmail: string | undefined;
    let companyName: string | undefined;
    let verificationToken: string | undefined;
    let requiresVerification = false;

    if (isAuthenticated) {
      // Authenticated user - use their ID
      postedBy = session.user.id;
    } else {
      // Unauthenticated user - require email and company name
      if (!jobInput.contactEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "Email is required for unauthenticated users",
          },
          { status: 400 }
        );
      }
      if (!jobInput.companyName) {
        return NextResponse.json(
          {
            success: false,
            message: "Company name is required for unauthenticated users",
          },
          { status: 400 }
        );
      }

      contactEmail = jobInput.contactEmail;
      companyName = jobInput.companyName;

      // Generate verification token
      verificationToken = crypto.randomBytes(32).toString("hex");
      requiresVerification = true;

      // For unauthenticated users, we don't set postedBy
      // The job will be identified by contactEmail and verificationToken
      postedBy = undefined as any;
    }

    // Normalize phone number to E.164 format
    // Remove spaces, dashes, parentheses but keep the + sign
    const normalizePhoneNumber = (phone: string | undefined): string => {
      if (!phone) return "";
      // Ensure it's a string and trim it
      const phoneStr = String(phone).trim();
      if (!phoneStr) return "";
      // Remove all formatting characters (spaces, dashes, parentheses) but keep the + sign
      const cleaned = phoneStr.replace(/[\s\-\(\)]/g, "");
      // react-phone-number-input already provides E.164 format, so we just clean formatting
      // Ensure it's a valid format before returning
      if (cleaned.startsWith("+")) {
        // E.164 format - validate it has 1-15 digits after +
        const digitsAfterPlus = cleaned.substring(1);
        if (digitsAfterPlus.length >= 1 && digitsAfterPlus.length <= 15) {
          return cleaned;
        }
      }
      // If it doesn't start with +, return as is (will be validated by schema)
      return cleaned;
    };

    // Prepare job data
    const jobData: any = {
      title: jobInput.title || "Untitled Job",
      description: jobInput.description || "No description provided",
      jobIcon: jobInput.jobIcon || "",
      skillsRequired: jobInput.skillsRequired || [],
      budget: jobInput.budget || 0,
      deadline: jobInput.deadline ? new Date(jobInput.deadline) : null,
      country: jobInput.country?.value || jobInput.country || "Unknown Country",
      remote: jobInput.remote === "remote" || jobInput.remote === "true",
      category: jobInput.category || "Jobs",
      isRemote: jobInput.remote === "remote" || jobInput.remote === "true",
      experienceRequired: jobInput.experienceRequired || "Not specified",
      location: jobInput.location || jobInput.state || "Unknown location",
      status: requiresVerification ? "Pending Verification" : "Active", // Active jobs appear in listings
      contactPhone: normalizePhoneNumber(jobInput.contactPhone),
      contactPhoto: jobInput.contactPhoto || "",
      type: jobInput.type || "full-time",
      city: jobInput.city || "",
    };

    // Only add postedBy if user is authenticated
    if (postedBy) {
      jobData.postedBy = postedBy;
    }

    // Add organizationId/company if provided (for authenticated users with company)
    if (jobInput.organizationId) {
      jobData.organizationId = jobInput.organizationId;
      jobData.company = jobInput.organizationId; // Also set company field as alias
    }

    // Add unauthenticated user fields if applicable
    if (!isAuthenticated && contactEmail) {
      jobData.contactEmail = contactEmail;
      jobData.companyName = companyName;
      jobData.verificationToken = verificationToken;
      jobData.isEmailVerified = false;
    }

    // Create and save the new job
    const newJob = new JobModel(jobData);

    // Debug: Log phone number before save
    if (jobData.contactPhone) {
      console.log("Phone number before save:", jobData.contactPhone);
      console.log("Phone number type:", typeof jobData.contactPhone);
    }

    const savedJob = await newJob.save();

    // Send verification email for unauthenticated users
    if (!isAuthenticated && contactEmail && verificationToken) {
      try {
        // Get the base URL - prioritize environment variables, then try to detect from request
        let baseUrl =
          process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL;

        // If no env var is set, try to construct from request (for Netlify/production)
        if (!baseUrl && typeof window === "undefined") {
          // Server-side: try to get from request headers
          const protocol = request.headers.get("x-forwarded-proto") || "https";
          const host =
            request.headers.get("x-forwarded-host") ||
            request.headers.get("host");
          if (host) {
            baseUrl = `${protocol}://${host}`;
          }
        }

        // Clean the base URL: remove trailing slashes and ensure it's a valid URL
        if (baseUrl) {
          baseUrl = baseUrl.trim().replace(/\/+$/, ""); // Remove trailing slashes
        }

        // Fallback to localhost for development only
        baseUrl = baseUrl || "http://localhost:3000";

        const verificationUrl = `${baseUrl}/employment/verify-job?token=${verificationToken}&jobId=${savedJob._id}`;

        // Send job verification email with link
        const emailResult = await sendJobVerificationEmail(
          contactEmail,
          companyName || "Employer",
          verificationUrl,
          savedJob.title
        );

        if (!emailResult.success) {
          console.error(
            "Failed to send verification email:",
            emailResult.error
          );
          // Don't fail the job creation, but log the error
        }
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        // Don't fail the job creation
      }
    }

    return NextResponse.json(
      {
        success: true,
        job: savedJob,
        requiresVerification: requiresVerification,
        message: requiresVerification
          ? "Job created successfully. Please check your email to verify and publish your listing."
          : "Job created successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create job",
      },
      { status: 500 }
    );
  }
}
