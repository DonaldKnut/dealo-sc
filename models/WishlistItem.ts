// models/WishlistItem.ts
import { Schema, model, models, Document } from "mongoose";

// Enum for different types of wishlist items
export enum WishlistItemType {
  JOB = "Job",
  FREELANCE_GIG = "FreelanceGig",
  COURSE = "Course",
}

// Interface for WishlistItem
export interface IWishlistItem extends Document {
  user: Schema.Types.ObjectId; // References the User model
  refId: Schema.Types.ObjectId; // References the specific item (Job, FreelanceGig, or Course)
  refType: WishlistItemType; // Specifies the type of the referenced item
  addedAt: Date;
}

// Define the WishlistItem schema
const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    refType: {
      type: String,
      enum: Object.values(WishlistItemType),
      required: true,
    },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the WishlistItem model
export const WishlistItemModel =
  models.WishlistItem ||
  model<IWishlistItem>("WishlistItem", WishlistItemSchema);
