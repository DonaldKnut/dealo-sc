import { Schema, model, Document } from "mongoose";

interface Certificate extends Document {
  courseId: Schema.Types.ObjectId; // Course ID
  userId: Schema.Types.ObjectId; // User ID
  date: Date;
}

const CertificateSchema = new Schema<Certificate>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
});

export const CertificateModel = model<Certificate>(
  "Certificate",
  CertificateSchema
);
