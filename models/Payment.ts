import { Schema, model, Document } from "mongoose";

interface Payment extends Document {
  userId: Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
  amount: number;
  status: string;
  method: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<Payment>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    unique: true,
    required: true,
  },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  method: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PaymentModel = model<Payment>("Payment", PaymentSchema);
