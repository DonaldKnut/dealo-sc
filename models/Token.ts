import { Schema, model, models, Document } from "mongoose";

export interface Token {
  userId: Schema.Types.ObjectId; // Reference to the user
  token: string; // The verification token
  type: "emailVerification" | "passwordReset"; // Token type
  expiresAt: Date; // Token expiration time
}

export interface TokenDocument extends Document, Token {}

const TokenSchema = new Schema<TokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["emailVerification", "passwordReset"],
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const TokenModel =
  models.Token || model<TokenDocument>("Token", TokenSchema);
