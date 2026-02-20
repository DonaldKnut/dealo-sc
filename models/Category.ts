// models/Category.ts
import mongoose, { Schema, model, Document, Types, models } from "mongoose";

// Define the Category interface extending Document
export interface Category extends Document {
  _id: Types.ObjectId; // Explicitly type _id as ObjectId
  name: string;
  subCategories: Schema.Types.ObjectId[];
}

const CategorySchema = new Schema<Category>({
  name: { type: String, required: true, unique: true },
  subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
});

export const CategoryModel =
  models.Category || model<Category>("Category", CategorySchema);
