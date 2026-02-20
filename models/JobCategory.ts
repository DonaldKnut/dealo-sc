// models/JobCategory.ts
import { Schema, model, Document, Types, models } from "mongoose";
interface JobCategory extends Document {
  _id: Types.ObjectId;
  name: string;
  categoryId: Types.ObjectId;
  jobs: Schema.Types.ObjectId[];
}

const JobCategorySchema = new Schema<JobCategory>({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

export const JobCategoryModel =
  models.JobCategory || model<JobCategory>("JobCategory", JobCategorySchema);
