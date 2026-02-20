// models/SubCategory.ts
import { Schema, model, Document, Types, models } from "mongoose";

// Define the SubCategory interface extending Document
interface SubCategory extends Document {
  _id: Types.ObjectId;
  name: string;
  categoryId: Types.ObjectId;
  courses: Types.ObjectId[];
}

const SubCategorySchema = new Schema<SubCategory>({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

export const SubCategoryModel =
  models.SubCategory || model<SubCategory>("SubCategory", SubCategorySchema);
