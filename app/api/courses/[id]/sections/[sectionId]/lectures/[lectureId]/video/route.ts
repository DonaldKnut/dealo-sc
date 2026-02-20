import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseModel } from "@/models/Course";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; sectionId: string; lectureId: string } }
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

    const { id, sectionId, lectureId } = params;
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(sectionId) || !Types.ObjectId.isValid(lectureId)) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    const courseId = new Types.ObjectId(id);
    const userId = userDoc._id;

    const body = await req.json();
    const { videoId, videoUrl } = body;

    if (!videoId || !videoUrl) {
      return NextResponse.json(
        { error: "videoId and videoUrl are required" },
        { status: 400 }
      );
    }

    // Find course and verify ownership
    const course = await CourseModel.findOne({
      _id: courseId,
      instructor: userId,
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the section
    const section = (course as any).sections?.find(
      (s: any) => s._id?.toString() === sectionId
    );

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Find the lecture
    const lecture = section.lectures?.find(
      (l: any) => l._id?.toString() === lectureId
    );

    if (!lecture) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }

    // Update lecture with video
    lecture.type = "video";
    lecture.content = {
      url: videoUrl,
      ...lecture.content,
    };

    // Mark as array to ensure Mongoose saves it
    await course.save();

    // Return updated course
    const updatedCourse = await CourseModel.findById(courseId)
      .populate("instructor", "firstName lastName avatar");

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("Error adding video to lecture:", error);
    return NextResponse.json(
      { error: "Failed to add video", message: error?.message },
      { status: 500 }
    );
  }
}

