// courseTypes.ts
export interface ChapterContent {
  type: string;
  title: string;
  description: string;
  duration?: string;
  metadata?: {
    codeExample?: string;
    formula?: string;
    example?: string;
  };
}

export interface Chapter {
  chapterId: string;
  chapterTitle?: string;
  chapterDescription?: string;
  videoUrl?: string;
  video_urls?: string[];
  duration?: string;
  content?: string | ChapterContent[]; // Unified type definition here
}

export interface Course {
  courseId: string;
  name: string;
  category: string;
  level: string;
  courseDuration: string;
  noOfChapters: number;
  addVideo: boolean;
  chapters: Chapter[];
}
