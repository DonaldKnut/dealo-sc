// src/components/course/courseUtils.ts

import { Course } from "./courseTypes";
import { generateChapterContent } from "../../config/AiModelConfig";
import { v4 as generateUniqueId } from "uuid";
import getVideos from "../../config/service";

// Fetch course details from API
export const fetchCourseDetails = async (
  courseId: string,
  setCourse: (course: Course) => void,
  setNotificationMessage: (message: string | null) => void,
  setNotificationType: (type: "success" | "error") => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  // Validate courseId before making the request
  if (!courseId || courseId.trim() === "") {
    setNotificationType("error");
    setNotificationMessage("Course ID is missing. Please check the URL.");
    setIsLoading(false);
    return;
  }

  // Basic MongoDB ObjectId format validation (24 hex characters)
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!objectIdPattern.test(courseId)) {
    setNotificationType("error");
    setNotificationMessage(`Invalid course ID format: "${courseId}". Please check the URL.`);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);
  try {
    console.log("Fetching course details for ID:", courseId);
    // Use the dashboard endpoint which handles both CourseListModel and CourseModel
    const response = await fetch(`/api/dashboard/courses/${courseId}`, {
      cache: "no-store",
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Handle both CourseListModel and CourseModel formats
      // CourseListModel uses: name, courseOutput.chapters
      // CourseModel uses: title, sections (normalized by the API)
      const courseName = result.name || result.title;
      const courseChapters = result.courseOutput?.chapters || [];
      
      setCourse({
        courseId: result._id?.toString() || courseId,
        name: courseName,
        category: result.category,
        level: result.level,
        courseDuration: result.courseDuration || "0 hours",
        noOfChapters: Number(result.noOfChapters || courseChapters.length),
        addVideo: result.addVideo || false,
        chapters:
          courseChapters.map((chapter: any) => ({
            chapterId: generateUniqueId(),
            chapterTitle: chapter.chapter_title || chapter.title || "Untitled Chapter",
            chapterDescription: chapter.chapter_description || chapter.description || "",
            videoUrl: chapter.video_url || chapter.videoUrl || "",
            duration: chapter.chapter_duration || chapter.duration || "",
            content: [],
          })) || [],
      });
      setNotificationType("success");
    } else {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error("Failed to fetch course:", {
        status: response.status,
        error: errorData,
      });
      
      if (response.status === 403) {
        throw new Error(errorData.error || "You don't have permission to view this course.");
      } else if (response.status === 404) {
        throw new Error("Course not found. It may have been deleted or doesn't exist.");
      } else if (response.status === 401) {
        throw new Error("Please log in to view this course.");
      } else {
        throw new Error(errorData.error || "Failed to fetch course data");
      }
    }
  } catch (error: any) {
    console.error("Error in fetchCourseDetails:", error);
    setNotificationType("error");
    setNotificationMessage(error.message || "Failed to load course data.");
  } finally {
    setIsLoading(false);
  }
};

// Generate content for the course chapters
export const handleGenerateContent = async (
  course: Course | null,
  setCourse: (course: Course | null) => void,
  setNotificationMessage: (message: string | null) => void,
  setNotificationType: (type: "success" | "error") => void,
  setIsLoading: (isLoading: boolean) => void,
  router: any
) => {
  if (!course) return;

  setIsLoading(true);
  setNotificationMessage(null);

  try {
    const totalDurationInHours = parseFloat(course.courseDuration);
    const numberOfChapters = course.chapters.length;
    const durationPerChapter =
      numberOfChapters > 0
        ? `${(totalDurationInHours / numberOfChapters).toFixed(2)} Hours`
        : course.courseDuration;

    const updatedChapters = await Promise.all(
      course.chapters.map(async (chapter) => {
        if (chapter.chapterTitle) {
          try {
            const generatedContent = await generateChapterContent(
              course.name,
              chapter.chapterTitle
            );
            const youtubeVideos = await getVideos(chapter.chapterTitle);
            const videoUrl =
              youtubeVideos.length > 0
                ? `https://www.youtube.com/watch?v=${youtubeVideos[0].id.videoId}`
                : "";

            return {
              ...chapter,
              content: [
                {
                  type: "text",
                  title: generatedContent.title,
                  description: generatedContent.description,
                  duration: durationPerChapter,
                  metadata: {
                    // codeExample: generatedContent.codeExample || "",
                    formula: generatedContent.formula || "",
                    example: generatedContent.example || "",
                  },
                },
                {
                  type: "video",
                  title:
                    youtubeVideos.length > 0
                      ? youtubeVideos[0].snippet.title
                      : "No video available",
                  description:
                    youtubeVideos.length > 0
                      ? youtubeVideos[0].snippet.description
                      : "",
                  duration: durationPerChapter,
                  metadata: {
                    videoUrl: videoUrl,
                    channelTitle:
                      youtubeVideos.length > 0
                        ? youtubeVideos[0].snippet.channelTitle
                        : "",
                    thumbnailUrl:
                      youtubeVideos.length > 0
                        ? youtubeVideos[0].snippet.thumbnails.high.url
                        : "",
                  },
                },
              ],
            };
          } catch (error) {
            console.error("Error generating chapter content:", error);
            return { ...chapter, content: [] };
          }
        }
        return chapter;
      })
    );

    const savePayload = {
      courseId: course.courseId,
      chapters: updatedChapters.map((chapter) => ({
        chapterId: chapter.chapterId || generateUniqueId(),
        content: chapter.content,
        videoUrl: chapter.videoUrl || "",
      })),
    };

    const saveResponse = await fetch("/api/save-chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(savePayload),
    });

    if (saveResponse.ok) {
      const savedData = await saveResponse.json();
      setNotificationMessage("Chapters generated and saved successfully!");
      setNotificationType("success");
      setCourse({ ...course, chapters: savedData.savedChapters });
      // Redirect back to course editor page
      router.push(`/dealoforge/create-course/${course.courseId}`);
    } else {
      const errorData = await saveResponse.json();
      console.error("Error saving chapters:", errorData);
      throw new Error("Failed to generate or save chapters");
    }
  } catch (error) {
    console.error("Error generating or saving content:", error);
    setNotificationMessage("An error occurred while generating content.");
    setNotificationType("error");
  } finally {
    setIsLoading(false);
  }
};
