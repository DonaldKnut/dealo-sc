// models/Company.ts
import { Schema, model, models, Document } from "mongoose";

export interface Company extends Document {
  companyName: string;
  industry: string;
  companyWebsite: string;
  certificateUrl: string;
  address: string;
  phoneNumber: string;
  xAccount: string;
  about: string;
  imageUrl: string;
}

const CompanySchema = new Schema<Company>(
  {
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    companyWebsite: { type: String, required: true },
    certificateUrl: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    xAccount: { type: String, required: true },
    about: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const CompanyModel =
  models.Company || model<Company>("Company", CompanySchema);
