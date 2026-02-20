import { NextResponse } from "next/server";
import { JobModel } from "@/models/Job"; // Your Mongoose Job model
import { connect } from "@/database";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await connect();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || ""; // Get the 'q' query parameter

  try {
    // Search jobs by title, description, or other relevant fields
    const jobs = await JobModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search
        { description: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
      ],
    });

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
