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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("GET /api/dashboard/courses/[id] called with params:", params);
    
    // Get the session
    const session = await getServerSession(authOptions);

    // Check if there is no session (user is not authenticated)
    if (!session?.user) {
      console.log("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session found:", {
      userId: session.user.id,
      email: session.user.email,
    });

    const { id } = params;
    console.log("Course ID from params:", id);

    // Ensure the courseId is present and valid
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid or missing course ID" },
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
      console.error("User not found in dashboard/courses/[id]:", {
        sessionUserId: session.user.id,
        sessionUserEmail: session.user.email,
        sessionUser_id: sessionAny?._id,
      });
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    console.log("User found:", {
      userId: userDoc._id.toString(),
      email: userDoc.email,
    });

    // Convert courseId to ObjectId
    const objectId = new Types.ObjectId(id);
    const userId = userDoc._id;

    console.log("Looking for course:", {
      courseId: objectId.toString(),
      userId: userId.toString(),
    });

    // Check both CourseListModel (DealoForge) and CourseModel (newer courses)
    // First check CourseListModel (DealoForge courses)
    let courseExists = await CourseListModel.findOne({ _id: objectId });
    let courseModel = "CourseList";
    
    // If not found in CourseListModel, check CourseModel
    if (!courseExists) {
      courseExists = await CourseModel.findOne({ _id: objectId });
      courseModel = "Course";
    }
    
    if (!courseExists) {
      console.error("Course does not exist in either model:", {
        courseId: objectId.toString(),
        userId: userId.toString(),
      });
      return NextResponse.json(
        { 
          error: "Course not found. It may have been deleted or doesn't exist.",
          courseId: objectId.toString(),
        },
        { status: 404 }
      );
    }

    console.log(`Course found in ${courseModel} model`);

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

    console.log("Course ownership check:", {
      courseId: objectId.toString(),
      courseModel,
      courseOwnerId,
      requestingUserId,
      match: courseOwnerId === requestingUserId,
    });

    if (courseOwnerId !== requestingUserId) {
      console.error("Course exists but belongs to different user:", {
        courseId: objectId.toString(),
        courseModel,
        requestedBy: requestingUserId,
        actualOwner: courseOwnerId,
        courseName: (courseExists as any).name || (courseExists as any).title,
      });
      return NextResponse.json(
        { 
          error: "You don't have permission to view this course. Only the instructor who created it can view it.",
          courseId: objectId.toString(),
        },
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
      console.error("Unexpected: Course exists and ownership matches but query failed:", {
        courseId: objectId.toString(),
        userId: userId.toString(),
        courseModel,
      });
      return NextResponse.json(
        { error: "Failed to load course data" },
        { status: 500 }
      );
    }

    console.log("Course found successfully:", {
      courseId: course._id.toString(),
      courseName: (course as any).name || (course as any).title,
      courseModel,
    });

    // Normalize the response to match what the page expects
    // CourseListModel uses: name, courseOutput, createdBy
    // CourseModel uses: title, description, instructor, sections
    let normalizedCourse: any;
    
    if (courseModel === "CourseList") {
      // Already in the right format
      normalizedCourse = course;
    } else {
      // Transform CourseModel to match CourseListModel format
      const courseData = course as any;
      normalizedCourse = {
        _id: courseData._id,
        name: courseData.title,
        category: courseData.category,
        level: courseData.level?.toUpperCase() || courseData.level,
        courseDuration: `${(courseData.duration || 0) / 60} hours`, // Convert minutes to hours
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
        createdBy: courseData.instructor, // Already populated
      };
    }

    // Return the normalized course data
    return NextResponse.json(normalizedCourse);
  } catch (error: any) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course", message: error?.message },
      { status: 500 }
    );
  }
}

