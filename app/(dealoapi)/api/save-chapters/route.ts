// api/save-chapters.ts
import { v4 as uuid4 } from "uuid";
import { connect } from "@/database";
import { ChapterModel } from "@/models/Chapter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { generateChapterContent } from "@/app/dealoforge/config/AiModelConfig";
import getVideos from "@/app/dealoforge/config/service";

// ChapterInput interface for request validation
interface ChapterInput {
  chapterId?: string;
  chapterTitle?: string;
  learningObjectives?: string[];
  videoId?: string;
  duration?: string;
  content?: Array<{
    type?: string;
    title?: string;
    description?: string;
    duration?: string;
    metadata?: {
      codeExample?: string;
      formula?: string;
      example?: string;
    };
  }>;
}

// POST request handler to save chapters
export async function POST(req: NextRequest) {
  try {
    await connect();
    console.log("Database connected");

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body);

    if (!body.courseId || !Types.ObjectId.isValid(body.courseId)) {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }

    const courseId = new Types.ObjectId(body.courseId);

    if (!Array.isArray(body.chapters)) {
      return NextResponse.json(
        { error: "Invalid chapters data" },
        { status: 400 }
      );
    }

    const savedChapters = await Promise.all(
      body.chapters.map(async (chapter: ChapterInput, index: number) => {
        const chapterId = chapter.chapterId || uuid4();

        // Generate AI content if no content provided
        if (!chapter.content || chapter.content.length === 0) {
          console.log(`Generating AI content for Chapter ${index + 1}`);
          try {
            const aiContent = await generateChapterContent(
              body.topic,
              `Chapter ${index + 1}`
            );
            chapter.content = aiContent?.title
              ? [
                  {
                    type: "text",
                    title: aiContent.title,
                    description:
                      aiContent.description || "No description available",
                    duration: "10 minutes",
                    metadata: {
                      formula: aiContent.formula || "",
                      example: aiContent.example || "",
                    },
                  },
                ]
              : [
                  {
                    type: "text",
                    title: `Chapter ${index + 1} - Title Not Available`,
                    description: "Description not available.",
                    duration: "Unknown",
                    metadata: {},
                  },
                ];
          } catch (error) {
            console.error(
              `Error generating AI content: ${(error as Error).message}`
            );
            chapter.content = [
              {
                type: "text",
                title: `Chapter ${index + 1} - Title Not Available`,
                description: "Description not available.",
                duration: "Unknown",
                metadata: {},
              },
            ];
          }
        }

        // Fetch video URL using AI-generated content title
        const videos = await getVideos(chapter.content[0]?.title || "");
        const videoId =
          videos.length > 0
            ? `https://www.youtube.com/watch?v=${videos[0].id.videoId}`
            : chapter.videoId || "";

        const newChapter = new ChapterModel({
          courseId,
          uuid: uuid4(),
          chapterId,
          chapterTitle: chapter.chapterTitle || `Chapter ${index + 1}`,
          learningObjectives: chapter.learningObjectives || [],
          videoUrl: videoId,
          duration: chapter.duration || "Unknown",
          content: chapter.content,
        });

        const savedChapter = await newChapter.save();
        console.log(`Chapter ${index + 1} saved:`, savedChapter);
        return savedChapter;
      })
    );

    return NextResponse.json(
      { message: "Chapters saved", savedChapters },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving chapters:", (error as Error).message);
    return NextResponse.json(
      {
        error: "Failed to save chapters",
        details: (error as Error).message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
