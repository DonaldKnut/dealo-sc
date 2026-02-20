import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseModel } from "@/models/Course";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
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

    // Handle both JSON and FormData requests
    const contentType = req.headers.get("content-type") || "";
    let type: string;
    let courseId: string;
    let sectionId: string;
    let lectureId: string;
    let courseName: string;
    let ipVerified: boolean = false;
    let file: File | null = null;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      type = body.type;
      courseId = body.courseId;
      sectionId = body.sectionId;
      lectureId = body.lectureId;
      courseName = body.courseName;
      ipVerified = body.ipVerified || false;
    } else {
      const formData = await req.formData();
      type = formData.get("type") as string;
      courseId = formData.get("courseId") as string;
      sectionId = formData.get("sectionId") as string;
      lectureId = formData.get("lectureId") as string;
      courseName = formData.get("courseName") as string;
      ipVerified = formData.get("ipVerified") === "true";
      file = formData.get("file") as File | null;
    }

    if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(sectionId) || !Types.ObjectId.isValid(lectureId)) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    const courseObjId = new Types.ObjectId(courseId);
    const userId = userDoc._id;

    // Find course and verify ownership
    const course = await CourseModel.findOne({
      _id: courseObjId,
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

    let generatedContent = "";

    if (type === "ai-script") {
      // Generate AI script using Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate comprehensive course content for a lecture titled "${lecture.title}" in a course about "${courseName}". 
      Create detailed educational content including:
      - A clear explanation of the topic
      - Key concepts and definitions
      - Examples and practical applications
      - Summary points
      
      Format the response as structured educational content suitable for a course lecture.`;

      const result = await model.generateContent(prompt);
      generatedContent = result.response.text();
    } else if (type === "pdf" || type === "ebook") {
      // For PDF/Ebook, we would need to extract text from the file
      // This is a simplified version - in production, you'd use a PDF/EPUB parser
      if (!file) {
        return NextResponse.json({ error: "File is required" }, { status: 400 });
      }

      // Note: In production, you'd parse the PDF/EPUB file here
      // For now, we'll generate content based on the file name
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Based on the ${type === "pdf" ? "PDF" : "ebook"} file "${file.name}", generate course content for a lecture titled "${lecture.title}" in a course about "${courseName}".
      Extract and organize the key educational content from this document into a structured lecture format.`;

      const result = await model.generateContent(prompt);
      generatedContent = result.response.text();
    } else if (type === "video") {
      // For video, check IP verification
      if (!ipVerified) {
        return NextResponse.json(
          { error: "Intellectual property verification required for video monetization" },
          { status: 403 }
        );
      }

      if (!file) {
        return NextResponse.json({ error: "Video file is required" }, { status: 400 });
      }

      // Upload video to Cloudflare Stream (similar to AddVideoModal)
      // For now, we'll just update the lecture with a placeholder
      // In production, you'd upload the video and get the video ID
      generatedContent = "Video content uploaded and processed";
    } else {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    // Update lecture with generated content
    if (!lecture.description) {
      lecture.description = generatedContent.substring(0, 500); // First 500 chars as description
    }

    // Save the course
    await course.save();

    // Return updated course
    const updatedCourse = await CourseModel.findById(courseObjId)
      .populate("instructor", "firstName lastName avatar");

    return NextResponse.json({
      success: true,
      message: "Content generated successfully",
      course: updatedCourse,
    });
  } catch (error: any) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content", message: error?.message },
      { status: 500 }
    );
  }
}

