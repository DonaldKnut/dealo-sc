import { NextRequest, NextResponse } from "next/server";
import Work from "@/models/Work";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";

// Force dynamic rendering to prevent fs module issues
export const dynamic = "force-dynamic";

interface Params {
  userId: string;
}

// Ensure database connection
async function ensureDatabaseConnection() {
  try {
    await connect();
  } catch (err) {
    console.error("Database connection error:", err);
    throw new Error("Database connection failed");
  }
}

// **GET Endpoint**
export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    await ensureDatabaseConnection();

    const { userId } = params;

    // Fetch works associated with the userId and populate creator and avatar
    const works = await Work.find({ creator: userId }).populate({
      path: "creator",
      populate: {
        path: "avatar",
        model: "Avatar",
        select: "url",
      },
    });

    if (!works.length) {
      return NextResponse.json({ error: "No works found" }, { status: 404 });
    }

    return NextResponse.json(works, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
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

    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();

    const { userId } = params;
    const workId = data.get("workId")?.toString(); // Ensure workId is passed

    // Extract fields from the request
    const category = data.get("category")?.toString();
    const title = data.get("title")?.toString();
    const description = data.get("description")?.toString();
    const price = Number(data.get("price"));
    const photos = data.getAll("workPhotoPaths");

    if (!workId) {
      return NextResponse.json(
        { error: "Work ID is required for updates" },
        { status: 400 }
      );
    }

    // Fetch the existing work
    const existingWork = await Work.findOne({ _id: workId, creator: userId });
    if (!existingWork) {
      return NextResponse.json(
        { error: "The work was not found or you do not have access" },
        { status: 404 }
      );
    }

    const uploadsDir = path.resolve("./public/uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const workPhotoPaths: string[] = [];

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

    // Update work details
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

    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const { searchParams } = new URL(req.url);
    const workId = searchParams.get("workId");

    if (!workId) {
      return NextResponse.json(
        { error: "Work ID is required for deletion" },
        { status: 400 }
      );
    }

    const work = await Work.findOne({ _id: workId, creator: userId });
    if (!work) {
      return NextResponse.json(
        { error: "The work was not found or you do not have access" },
        { status: 404 }
      );
    }

    await work.deleteOne();

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
