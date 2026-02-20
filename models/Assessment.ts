import mongoose, { Schema, Document } from "mongoose";

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  professionId: mongoose.Types.ObjectId;
  status: "pending" | "in_progress" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
  totalCost: number;
  aiCost: number;
  expectedDuration: number; // minutes
  finalScore?: number;

  // Assessment type scores
  writtenScore?: number;
  practicalScore?: number;
  interviewScore?: number;
  portfolioScore?: number;
  caseStudyScore?: number;

  // Assessment type completion status
  writtenCompleted?: boolean;
  practicalCompleted?: boolean;
  interviewCompleted?: boolean;
  portfolioCompleted?: boolean;
  caseStudyCompleted?: boolean;

  // Questions for each type
  writtenQuestions?: any[];
  practicalQuestions?: any[];
  interviewQuestions?: any[];
  portfolioQuestions?: any[];
  caseStudyQuestions?: any[];

  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professionId: {
      type: Schema.Types.ObjectId,
      ref: "Profession",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "failed"],
      default: "pending",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    aiCost: {
      type: Number,
      default: 0,
    },
    expectedDuration: {
      type: Number,
      required: true,
    },
    finalScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    // Assessment type scores
    writtenScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    practicalScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    interviewScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    portfolioScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    caseStudyScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    // Assessment type completion status
    writtenCompleted: {
      type: Boolean,
      default: false,
    },
    practicalCompleted: {
      type: Boolean,
      default: false,
    },
    interviewCompleted: {
      type: Boolean,
      default: false,
    },
    portfolioCompleted: {
      type: Boolean,
      default: false,
    },
    caseStudyCompleted: {
      type: Boolean,
      default: false,
    },

    // Questions for each type
    writtenQuestions: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    practicalQuestions: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    interviewQuestions: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    portfolioQuestions: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    caseStudyQuestions: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
AssessmentSchema.index({ userId: 1, professionId: 1 });
AssessmentSchema.index({ status: 1 });
AssessmentSchema.index({ createdAt: -1 });

export const Assessment =
  mongoose.models.Assessment ||
  mongoose.model<IAssessment>("Assessment", AssessmentSchema);
