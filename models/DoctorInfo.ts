// models/DoctorInfo.ts
import { Schema, model, models, Document } from "mongoose";

export interface DoctorInfo extends Document {
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  certificateUrl?: string;
}

const DoctorInfoSchema = new Schema<DoctorInfo>(
  {
    specialization: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    bio: { type: String, required: true },
    certificateUrl: { type: String },
  },
  { timestamps: true }
);

export const DoctorInfoModel =
  models.DoctorInfo || model<DoctorInfo>("DoctorInfo", DoctorInfoSchema);
