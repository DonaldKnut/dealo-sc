import { Schema, model, models, Document } from "mongoose";

export type QuestionType = "multiple_choice" | "text";

export interface Question {
  quiz: Schema.Types.ObjectId;
  text: string;
  type: QuestionType;
  options?: string[]; // For multiple-choice
  correctAnswer?: string; // For MCQ
  aiExpectedKeywords?: string[]; // For free-text answers
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionDocument extends Document, Question {}

const QuestionSchema = new Schema<QuestionDocument>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["multiple_choice", "text"],
      required: true,
    },
    options: {
      type: [String],
      required: function () {
        return this.type === "multiple_choice";
      },
    },
    correctAnswer: {
      type: String,
      required: function () {
        return this.type === "multiple_choice";
      },
    },
    aiExpectedKeywords: {
      type: [String],
      required: function () {
        return this.type === "text";
      },
    },
    explanation: { type: String },
  },
  { timestamps: true }
);

export const QuestionModel =
  models.Question || model<QuestionDocument>("Question", QuestionSchema);
