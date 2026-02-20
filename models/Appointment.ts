import { Schema, model, Document } from "mongoose";

interface Appointment extends Document {
  patientId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  date: Date;
  reason: string;
  notes?: string;
}

const AppointmentSchema = new Schema<Appointment>({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "PatientInfo",
    required: true,
  },
  doctorId: { type: Schema.Types.ObjectId, ref: "DoctorInfo", required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  notes: { type: String },
});

export const AppointmentModel = model<Appointment>(
  "Appointment",
  AppointmentSchema
);
