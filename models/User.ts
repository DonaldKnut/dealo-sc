// models/User.ts
import { Schema, model, models, Document } from "mongoose";
import { Role, Status } from "@/types/role";

export enum ServiceCategory {
  DRY_CLEANING = "Dry Cleaning",
  LAUNDRY = "Laundry",
  ERRAND = "Errand",
  PLUMBING = "Plumbing",
  ELECTRICAL_REPAIR = "Electrical Repair",
  DELIVERY = "Delivery",
  HOME_CLEANING = "Home Cleaning",
  TAILORING = "Tailoring",
  OTHERS = "Others",
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
  password: string;
  phone?: string;
  role: Role;
  isEmailVerified?: boolean;
  emailVerificationCode?: string;
  emailVerificationCodeExpires?: Date;
  dateOfBirth: Date;
  isTeenAccount: boolean;
  isCertified: boolean;
  isVerified: boolean;
  isProfileComplete?: boolean; // ✅ Added to interface
  interests?: string[]; // ✅ Added for onboarding
  experience?: string; // ✅ Added for onboarding
  certifications: Schema.Types.ObjectId[];
  certificationAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  patientInfo?: Schema.Types.ObjectId;
  doctorInfo?: Schema.Types.ObjectId;
  freelancerInfo?: Schema.Types.ObjectId;
  instructorInfo?: Schema.Types.ObjectId;
  studentInfo?: Schema.Types.ObjectId;
  jobSeekerInfo?: Schema.Types.ObjectId;
  company?: Schema.Types.ObjectId;
  travelLoans: Schema.Types.ObjectId[];
  payments: Schema.Types.ObjectId[];
  ratings: Schema.Types.ObjectId[];
  reviews: Schema.Types.ObjectId[];
  jobs: Schema.Types.ObjectId[];
  courses: Schema.Types.ObjectId[];
  purchases: Schema.Types.ObjectId[];
  avatar?: string;
  wishlist: Schema.Types.ObjectId[];
  cart: Schema.Types.ObjectId[];
  orders: Schema.Types.ObjectId[];
  works: Schema.Types.ObjectId[];
  credits: number;
  bids: Schema.Types.ObjectId[];
  status: Status;
  conversations: Schema.Types.ObjectId[];
  messages: Schema.Types.ObjectId[];
  connections: Schema.Types.ObjectId[];
  friendRequestsSent: Schema.Types.ObjectId[];
  friendRequestsReceived: Schema.Types.ObjectId[];
  servicesOffered: ServiceCategory[];
  serviceArea?: string;
  isAvailable?: boolean;
  availableDays?: string[];
  availabilitySlots?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  // Storage tracking for instructors
  videoStorageUsed?: number; // Total bytes used for videos (default: 0)
  videoStorageQuota?: number; // Quota in bytes (default: 450MB for MVP)
}

export interface UserDocument extends Document, Omit<User, "_id"> {}

const UserSchema = new Schema<UserDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: Object.values(Role) },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String },
    emailVerificationCodeExpires: { type: Date },
    dateOfBirth: { type: Date },
    isTeenAccount: { type: Boolean, default: false },
    isCertified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false }, // ✅ Added to schema
    interests: [{ type: String }], // ✅ Added for onboarding
    experience: { type: String }, // ✅ Added for onboarding
    certifications: [{ type: Schema.Types.ObjectId, ref: "Certification" }],
    certificationAttempts: { type: Number, default: 0 },
    patientInfo: { type: Schema.Types.ObjectId, ref: "PatientInfo" },
    doctorInfo: { type: Schema.Types.ObjectId, ref: "DoctorInfo" },
    freelancerInfo: { type: Schema.Types.ObjectId, ref: "FreelancerInfo" },
    instructorInfo: { type: Schema.Types.ObjectId, ref: "InstructorInfo" },
    studentInfo: { type: Schema.Types.ObjectId, ref: "StudentInfo" },
    jobSeekerInfo: { type: Schema.Types.ObjectId, ref: "JobSeeker" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    travelLoans: [{ type: Schema.Types.ObjectId, ref: "TravelLoan" }],
    payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    jobs: [{ type: Schema.Types.ObjectId, ref: "JobPost" }],
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    purchases: [{ type: Schema.Types.ObjectId, ref: "Purchase" }],
    avatar: { type: String },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "WishlistItem" }],
    cart: [{ type: Schema.Types.ObjectId, ref: "CartItem" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    works: [{ type: Schema.Types.ObjectId, ref: "Work" }],
    credits: { type: Number, default: 5, min: 0 },
    bids: [{ type: Schema.Types.ObjectId, ref: "Bid" }],
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.UNVERIFIED, // ✅ New users start as unverified
    },
    conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    connections: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isAdmin: { type: Boolean, default: false },
    servicesOffered: {
      type: [String],
      enum: Object.values(ServiceCategory),
      default: [],
    },
    serviceArea: { type: String },
    isAvailable: { type: Boolean, default: true },
    availableDays: {
      type: [String],
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    availabilitySlots: [
      {
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
        default: [0, 0],
      },
    },
    // Storage tracking for instructors (450MB default)
    videoStorageUsed: { type: Number, default: 0, min: 0 },
    videoStorageQuota: { type: Number, default: 471859200 }, // 450MB in bytes
  },
  { timestamps: true }
);

// Add indexes for performance
// Note: email index is automatically created by unique: true, so we don't need to add it explicitly
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ isEmailVerified: 1, status: 1 });
UserSchema.index({ createdAt: -1 });

export const UserModel = models.User || model<UserDocument>("User", UserSchema);
