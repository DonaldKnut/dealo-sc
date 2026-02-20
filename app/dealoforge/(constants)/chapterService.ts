// chapterService.ts
import { v4 as uuid4 } from "uuid";
import { generateChapterContent } from "@/app/dealoforge/config/AiModelConfig";
import getVideos from "@/app/dealoforge/config/service";

// Define the Chapter type for TypeScript safety
interface ChapterInput {
  chapterId?: string;
  chapterTitle?: string;
  chapterDescription?: string;
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

export async function processChapterData(
  courseId: string,
  chapters: ChapterInput[]
) {
  return Promise.all(
    chapters.map(async (chapter, index) => {
      const chapterId = chapter.chapterId || uuid4();

      if (!chapter.content || chapter.content.length === 0) {
        const aiContent = await generateChapterContent(
          "Sample Topic",
          `Chapter ${index + 1}`
        );
        chapter.content = aiContent?.title
          ? [
              {
                type: "text",
                title: aiContent.title,
                description:
                  aiContent.description || "No description available",
              },
            ]
          : [
              {
                type: "text",
                title: `Chapter ${index + 1} - Title Not Available`,
                description: "Description not available.",
              },
            ];
      }

      const videos = await getVideos(chapter.content[0]?.title || "");
      chapter.videoId =
        videos.length > 0 ? videos[0].id.videoId : chapter.videoId || "";

      return {
        courseId,
        uuid: uuid4(),
        chapterId,
        chapterTitle: chapter.chapterTitle || `Chapter ${index + 1}`,
        chapterDescription: chapter.chapterDescription || "",
        learningObjectives: chapter.learningObjectives || [],
        videoUrl: chapter.videoId
          ? `https://www.youtube.com/watch?v=${chapter.videoId}`
          : "",
        duration: chapter.duration || "Unknown",
        content: chapter.content,
      };
    })
  );
}
