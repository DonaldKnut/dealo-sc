"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Type Definitions
interface ChapterContent {
  title: string;
  description: string;
  metadata?: {
    example?: string;
    formula?: string;
    codeExample?: string;
  };
}

interface Chapter {
  chapterId: string;
  chapterTitle: string;
  chapterDescription: string;
  content: ChapterContent[];
  videoUrl?: string;
}

interface Course {
  name: string;
  category: string;
  level: string;
  courseDuration: string;
  chapters?: Chapter[];
}

// Utility Function to Fetch Course Details
const fetchCourseDetails = async (
  courseId: string,
  setCourse: (course: Course) => void,
  setNotificationMessage: (message: string | null) => void,
  setNotificationType: (type: "success" | "error") => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  try {
    setIsLoading(true);
    // Use the dashboard endpoint which handles both CourseListModel and CourseModel
    const response = await fetch(`/api/dashboard/courses/${courseId}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch course details.");
    }
    
    const data = await response.json();
    
    // Normalize the data to match Course interface
    const normalizedCourse: Course = {
      name: data.name || data.title || "Untitled Course",
      category: data.category || "Uncategorized",
      level: data.level || "All levels",
      courseDuration: data.courseDuration || "0 hours",
      chapters: (() => {
        // Safely extract chapters from various possible structures
        const chaptersData = data.courseOutput?.chapters || data.chapters || [];
        if (!Array.isArray(chaptersData)) {
          return [];
        }
        return chaptersData.map((ch: any, idx: number) => ({
          chapterId: ch.chapterId || ch._id?.toString() || `chapter-${idx}`,
          chapterTitle: ch.chapter_title || ch.chapterTitle || `Chapter ${idx + 1}`,
          chapterDescription: ch.chapter_description || ch.chapterDescription || "",
          content: (() => {
            // Safely extract content
            if (Array.isArray(ch.content)) {
              return ch.content;
            }
            if (Array.isArray(ch.video_lectures)) {
              return ch.video_lectures.map((lec: any) => ({
                title: lec.lecture_title || lec.title || "Untitled",
                description: lec.lecture_description || lec.description || "",
                metadata: {},
              }));
            }
            return [];
          })(),
          videoUrl: ch.video_url || ch.videoUrl || "",
        }));
      })(),
    };
    
    setCourse(normalizedCourse);
    setNotificationType("success");
    setNotificationMessage(null);
  } catch (error) {
    console.error("Error fetching course:", error);
    setNotificationType("error");
    setNotificationMessage("An error occurred while fetching course details.");
  } finally {
    setIsLoading(false);
  }
};

// Component
const CoursePage: React.FC = () => {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(
        courseId,
        setCourse,
        setNotificationMessage,
        setNotificationType,
        setIsLoading
      );
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center mt-10 text-white">Loading...</div>
      </div>
    );
  }

  if (notificationMessage && notificationType === "error") {
    return (
      <div className="text-center text-red-600 mt-10">
        {notificationMessage}
      </div>
    );
  }

  // Don't render if course is not loaded yet
  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center mt-10 text-white">Loading course...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 w-[90%]">
      <div className="flex justify-center items-center">
        <Image src="/dealoforge_.png" alt="" width={380} height={380} />
      </div>
      <h1 className="text-3xl font-bold text-[#ccc] mb-5">{course.name || "Untitled Course"}</h1>
      <p className="text-[#50b72e] mb-10">
        Category: <span className="font-semibold">{course.category || "Uncategorized"}</span>{" "}
        <br /> Level: <span className="font-semibold">{course.level || "All levels"}</span>{" "}
        <br /> Duration:{" "}
        <span className="font-semibold">{course.courseDuration || "0 hours"}</span>
      </p>

      {/* Chapters Section */}
      <div className="space-y-8">
        {course.chapters && Array.isArray(course.chapters) && course.chapters.length > 0 ? (
          course.chapters.map((chapter, index) => (
            <div
              key={chapter.chapterId || index}
              className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-white">
                {chapter.chapterTitle || `Chapter ${index + 1}`}
              </h2>
              <p className="mt-2 text-gray-700">
                {chapter.chapterDescription || "No description available"}
              </p>

              {/* Content List */}
              <div className="mt-4 space-y-4">
                {chapter.content && Array.isArray(chapter.content) && chapter.content.length > 0 ? (
                  chapter.content.map((contentItem, idx) => (
                    <div key={idx} className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-xl font-medium text-gray-800">
                        {contentItem.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {contentItem.description}
                      </p>
                      {contentItem.metadata && (
                        <div className="mt-2">
                          {contentItem.metadata.example && (
                            <p className="text-gray-600 mb-2">
                              <span className="font-semibold">Example:</span>{" "}
                              {contentItem.metadata.example}
                            </p>
                          )}
                          {contentItem.metadata.formula && (
                            <p className="text-gray-600">
                              <span className="font-semibold">Formula:</span>{" "}
                              {contentItem.metadata.formula}
                            </p>
                          )}
                          {contentItem.metadata.codeExample && (
                            <div className="mt-2 bg-gray-200 p-2 rounded-lg">
                              <pre className="text-[#20512b]">
                                {contentItem.metadata.codeExample}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No content available for this chapter</p>
                )}
              </div>

              {/* Video Section */}
              {chapter.videoUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800">Video</h3>
                  <Link href={chapter.videoUrl} passHref>
                    <a
                      className="text-[#0e8d18] underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube
                    </a>
                  </Link>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-6 text-center">
            <p className="text-gray-400">No chapters available for this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
