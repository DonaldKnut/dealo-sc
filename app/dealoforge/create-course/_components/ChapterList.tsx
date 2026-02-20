// File: ChapterList.tsx

import React from "react";
import { ChapterContent } from "../../_components/_courseComponents/courseTypes";
import { BookOpenIcon, FileTextIcon } from "lucide-react"; // Import icons from lucide-react

type Chapter = {
  chapterId?: string;
  chapter_name?: string;
  chapterTitle?: string;
  chapter_description?: string;
  chapterDescription?: string;
  duration?: string;
  content?: string | ChapterContent[];
  video_url?: string;
  videoUrl?: string;
  video_urls?: string[];
  exercises?: string[];
};

type Course = {
  name: string;
  noOfChapters: number;
  chapters: Chapter[];
};

type ChapterListProps = {
  course: Course;
};

// Helper function to handle multiple naming conventions
const getChapterField = (
  chapter: Chapter,
  primary: keyof Chapter,
  fallback: keyof Chapter
): string => {
  const field = chapter[primary] ?? chapter[fallback];
  return typeof field === "string" ? field : "No data available";
};

const ChapterList: React.FC<ChapterListProps> = ({ course }) => {
  if (!course.chapters || course.chapters.length === 0) {
    return (
      <p className="text-center text-green-600">
        No chapters available for this course.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-4 w-[85%]">
      {course.chapters.map((chapter, index) => (
        <div
          key={chapter.chapterId || index}
          className="bg-white p-6 rounded-lg shadow-lg border border-green-100"
        >
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="text-green-600 h-6 w-6" />
            <h2 className="text-2xl font-semibold text-green-700">
              Chapter {index + 1}
            </h2>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <FileTextIcon className="text-green-500 h-5 w-5" />
              <p className="text-lg text-green-800 font-medium">
                {getChapterField(chapter, "chapter_name", "chapterTitle")}
              </p>
            </div>

            <p className="text-green-700 mt-2">
              {getChapterField(
                chapter,
                "chapter_description",
                "chapterDescription"
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChapterList;
