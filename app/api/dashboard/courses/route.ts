import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { CourseModel } from "@/models/Course";
import StudentInfoModel from "@/models/StudentInfo";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // Find user by email or ID
    let userDoc = null as any;
    const sessionAny = session.user as any;
    
    // Try to find user by _id first (if it's a valid ObjectId)
    if (sessionAny?._id) {
      if (mongoose.Types.ObjectId.isValid(sessionAny._id)) {
        userDoc = await UserModel.findById(sessionAny._id).select("_id email");
      }
    }
    
    // Try by session.user.id only if it's a valid ObjectId
    // OAuth provider IDs (like Google's numeric IDs) are NOT valid ObjectIds
    if (!userDoc && session.user.id) {
      if (mongoose.Types.ObjectId.isValid(session.user.id)) {
        try {
          const userIdObj = new mongoose.Types.ObjectId(session.user.id);
          userDoc = await UserModel.findById(userIdObj).select("_id email");
        } catch (e) {
          // Conversion failed, skip
        }
      }
    }
    
    // For OAuth users, find by email (most reliable method)
    if (!userDoc && session.user.email) {
      userDoc = await UserModel.findOne({ email: session.user.email }).select("_id email");
    }
    
    if (!userDoc) {
      console.error("User not found in dashboard/courses:", {
        sessionUserId: session.user.id,
        sessionUserEmail: session.user.email,
        sessionUser_id: sessionAny?._id,
      });
      return NextResponse.json({ courses: [], createdCourses: [] });
    }

    console.log("Found user for dashboard/courses:", {
      userId: userDoc._id.toString(),
      email: userDoc.email,
    });

    // Get enrolled courses
    const studentInfo = (await StudentInfoModel.findOne({ userId: userDoc._id })
      .populate("enrolledCourses")
      .lean()) as any;

    const enrolled = (studentInfo?.enrolledCourses as any[]) || [];
    const enrolledCourses = enrolled.map((c: any) => ({
      id: c._id?.toString() || c.toString(),
      title: c.title || "Untitled Course",
      level: c.level || "",
      category: c.category || "",
      instructor: c.instructorName || c.instructor?.name || "",
      thumbnail: c.thumbnail || "",
      description: c.description || c.shortDescription || "",
      type: "enrolled" as const,
    }));

    // Get courses created by this user
    // Use the MongoDB user's _id to find courses
    let createdCoursesData: any[] = [];
    
    try {
      // Match courses by the MongoDB user's _id
      createdCoursesData = await CourseModel.find({ instructor: userDoc._id })
        .populate("instructor", "name firstName lastName")
        .lean();
    } catch (e: any) {
      console.error("Error fetching created courses:", e);
    }

    console.log(`Found ${createdCoursesData.length} created courses for user ${userDoc._id}`);

    const createdCourses = createdCoursesData.map((c: any) => ({
      id: c._id?.toString(),
      title: c.title || "Untitled Course",
      level: c.level || "",
      category: c.category || "",
      instructor: c.instructor?.name || c.instructor?.firstName || "You",
      thumbnail: c.thumbnail || "",
      description: c.description || c.shortDescription || "",
      type: "created" as const,
      status: c.status || "draft",
    }));

    // Combine both types of courses
    const allCourses = [...enrolledCourses, ...createdCourses];

    return NextResponse.json({ 
      courses: allCourses,
      enrolledCourses,
      createdCourses 
    });
  } catch (e: any) {
    console.error("/api/dashboard/courses error:", e);
    console.error("Error stack:", e.stack);
    return NextResponse.json(
      { 
        error: e?.message || "Internal Server Error", 
        courses: [], 
        createdCourses: [],
        debug: process.env.NODE_ENV === "development" ? {
          message: e?.message,
          stack: e?.stack,
        } : undefined,
      },
      { status: 500 }
    );
  }
}
