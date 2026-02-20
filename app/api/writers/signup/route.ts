import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/database";
import { WriterModel } from "@/models/Writer";
import crypto from "crypto";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      writingExperience,
      writingCategories,
      portfolioUrl,
    } = body;

    // Check if writer already exists
    const existingWriter = await WriterModel.findOne({ email });
    if (existingWriter) {
      return NextResponse.json(
        { message: "A writer with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24 hours

    // Create new writer
    const newWriter = new WriterModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      writingExperience,
      writingCategories,
      portfolioUrl: portfolioUrl || "",
      status: "pending", // pending, approved, rejected
      isActive: false,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationTokenExpires: tokenExpires,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newWriter.save();

    // Send email verification
    try {
      const templatePath = path.resolve(
        "email-templates",
        "writer-verification.ejs"
      );
      const html = await ejs.renderFile(templatePath, {
        firstName,
        email,
        verificationUrl: `${process.env.NEXTAUTH_URL}/writers/verify-email?token=${emailVerificationToken}`,
        logoUrl:
          "https://pub-734ce1bac5434727ba9692dacb3d7441.r2.dev/logos/dealo-new.png",
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Dealo Talent Network" <${
          process.env.EMAIL_FROM ?? "no-reply@dealonetwork.com"
        }>`,
        to: email,
        subject: "📧 Verify Your Email - Dealo Writers Program",
        html,
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't fail the signup, but log the error
    }

    return NextResponse.json(
      {
        message:
          "Writer application submitted successfully. Please check your email to verify your account.",
        writerId: newWriter._id,
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Writer signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
