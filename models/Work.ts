import { Schema, model, models, Document } from "mongoose";

export interface IWork extends Document {
  creator: Schema.Types.ObjectId; // now using ObjectId to reference the User model
  category: string;
  title: string;
  description: string;
  price: number;
  workMedia: { url: string; type: "image" | "video" }[];
  deliveryDate: Date;
  deliveryTime: string;
  skills: string[];
  contactInfo: {
    email: string;
    phone: string;
  };
  experienceLevel: "Junior" | "Mid" | "Senior";
  portfolioLink: string;
  languagesSpoken?: string[];
  certifications?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkSchema = new Schema<IWork>(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User", // <-- this is crucial for populate()
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    workMedia: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
      },
    ],
    deliveryDate: {
      type: Date,
      required: true,
    },
    deliveryTime: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (skills: string[]) => skills.length > 0,
        message: "At least one skill is required",
      },
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
        validate: {
          validator: function (v: string) {
            return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
          },
          message: "Invalid email format",
        },
      },
      phone: {
        type: String,
        required: true,
      },
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["Junior", "Mid", "Senior"],
    },
    portfolioLink: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+\..+$/.test(v);
        },
        message: "Invalid URL format",
      },
    },
    languagesSpoken: {
      type: [String],
    },
    certifications: {
      type: [String],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add indexes for performance
WorkSchema.index({ category: 1, createdAt: -1 });
WorkSchema.index({ creator: 1, createdAt: -1 });
WorkSchema.index({ createdAt: -1 });

// Note: If you add a status field later, add: WorkSchema.index({ status: 1, category: 1 });

const Work = models.Work || model<IWork>("Work", WorkSchema);

export default Work;
