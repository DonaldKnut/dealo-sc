import { Schema, model, Document } from "mongoose";

interface PatientInfo extends Document {
  userId: Schema.Types.ObjectId;
  birthDate: Date;
  gender: string;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType: string;
  identificationNumber: string;
  identificationDocument: string;
  privacyConsent: boolean;
  appointments: Schema.Types.ObjectId[];
  reviews: Schema.Types.ObjectId[];
}

const PatientInfoSchema = new Schema<PatientInfo>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  occupation: { type: String, required: true },
  emergencyContactName: { type: String, required: true },
  emergencyContactNumber: { type: String, required: true },
  primaryPhysician: { type: String, required: true },
  insuranceProvider: { type: String, required: true },
  insurancePolicyNumber: { type: String, required: true },
  allergies: { type: String },
  currentMedication: { type: String },
  familyMedicalHistory: { type: String },
  pastMedicalHistory: { type: String },
  identificationType: { type: String, required: true },
  identificationNumber: { type: String, required: true },
  identificationDocument: { type: String, required: true },
  privacyConsent: { type: Boolean, required: true },
  appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

export const PatientInfoModel = model<PatientInfo>(
  "PatientInfo",
  PatientInfoSchema
);
