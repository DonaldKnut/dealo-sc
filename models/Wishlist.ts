import { Schema, model, models, Document } from "mongoose";

export interface WishlistItem {
  workId: Schema.Types.ObjectId;
  addedAt: Date;
}

export interface Wishlist extends Document {
  userId: Schema.Types.ObjectId;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<Wishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        workId: {
          type: Schema.Types.ObjectId,
          ref: "Work",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

WishlistSchema.index({ userId: 1 });
WishlistSchema.index({ "items.workId": 1 });

export const WishlistModel =
  models.Wishlist || model<Wishlist>("Wishlist", WishlistSchema);
