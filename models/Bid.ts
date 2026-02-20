import { Schema, model, models, Document } from "mongoose";

export interface Bid extends Document {
  user: Schema.Types.ObjectId; // Reference to the user placing the bid
  project: Schema.Types.ObjectId; // Reference to the project being bid on
  amount: number; // Amount of the bid
  status: "PENDING" | "ACCEPTED" | "REJECTED"; // Status of the bid
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema = new Schema<Bid>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const BidModel = models.Bid || model<Bid>("Bid", BidSchema);
