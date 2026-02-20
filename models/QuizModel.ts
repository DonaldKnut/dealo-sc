import { Role } from "@/types/role";
import { Schema, model, models, Document } from "mongoose";

export interface Quiz {
  title: string;
  description?: string;
  field: string; // e.g., "Frontend", "Design", etc.
  role: Role;
  passMark: number;
  timeLimit: number; // In minutes
  totalQuestions: number;
  source: "manual" | "ai";
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizDocument extends Document, Quiz {}

const QuizSchema = new Schema<QuizDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    field: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true },
    passMark: { type: Number, default: 70 },
    timeLimit: { type: Number, default: 20 },
    totalQuestions: { type: Number, default: 10 },
    source: { type: String, enum: ["manual", "ai"], default: "ai" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const QuizModel = models.Quiz || model<QuizDocument>("Quiz", QuizSchema);
