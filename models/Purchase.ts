import { Schema, Types, model, Document, models } from "mongoose";

interface PurchaseDocument extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  amount: number;
  paymentDate: Date;
}

const PurchaseSchema = new Schema<PurchaseDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
});

// Check if the model already exists to prevent overwriting
export const PurchaseModel =
  models.Purchase || model<PurchaseDocument>("Purchase", PurchaseSchema);
