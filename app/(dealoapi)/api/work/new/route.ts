import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../../database/index";
import Work from "@/models/Work";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Check if the user is authenticated
    const session = await getServerSession({ req: request, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get the creator's ID from the session
    const creatorId = session.user.id;

    // Validate the creator's ID
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      return NextResponse.json(
        { error: "Invalid creator ID" },
        { status: 400 }
      );
    }

    // Parse and validate the request body
    const formData = await request.json();
    const {
      category,
      title,
      description = "No description provided.",
      price,
      workMedia, // Updated to match the schema
      skills,
      deliveryDate,
      deliveryTime,
      contactInfo, // Updated to match the schema
      languagesSpoken = [],
      experienceLevel = "Junior",
      portfolioLink,
      certifications = [],
    } = formData;

    const missingFields: Record<string, string> = {};

    // Validate required fields
    if (!category) {
      missingFields.category = "Category is required.";
    }
    if (!title) {
      missingFields.title = "Title is required.";
    }
    if (!price || price <= 0) {
      missingFields.price = "Price must be greater than 0.";
    }
    if (!workMedia || workMedia.length === 0) {
      missingFields.workMedia = "At least one media file is required.";
    }
    if (!skills || skills.length === 0) {
      missingFields.skills = "At least one skill is required.";
    }

    // Validate contact information
    if (!contactInfo || !contactInfo.email) {
      missingFields.contactEmail = "Email is required in contact information.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contactInfo.email)) {
      missingFields.contactEmail =
        "Invalid email format in contact information.";
    }

    if (!contactInfo || !contactInfo.phone) {
      missingFields.contactPhone =
        "Phone number is required in contact information.";
    }

    // If there are missing fields, respond with an error
    if (Object.keys(missingFields).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", missingFields },
        { status: 400 }
      );
    }

    // Validate portfolio link format
    if (portfolioLink && !/^https?:\/\/.+\..+$/.test(portfolioLink)) {
      return NextResponse.json(
        { error: "Invalid portfolio link format." },
        { status: 400 }
      );
    }

    // Create a new Work entry
    const newWork = new Work({
      creator: creatorId,
      category,
      title,
      description,
      price,
      workMedia, // Updated to match the schema
      skills,
      deliveryDate,
      deliveryTime,
      contactInfo, // Updated to match the schema
      languagesSpoken,
      experienceLevel,
      portfolioLink,
      certifications,
    });

    // Save the work to the database
    await newWork.save();

    // Respond with the newly created work
    return NextResponse.json(newWork, { status: 201 });
  } catch (error: any) {
    console.error("API POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
