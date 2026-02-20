import { Schema, model, Document, Types } from "mongoose";

interface StripeCustomerDocument extends Document {
  customerId: Types.ObjectId;
  stripeCustomerId: string;
}

const StripeCustomerSchema = new Schema<StripeCustomerDocument>({
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stripeCustomerId: { type: String, required: true },
});

export const StripeCustomerModel = model<StripeCustomerDocument>(
  "StripeCustomer",
  StripeCustomerSchema
);
