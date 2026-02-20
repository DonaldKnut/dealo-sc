import mongoose, { Schema, Document } from "mongoose";

export interface IProfession extends Document {
  name: string;
  category: string;
  complexity: number; // 1-5 scale
  description: string;
  pricing: number;
  duration: string; // e.g., "3-4 hours"
  config: {
    assessments: Array<{
      type: string;
      duration: number;
      questions: number;
      aiModel: string;
      cost: number;
      weight: number;
    }>;
    totalCost: number;
    margin: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfessionSchema = new Schema<IProfession>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    complexity: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    description: {
      type: String,
      required: true,
    },
    pricing: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    config: {
      assessments: [
        {
          type: {
            type: String,
            required: true,
          },
          duration: {
            type: Number,
            required: true,
          },
          questions: {
            type: Number,
            required: true,
          },
          aiModel: {
            type: String,
            required: true,
          },
          cost: {
            type: Number,
            required: true,
          },
          weight: {
            type: Number,
            required: true,
          },
        },
      ],
      totalCost: {
        type: Number,
        required: true,
      },
      margin: {
        type: Number,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ProfessionSchema.index({ category: 1 });
ProfessionSchema.index({ complexity: 1 });
ProfessionSchema.index({ isActive: 1 });

export const Profession =
  mongoose.models.Profession ||
  mongoose.model<IProfession>("Profession", ProfessionSchema);
