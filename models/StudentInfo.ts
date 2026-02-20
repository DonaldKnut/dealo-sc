import { Schema, model, models, Document } from "mongoose";

// Define the interface for the StudentInfo document
interface StudentInfo extends Document {
  userId: Schema.Types.ObjectId;
  bio: string;
  enrolledCourses: Schema.Types.ObjectId[];
  progress: Schema.Types.ObjectId[];
  reviews: Schema.Types.ObjectId[];
}

// Create the schema for StudentInfo
const StudentInfoSchema = new Schema<StudentInfo>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  bio: { type: String, required: true },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  progress: [{ type: Schema.Types.ObjectId, ref: "Progress" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

// Check if the model already exists before defining it
const StudentInfoModel =
  models.StudentInfo || model<StudentInfo>("StudentInfo", StudentInfoSchema);

export default StudentInfoModel;
