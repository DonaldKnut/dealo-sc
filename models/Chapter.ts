import { Schema, model, models, Types, Document } from "mongoose";

interface Metadata {
  codeExample?: string;
  formula?: string;
  example?: string;
  quiz?: {
    question?: string;
    options?: string[];
    answer?: string;
  };
}

interface Content {
  contentType?: string;
  title?: string;
  description?: string;
  duration?: string;
  metadata?: Metadata;
}

interface ChapterBase {
  courseId: Types.ObjectId | string;
  uuid: string;
  chapterId: string;
  chapterTitle: string;
  learningObjectives?: string[];
  videoUrl?: string;
  duration?: string;
  content?: Content[];
}

// Extend Document for compatibility with Mongoose
export interface Chapter extends ChapterBase, Document {}

const ChapterSchema = new Schema<Chapter>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "CourseList",
      required: true,
    },
    uuid: { type: String, required: true },
    chapterId: { type: String, required: true },
    chapterTitle: { type: String, required: true },
    learningObjectives: { type: [String], default: [] },
    videoUrl: { type: String, default: "" },
    duration: { type: String, default: "" },
    content: [
      {
        contentType: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        duration: { type: String, default: "" },
        metadata: {
          codeExample: { type: String, default: "" },
          formula: { type: String, default: "" },
          example: { type: String, default: "" },
          quiz: {
            question: { type: String, default: "" },
            options: { type: [String], default: [] },
            answer: { type: String, default: "" },
          },
        },
      },
    ],
  },
  { timestamps: true }
);

// Correctly define the model
export const ChapterModel =
  models.Chapter || model<Chapter>("Chapter", ChapterSchema);
