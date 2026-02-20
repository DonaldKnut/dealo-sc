import { Schema, model, Document, Types, models } from "mongoose";

// Define and export the Level interface
export interface Level extends Document {
  name: string;
  courses: Types.ObjectId[]; // Array of Course IDs
}

// Define the schema for Level
const LevelSchema = new Schema<Level>({
  name: { type: String, required: true, unique: true },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

// Export the Level model
export const LevelModel = models.Level || model<Level>("Level", LevelSchema);
