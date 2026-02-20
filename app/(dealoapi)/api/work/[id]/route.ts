import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../../database/index";
import Work from "@/models/Work"; // Mongoose model for Work
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs/promises"; // To create directories dynamically
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

// Force dynamic rendering to prevent fs module issues
export const dynamic = "force-dynamic";

interface Params {
  id: string;
}

// Connect to the database before any operation
async function ensureDatabaseConnection() {
  try {
    await connect();
  } catch (err) {
    console.error("Database connection error:", err);
    throw new Error("Database connection failed");
  }
}

// **GET Endpoint**
export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    console.log("Connecting to database...");
    await connect();

    console.log("Fetching work with ID:", params.id);
    const work = await Work.findById(params.id).populate("creator"); // Populate the creator details

    if (!work) {
      console.error(`Work with ID ${params.id} not found.`);
      return new Response(JSON.stringify({ error: "Work not found" }), {
        status: 404,
      });
    }

    console.log("Work fetched successfully.");
    return NextResponse.json({ work }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching work details:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch work details",
        details: err.message,
      }),
      { status: 500 }
    );
  }
};

// **PATCH Endpoint**
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Params }
) => {
  try {
    await ensureDatabaseConnection();

    const session = await getServerSession({ req: req, ...authOptions });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();

    // Extract fields from the request
    const category = data.get("category")?.toString();
    const title = data.get("title")?.toString();
    const description = data.get("description")?.toString();
    const price = Number(data.get("price"));

    // Retrieve photos from the form
    const photos = data.getAll("workPhotoPaths");
    const workPhotoPaths: string[] = [];

    // Process and save each photo
    const uploadsDir = path.resolve("./public/uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    for (const photo of photos) {
      if (photo instanceof File) {
        const buffer = Buffer.from(await photo.arrayBuffer());
        const photoPath = path.join(uploadsDir, photo.name);
        await writeFile(photoPath, buffer);
        workPhotoPaths.push(`/uploads/${photo.name}`);
      } else {
        workPhotoPaths.push(photo.toString());
      }
    }

    // Find the existing work
    const existingWork = await Work.findById(params.id);
    if (!existingWork) {
      return NextResponse.json(
        { error: "The work was not found" },
        { status: 404 }
      );
    }

    // Ensure the user is the creator of the work
    if (existingWork.creator.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the work fields
    existingWork.category = category ?? existingWork.category;
    existingWork.title = title ?? existingWork.title;
    existingWork.description = description ?? existingWork.description;
    existingWork.price = price ?? existingWork.price;
    existingWork.workPhotoPaths = workPhotoPaths;

    await existingWork.save();

    return NextResponse.json(
      { message: "Successfully updated the work" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error updating the work" },
      { status: 500 }
    );
  }
};

// **DELETE Endpoint**
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Params }
) => {
  try {
    await ensureDatabaseConnection();
    const session = await getServerSession({ req: req, ...authOptions });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the existing work
    const existingWork = await Work.findById(params.id);
    if (!existingWork) {
      return NextResponse.json(
        { error: "The work was not found" },
        { status: 404 }
      );
    }

    // Ensure the user is the creator of the work
    if (existingWork.creator.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the work
    await existingWork.deleteOne();

    return NextResponse.json(
      { message: "Successfully deleted the work" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error deleting the work" },
      { status: 500 }
    );
  }
};
