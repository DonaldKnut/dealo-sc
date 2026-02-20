// MuxData Model
import { Schema, model, Document } from "mongoose";

export interface MuxData extends Document {
  assetId: string;
  playbackId: string;
  sectionId: Schema.Types.ObjectId;
}

const MuxDataSchema = new Schema<MuxData>({
  assetId: { type: String, required: true },
  playbackId: { type: String, required: true },
  sectionId: {
    type: Schema.Types.ObjectId,
    ref: "Section",
    unique: true,
    required: true,
  },
});

export const MuxDataModel = model<MuxData>("MuxData", MuxDataSchema);
