import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseListModel } from "@/models/CourseList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const session = await getServerSession({ request, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const courses = await CourseListModel.find({ createdBy: userId })
      .populate("createdBy", "firstName avatar")
      .exec();
    return NextResponse.json({
      success: true,
      message: "Courses retrieved successfully",
      data: courses,
    });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
