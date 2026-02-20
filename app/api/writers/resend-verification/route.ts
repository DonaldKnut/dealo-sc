import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { WriterModel } from "@/models/Writer";
import crypto from "crypto";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connect();

    const writer = await WriterModel.findOne({ email });

    if (!writer) {
      return NextResponse.json(
        { message: "Writer not found" },
        { status: 404 }
      );
    }

    if (writer.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 24); // 24 hours

    // Update writer with new token
    writer.emailVerificationToken = emailVerificationToken;
    writer.emailVerificationTokenExpires = tokenExpires;
    await writer.save();

    // Send verification email
    const templatePath = path.resolve(
      "email-templates",
      "writer-verification.ejs"
    );
    const html = await ejs.renderFile(templatePath, {
      firstName: writer.firstName,
      email: writer.email,
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

    return NextResponse.json({
      message: "Verification email sent successfully",
      email,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
