import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import mongoose from "mongoose";

// Contact form submission schema
const contactFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    subject: { type: String, default: "General Inquiry" },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
    },
  },
  { timestamps: true }
);

const ContactForm =
  mongoose.models.ContactForm ||
  mongoose.model("ContactForm", contactFormSchema);

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    const { name, email, message, subject } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create contact form submission
    const contactSubmission = await ContactForm.create({
      name,
      email,
      message,
      subject: subject || "General Inquiry",
      status: "new",
      metadata: {
        userAgent: req.headers.get("user-agent") || "",
        ipAddress:
          req.headers.get("x-forwarded-for") ||
          req.headers.get("x-real-ip") ||
          "",
        referrer: req.headers.get("referer") || "",
      },
    });

    // Send email notification asynchronously
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "dealogroupincorporated@gmail.com",
        subject: `New Contact Form Submission: ${subject || "General Inquiry"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">New Contact Form Submission</h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Submitted on ${new Date().toLocaleString()}
            </p>
          </div>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject || "General Inquiry"}

Message:
${message}

Submitted on ${new Date().toLocaleString()}
        `,
      }),
    }).catch((err) => console.error("Failed to send contact email:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting us! We'll get back to you soon.",
        id: contactSubmission._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    const submissions = await ContactForm.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await ContactForm.countDocuments();

    return NextResponse.json({
      submissions,
      total,
      limit,
      skip,
    });
  } catch (error: any) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact submissions", details: error.message },
      { status: 500 }
    );
  }
}

