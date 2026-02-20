import { Schema, model, models, Document } from "mongoose";

export interface CartItem extends Document {
  workId: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  addedAt: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    workId: { type: Schema.Types.ObjectId, ref: "Work", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CartItemModel =
  models.CartItem || model<CartItem>("CartItem", CartItemSchema);
