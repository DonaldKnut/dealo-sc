import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseModel } from "@/models/Course";
import { CourseListModel } from "@/models/CourseList";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // Find the authenticated user
    let userDoc = null as any;
    const sessionAny = session.user as any;

    if (sessionAny?._id && mongoose.Types.ObjectId.isValid(sessionAny._id)) {
      userDoc = await UserModel.findById(sessionAny._id).select("_id email");
    }

    if (!userDoc && session.user.id) {
      if (mongoose.Types.ObjectId.isValid(session.user.id)) {
        try {
          const userIdObj = new mongoose.Types.ObjectId(session.user.id);
          userDoc = await UserModel.findById(userIdObj).select("_id email");
        } catch (e) {
          // Skip
        }
      }
    }

    if (!userDoc && session.user.email) {
      userDoc = await UserModel.findOne({ email: session.user.email }).select("_id email");
    }

    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const { id } = params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const courseId = new Types.ObjectId(id);
    const userId = userDoc._id;

    const body = await req.json();
    const { publish } = body;

    // Check both CourseModel and CourseListModel
    let course = await CourseModel.findOne({
      _id: courseId,
      instructor: userId,
    });

    let courseModel = "Course";

    if (!course) {
      course = await CourseListModel.findOne({
        _id: courseId,
        createdBy: userId,
      });
      courseModel = "CourseList";
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Update publish status
    if (courseModel === "Course") {
      const courseData = course as any;
      courseData.isPublished = publish === true;
      courseData.status = publish === true ? "published" : "draft";
      if (publish === true && !courseData.metadata?.publishedAt) {
        if (!courseData.metadata) {
          courseData.metadata = {};
        }
        courseData.metadata.publishedAt = new Date();
      }
      await courseData.save();
    } else {
      const courseData = course as any;
      courseData.publish = publish === true;
      await courseData.save();
    }

    // Return updated course
    const updatedCourse = courseModel === "Course"
      ? await CourseModel.findById(courseId).populate("instructor", "firstName lastName avatar")
      : await CourseListModel.findById(courseId).populate("createdBy", "firstName lastName avatar");

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("Error updating publish status:", error);
    return NextResponse.json(
      { error: "Failed to update publish status", message: error?.message },
      { status: 500 }
    );
  }
}

