import { Schema, model, models, Document } from "mongoose";

export interface Resource extends Document {
  title: string;
  description?: string;
  url: string;
  type: string;
  sectionId: Schema.Types.ObjectId;
  uploaderId?: Schema.Types.ObjectId;
  courseId?: Schema.Types.ObjectId;
  sizeBytes?: number;
  isPaid: boolean;
  price?: number;
  currency?: string;
  downloads: number;
  purchases: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<Resource>(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    type: { type: String, required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: "User" },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    sizeBytes: { type: Number },
    isPaid: { type: Boolean, default: false },
    price: { type: Number },
    currency: { type: String, default: "NGN" },
    downloads: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ResourceModel =
  models.Resource || model<Resource>("Resource", ResourceSchema);
