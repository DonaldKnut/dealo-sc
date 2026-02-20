import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseListModel } from "@/models/CourseList";
import { CourseModel } from "@/models/Course";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    // Check if there is no session (user is not authenticated)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    // Ensure the courseId is present
    if (!courseId || !Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { error: "Invalid or missing courseId" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connect();

    // Find the authenticated user (same logic as dashboard/courses route)
    let userDoc = null as any;
    const sessionAny = session.user as any;
    
    // Try to find user by _id first (if it's a valid ObjectId)
    if (sessionAny?._id) {
      if (mongoose.Types.ObjectId.isValid(sessionAny._id)) {
        userDoc = await UserModel.findById(sessionAny._id).select("_id email");
      }
    }
    
    // Try by session.user.id only if it's a valid ObjectId
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
      console.error("User not found in get-course:", {
        sessionUserId: session.user.id,
        sessionUserEmail: session.user.email,
        sessionUser_id: sessionAny?._id,
      });
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Convert courseId to ObjectId
    const objectId = new Types.ObjectId(courseId);
    const userId = userDoc._id;

    // Check both CourseListModel (DealoForge) and CourseModel (newer courses)
    // First check CourseListModel
    let courseExists = await CourseListModel.findOne({ _id: objectId });
    let courseModel = "CourseList";
    
    // If not found in CourseListModel, check CourseModel
    if (!courseExists) {
      courseExists = await CourseModel.findOne({ _id: objectId });
      courseModel = "Course";
    }
    
    if (!courseExists) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check ownership - CourseListModel uses createdBy, CourseModel uses instructor
    let courseOwnerId: string;
    if (courseModel === "CourseList") {
      const courseList = courseExists as any;
      courseOwnerId = (courseList.createdBy as any)?.toString?.() || 
                      (courseList.createdBy as any)?._id?.toString() ||
                      courseList.createdBy?.toString();
    } else {
      const course = courseExists as any;
      courseOwnerId = (course.instructor as any)?.toString?.() || 
                      (course.instructor as any)?._id?.toString() ||
                      course.instructor?.toString();
    }
    
    const requestingUserId = userId.toString();

    // Verify ownership
    if (courseOwnerId !== requestingUserId) {
      return NextResponse.json(
        { error: "You don't have permission to view this course" },
        { status: 403 }
      );
    }

    // Fetch course with populated fields
    let course;
    if (courseModel === "CourseList") {
      course = await CourseListModel.findOne({
        _id: objectId,
        createdBy: userId,
      }).populate("createdBy", "firstName lastName avatar email");
    } else {
      course = await CourseModel.findOne({
        _id: objectId,
        instructor: userId,
      }).populate("instructor", "firstName lastName avatar email");
    }

    if (!course) {
      return NextResponse.json(
        { error: "Failed to load course data" },
        { status: 500 }
      );
    }

    // Normalize the response for CourseModel to match CourseListModel format
    if (courseModel === "Course") {
      const courseData = course as any;
      const normalizedCourse = {
        _id: courseData._id,
        name: courseData.title,
        category: courseData.category,
        level: courseData.level?.toUpperCase() || courseData.level,
        courseDuration: `${(courseData.duration || 0) / 60} hours`,
        noOfChapters: courseData.sections?.length || 0,
        addVideo: !!courseData.previewVideo?.url,
        courseBanner: courseData.thumbnail,
        publish: courseData.isPublished || courseData.status === "published",
        createdAt: courseData.metadata?.createdAt || courseData.createdAt,
        updatedAt: courseData.metadata?.updatedAt || courseData.updatedAt,
        courseOutput: {
          overview: courseData.description || courseData.shortDescription,
          chapters: (courseData.sections || []).map((section: any, index: number) => ({
            chapter_number: index + 1,
            chapter_title: section.title || `Section ${index + 1}`,
            chapter_description: section.description || "",
            topics: section.lectures?.map((l: any) => l.title) || [],
            video_lectures: (section.lectures || []).map((lecture: any) => ({
              lecture_title: lecture.title || "Untitled lecture",
              lecture_description: lecture.description || "",
              duration: lecture.duration ? `${Math.floor(lecture.duration / 60)}:${String(lecture.duration % 60).padStart(2, '0')}` : "0:00",
            })),
          })),
        },
        videos: courseData.previewVideo?.url ? [{
          title: courseData.title,
          description: courseData.shortDescription,
          channelTitle: courseData.instructor?.firstName || "Instructor",
          videoUrl: courseData.previewVideo.url,
          thumbnail: courseData.previewVideo.thumbnail || courseData.thumbnail,
        }] : [],
        createdBy: courseData.instructor,
      };
      return NextResponse.json(normalizedCourse);
    }

    // Return the course data (CourseListModel format)
    return NextResponse.json(course);
  } catch (error: any) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course", message: error?.message },
      { status: 500 }
    );
  }
}
