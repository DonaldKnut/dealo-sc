import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database"; // Adjust the path to your database connection
import { CourseListModel } from "@/models/CourseList"; // Import your CourseList model
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/authOptions/authOptions"; // Adjust the path to your auth options

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect(); // Establish the database connection

  // Get session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const course = await CourseListModel.findById(id).populate(
      "createdBy",
      "firstName avatar"
    ); // Populate createdBy field
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
