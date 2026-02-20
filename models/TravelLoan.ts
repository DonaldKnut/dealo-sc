import { Schema, model, Document } from "mongoose";

interface TravelLoan extends Document {
  userId: Schema.Types.ObjectId;
  amount: number;
  status: string;
  jurisdiction: string;
  issuedAt: Date;
  dueDate: Date;
  repaidAmount: number;
  outstanding: number;
}

const TravelLoanSchema = new Schema<TravelLoan>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  jurisdiction: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  repaidAmount: { type: Number, default: 0 },
  outstanding: { type: Number, required: true },
});

export const TravelLoanModel = model<TravelLoan>(
  "TravelLoan",
  TravelLoanSchema
);
