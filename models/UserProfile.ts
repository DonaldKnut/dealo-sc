import mongoose, { Schema, Document } from "mongoose";

export interface IExperience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
}

export interface IEducation {
  degree: string;
  field: string;
  school: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  handle: string;
  headline: string;
  about: string;
  location: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  experiences: IExperience[];
  education: IEducation[];
  skills: string[];
  interests: string[];
  languages: string[];
  certifications: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
});

const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  field: { type: String, required: true },
  school: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  current: { type: Boolean, default: false },
  description: String,
});

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    handle: { type: String, required: true, unique: true, lowercase: true },
    headline: { type: String, required: true, maxlength: 200 },
    about: { type: String, maxlength: 2000 },
    location: { type: String, required: true },
    website: String,
    linkedin: String,
    twitter: String,
    github: String,
    experiences: [ExperienceSchema],
    education: [EducationSchema],
    skills: [String],
    interests: [String],
    languages: [String],
    certifications: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for search
UserProfileSchema.index({ handle: 1 });
UserProfileSchema.index({ skills: 1 });
UserProfileSchema.index({ location: 1 });
UserProfileSchema.index({ "experiences.company": 1 });
UserProfileSchema.index({ "education.school": 1 });

export const UserProfileModel = mongoose.model<IUserProfile>(
  "UserProfile",
  UserProfileSchema
);
