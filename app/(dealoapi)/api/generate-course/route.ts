import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { CourseListModel, Level } from "@/models/CourseList";
import { UserModel } from "@/models/User"; // Assuming this model manages user data including credits
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

// Utility function to convert string to a MongoDB ObjectId
function convertToObjectId(id: string) {
  if (Types.ObjectId.isValid(id)) {
    return new Types.ObjectId(id);
  }
  return null;
}

// Helper function to validate required fields in the request body
function validateRequiredFields(data: {
  category?: string;
  topic?: string;
  description?: string;
  difficultyLevel?: string;
  courseDuration?: string;
  noOfChapters?: string;
  chapters?: any[];
}): string[] {
  const {
    category,
    topic,
    description,
    difficultyLevel,
    courseDuration,
    noOfChapters,
    chapters,
  } = data;

  const missingFields: string[] = [];

  if (!category) {
    missingFields.push("category");
  }
  if (!topic) {
    missingFields.push("topic");
  }
  if (!description) {
    missingFields.push("description");
  }
  if (!difficultyLevel) {
    missingFields.push("difficultyLevel");
  }
  if (!courseDuration) {
    missingFields.push("courseDuration");
  }

  const chaptersCount = parseInt(noOfChapters ?? "0", 10);
  if (isNaN(chaptersCount) || chaptersCount <= 0) {
    missingFields.push("valid number of chapters");
  }

  if (
    !chapters ||
    !Array.isArray(chapters) ||
    chapters.length !== chaptersCount
  ) {
    missingFields.push("chapters matching the specified number of chapters");
  } else {
    chapters.forEach((chapter, index) => {
      const hasTitle =
        chapter.chapterTitle || chapter.chapter_title || chapter.chapter_name;
      if (!hasTitle) {
        missingFields.push(`title for chapter ${index + 1}`);
      }
    });
  }

  return missingFields;
}

// Main course creation handler
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const requestBody = await request.json();
    console.log("Request Body:", requestBody);

    const {
      category,
      topic,
      description,
      difficultyLevel,
      courseDuration,
      noOfChapters,
      chapters,
      addVideo,
      videos,
      cloudflareVideoId,
    } = requestBody;

    // Authenticate user
    const session = await getServerSession({ req: request, ...authOptions });
    if (!session || !session.user?.id) {
      console.error("Authentication failed: User not found or missing ID");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const createdById = convertToObjectId(session.user.id);
    if (!createdById) {
      console.error("Invalid User ID: Unable to convert to ObjectId");
      return new NextResponse("Invalid user ID", { status: 400 });
    }

    // Connect to the database
    await connect();

    // Fetch user to check their credits
    const user = await UserModel.findById(createdById);
    if (!user) {
      console.error("User not found");
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.credits < 1) {
      console.error("Insufficient credits");
      return new NextResponse(
        JSON.stringify({ message: "Insufficient credits" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate required fields
    const missingFields = validateRequiredFields({
      category,
      topic,
      description,
      difficultyLevel,
      courseDuration,
      noOfChapters,
      chapters,
    });

    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(
        ", "
      )}`;
      console.error(errorMessage);
      return new NextResponse(errorMessage, { status: 400 });
    }

    // Validate difficulty level
    const levelUpperCase = difficultyLevel.toUpperCase();
    if (!Object.values(Level).includes(levelUpperCase)) {
      console.error(`Invalid difficulty level: ${difficultyLevel}`);
      return new NextResponse("Invalid difficulty level", { status: 400 });
    }

    // Process chapters and handle missing descriptions
    const processedChapters = chapters.map((chapter: any, index: number) => ({
      chapter_number: chapter.chapterNumber || index + 1,
      chapter_title: chapter.chapterTitle || `Untitled Chapter ${index + 1}`,
      chapter_description:
        chapter.chapterDescription ||
        `This chapter is designed to provide you with an in-depth understanding of the key concepts and insights covered in Chapter ${index + 1
        }. It serves as a foundation to further enhance your knowledge and mastery of the subject matter.`,
      topics: chapter.topics || [],
      video_lectures:
        addVideo && videos && videos[index]
          ? [
            {
              lecture_title: videos[index].title,
              lecture_description:
                videos[index].description || "No description",
              duration: "N/A",
            },
          ]
          : [],
    }));

    // Create a new course document
    const newCourse = new CourseListModel({
      name: topic,
      category,
      level: levelUpperCase,
      courseOutput: {
        overview: description,
        chapters: processedChapters,
      },
      videos: addVideo && Array.isArray(videos) ? videos : [],
      createdBy: createdById,
      courseDuration,
      noOfChapters: parseInt(noOfChapters ?? "0", 10),
      addVideo: Boolean(addVideo),
      courseBanner: cloudflareVideoId ? `https://customer-vdf75v7v7v7v7v.cloudflarestream.com/${cloudflareVideoId}/thumbnails/thumbnail.jpg` : "",
    });

    const savedCourse = await newCourse.save();
    console.log("Course saved successfully:", savedCourse);

    // Deduct one credit from the user's balance
    user.credits -= 1;
    await user.save();
    console.log("User credits updated:", user.credits);

    // Respond with success
    return new NextResponse(
      JSON.stringify({
        message: "Course created successfully",
        courseId: savedCourse._id.toString(),
        remainingCredits: user.credits,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("An error occurred while creating the course:", error);
    return new NextResponse("Failed to create course", { status: 500 });
  }
}
