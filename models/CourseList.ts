import { Schema, model, models, Types, Document } from "mongoose";

// Define the levels as an enum for type safety
export enum Level {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCE = "ADVANCE",
}

// Define Video Interface
interface Video {
  title: string;
  description: string;
  channelTitle: string;
  videoUrl: string;
  thumbnail: string;
}

// Define CourseOutput Interface with flexible chapters structure
interface CourseOutput {
  overview: string;
  chapters: Array<{
    chapter_number?: number;
    chapter_title?: string;
    chapter_description?: string;
    topics?: string[];
    video_lectures?: Array<{
      lecture_title: string;
      lecture_description?: string;
      duration: string;
    }>;
  }>;
}

// Define the main CourseList interface extending Document
export interface CourseList extends Document {
  _id: Types.ObjectId;
  name: string;
  category: string;
  level: Level;
  courseOutput: CourseOutput;
  videos?: Video[];
  createdBy: Types.ObjectId;
  courseDuration: string;
  noOfChapters: number;
  addVideo?: boolean;
  courseBanner?: string;
  publish?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Video sub-schema
const VideoSchema = new Schema<Video>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  channelTitle: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, required: true },
});

// Define the CourseList schema
const CourseListSchema = new Schema<CourseList>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, enum: Object.values(Level), required: true },
    courseOutput: {
      overview: { type: String, default: "No overview available." },
      chapters: [
        {
          chapter_number: { type: Number, default: 1 },
          chapter_title: { type: String, default: "Untitled Chapter" },
          chapter_description: {
            type: String,
            default: "No description provided",
          },
          topics: [{ type: String }],
          video_lectures: [
            {
              lecture_title: { type: String, required: true },
              lecture_description: { type: String, default: "No description" },
              duration: { type: String, required: true },
            },
          ],
        },
      ],
    },
    videos: { type: [VideoSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseDuration: { type: String, required: true },
    noOfChapters: { type: Number, required: true },
    addVideo: { type: Boolean, default: false },
    courseBanner: { type: String, default: "" },
    publish: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Function to populate `createdBy` field with user's firstName and avatar
CourseListSchema.methods.populateCreatedBy = async function () {
  return this.populate({
    path: "createdBy",
    select: "firstName avatar",
  }).execPopulate();
};

// Export the model
const CourseListModel =
  models.CourseList || model<CourseList>("CourseList", CourseListSchema);

export { CourseListModel };
