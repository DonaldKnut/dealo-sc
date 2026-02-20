import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import mongoose from "mongoose";

// Bulk Hiring Request Schema
const bulkHiringRequestSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  industry: { type: String, required: true },
  teamSize: { type: String, required: true },
  hiringType: {
    type: String,
    enum: ["full-time", "project-based", "contract", "outsourcing"],
    required: true,
  },
  budget: { type: String },
  timeline: { type: String, required: true },
  skills: { type: String, required: true },
  description: { type: String, required: true },
  package: { type: String },
  status: {
    type: String,
    enum: ["pending", "reviewing", "approved", "rejected"],
    default: "pending",
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create or get existing model
const BulkHiringRequest =
  mongoose.models.BulkHiringRequest ||
  mongoose.model("BulkHiringRequest", bulkHiringRequestSchema);

// POST - Submit a new bulk hiring request
export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "companyName",
      "contactName",
      "email",
      "phone",
      "industry",
      "teamSize",
      "hiringType",
      "timeline",
      "skills",
      "description",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create new request
    const newRequest = await BulkHiringRequest.create({
      ...body,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send email notifications asynchronously (don't wait for them)
    const requestData = newRequest.toObject();

    // Send confirmation email to client
    fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/email/bulk-hiring/client`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: requestData }),
      }
    ).catch((err) => console.error("Failed to send client email:", err));

    // Send notification to admin
    fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/email/bulk-hiring/admin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: requestData }),
      }
    ).catch((err) => console.error("Failed to send admin email:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Bulk hiring request submitted successfully",
        requestId: newRequest._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting bulk hiring request:", error);
    return NextResponse.json(
      { error: "Failed to submit request", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all bulk hiring requests (admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin (you may need to adjust this based on your auth setup)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query = status ? { status } : {};

    const requests = await BulkHiringRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(requests, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching bulk hiring requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests", details: error.message },
      { status: 500 }
    );
  }
}
