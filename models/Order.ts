import { Schema, model, models, Document } from "mongoose";

// Define the OrderItem interface
export interface IOrderItem extends Document {
  work: Schema.Types.ObjectId; // Reference to the purchased work
  quantity: number;
  price: number; // Price at the time of purchase
}

// Define the Order interface
export interface IOrder extends Document {
  user: Schema.Types.ObjectId; // Reference to the User model
  freelancer?: Schema.Types.ObjectId; // Freelancer fulfilling the order
  items: IOrderItem[];
  totalAmount: number; // Total price of all items in the order
  orderedAt: Date;
  status: "pending" | "in-progress" | "completed" | "disputed"; // Escrow status
  escrowAmount: number; // Amount held in escrow
  requirements?: string; // Buyer's requirements/brief
  isSubmitted?: boolean; // Freelancer submitted work for review
  submittedAt?: Date;
  platformFee?: number; // Amount taken by platform
  freelancerPayout?: number; // Amount to pay freelancer
  releasedAt?: Date; // Date when funds were released
}

// Create the OrderItem schema
const OrderItemSchema = new Schema<IOrderItem>({
  work: { type: Schema.Types.ObjectId, ref: "Work", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

// Create the Order schema
const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: Schema.Types.ObjectId, ref: "User" },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true }, // Store the total amount for the order
    orderedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "disputed"],
      default: "pending",
    },
    escrowAmount: { type: Number, required: true }, // Amount held in escrow
    requirements: { type: String },
    isSubmitted: { type: Boolean, default: false },
    submittedAt: { type: Date },
    platformFee: { type: Number },
    freelancerPayout: { type: Number },
    releasedAt: { type: Date }, // Date when funds were released
  },
  { timestamps: true }
);

// Export the Order model
export const OrderModel = models.Order || model<IOrder>("Order", OrderSchema);
