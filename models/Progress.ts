import { Schema, model, models, Document, Types } from "mongoose";

interface Progress extends Document {
  studentId: Types.ObjectId; // Use ObjectId for StudentInfo ID
  sectionId: Types.ObjectId; // Use ObjectId for Section ID
  completed: boolean;
}

const ProgressSchema = new Schema<Progress>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "StudentInfo",
    required: true,
  },
  sectionId: {
    type: Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Export the Progress model - check if it already exists to prevent overwrite errors in Next.js dev mode
export const ProgressModel = models.Progress || model<Progress>("Progress", ProgressSchema);
