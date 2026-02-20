import mongoose, { Schema, Document } from "mongoose";

export interface IScratchCard {
  pin: string;
  serial: string;
  examType: string;
  phone: string;
  status: string;
  expiryDate: Date;
}

export interface IScratchCardTransaction extends Document {
  transactionId: string;
  examType: string;
  quantity: number;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  totalAmount: number;
  apiAmount: number;
  profit: number;
  status: "pending" | "completed" | "failed" | "refunded";
  scratchCards: IScratchCard[];
  paymentMethod: string;
  paymentReference?: string;
  externalApiResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const scratchCardSchema = new Schema<IScratchCard>({
  pin: { type: String, required: true },
  serial: { type: String, required: true },
  examType: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: "active" },
  expiryDate: { type: Date, required: true },
});

const scratchCardTransactionSchema = new Schema<IScratchCardTransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    examType: {
      type: String,
      required: true,
      enum: ["WAEC", "NECO", "JAMB"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    customerEmail: {
      type: String,
      required: true,
      index: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    apiAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    profit: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    scratchCards: [scratchCardSchema],
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "bank_transfer", "wallet", "paystack", "flutterwave"],
    },
    paymentReference: {
      type: String,
      index: true,
    },
    externalApiResponse: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
scratchCardTransactionSchema.index({ createdAt: -1 });
scratchCardTransactionSchema.index({ examType: 1, status: 1 });
scratchCardTransactionSchema.index({ customerEmail: 1, createdAt: -1 });

// Prevent duplicate transaction IDs
scratchCardTransactionSchema.index({ transactionId: 1 }, { unique: true });

export const ScratchCardTransactionModel =
  mongoose.models.ScratchCardTransaction ||
  mongoose.model<IScratchCardTransaction>(
    "ScratchCardTransaction",
    scratchCardTransactionSchema
  );





