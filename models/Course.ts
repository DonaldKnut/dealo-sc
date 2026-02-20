import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  instructor: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo: {
    url: string;
    duration: number; // in seconds
    thumbnail: string;
  };
  price: {
    amount: number;
    currency: string;
    originalPrice?: number;
    isFree: boolean;
  };
  category: string;
  subcategory?: string;
  tags: string[];
  level: "beginner" | "intermediate" | "advanced" | "all";
  language: string;
  duration: number; // total course duration in minutes
  lectures: number;
  sections: ICourseSection[];
  requirements: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  status: "draft" | "published" | "archived" | "pending_review";
  isPublished: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: {
    average: number;
    count: number;
    distribution: {
      five: number;
      four: number;
      three: number;
      two: number;
      one: number;
    };
  };
  enrollment: {
    total: number;
    thisMonth: number;
    thisWeek: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    instructorShare: number; // 70% of revenue
    platformShare: number; // 30% of revenue
  };
  certificates: {
    enabled: boolean;
    requirements: {
      completionPercentage: number;
      minimumTime: number; // in minutes
    };
  };
  access: {
    lifetime: boolean;
    expiresAt?: Date;
    maxViews?: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    lastModified: Date;
    version: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  settings: {
    allowReviews: boolean;
    allowQuestions: boolean;
    allowDownloads: boolean;
    showProgress: boolean;
    autoComplete: boolean;
  };
}

export interface ICourseSection {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  lectures: ICourseLecture[];
  isPublished: boolean;
}

export interface ICourseLecture {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: "video" | "audio" | "document" | "quiz" | "assignment";
  content: {
    url?: string;
    duration?: number; // in seconds
    fileSize?: number; // in bytes
    thumbnail?: string;
    transcript?: string;
    subtitles?: Array<{
      language: string;
      url: string;
    }>;
  };
  resources: Array<{
    title: string;
    url: string;
    type: string;
    fileSize?: number;
  }>;
  isPreview: boolean; // 5-second preview for non-enrolled users
  isPublished: boolean;
  order: number;
  requirements: {
    mustCompletePrevious: boolean;
    minimumTime?: number; // in seconds
  };
}

const CourseLectureSchema = new Schema<ICourseLecture>({
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["video", "audio", "document", "quiz", "assignment"],
    required: true,
  },
  content: {
    url: { type: String },
    duration: { type: Number },
    fileSize: { type: Number },
    thumbnail: { type: String },
    transcript: { type: String },
    subtitles: [
      {
        language: { type: String },
        url: { type: String },
      },
    ],
  },
  resources: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String },
      fileSize: { type: Number },
    },
  ],
  isPreview: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, required: true },
  requirements: {
    mustCompletePrevious: { type: Boolean, default: false },
    minimumTime: { type: Number },
  },
});

const CourseSectionSchema = new Schema<ICourseSection>({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  lectures: [CourseLectureSchema],
  isPublished: { type: Boolean, default: true },
});

const CourseSchema = new Schema<ICourse>(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    previewVideo: {
      url: { type: String, required: true },
      duration: { type: Number, required: true },
      thumbnail: { type: String },
    },
    price: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "NGN" },
      originalPrice: { type: Number, min: 0 },
      isFree: { type: Boolean, default: false },
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      index: true,
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all"],
      required: true,
    },
    language: {
      type: String,
      default: "English",
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    lectures: {
      type: Number,
      required: true,
      min: 0,
    },
    sections: [CourseSectionSchema],
    requirements: [
      {
        type: String,
      },
    ],
    learningOutcomes: [
      {
        type: String,
      },
    ],
    targetAudience: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived", "pending_review"],
      default: "draft",
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
      distribution: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 },
      },
    },
    enrollment: {
      total: { type: Number, default: 0, min: 0 },
      thisMonth: { type: Number, default: 0, min: 0 },
      thisWeek: { type: Number, default: 0, min: 0 },
    },
    revenue: {
      total: { type: Number, default: 0, min: 0 },
      thisMonth: { type: Number, default: 0, min: 0 },
      thisWeek: { type: Number, default: 0, min: 0 },
      instructorShare: { type: Number, default: 0, min: 0 },
      platformShare: { type: Number, default: 0, min: 0 },
    },
    certificates: {
      enabled: { type: Boolean, default: true },
      requirements: {
        completionPercentage: { type: Number, default: 80, min: 0, max: 100 },
        minimumTime: { type: Number, default: 0, min: 0 },
      },
    },
    access: {
      lifetime: { type: Boolean, default: true },
      expiresAt: { type: Date },
      maxViews: { type: Number },
    },
    metadata: {
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      publishedAt: { type: Date },
      lastModified: { type: Date, default: Date.now },
      version: { type: Number, default: 1 },
    },
    seo: {
      metaTitle: { type: String, maxlength: 60 },
      metaDescription: { type: String, maxlength: 160 },
      keywords: [String],
    },
    settings: {
      allowReviews: { type: Boolean, default: true },
      allowQuestions: { type: Boolean, default: true },
      allowDownloads: { type: Boolean, default: false },
      showProgress: { type: Boolean, default: true },
      autoComplete: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
CourseSchema.index({ instructor: 1, status: 1 });
CourseSchema.index({ category: 1, subcategory: 1, status: 1 });
CourseSchema.index({ isPublished: 1, isFeatured: 1 });
CourseSchema.index({ "rating.average": -1, enrollment: -1 });
CourseSchema.index({ "metadata.publishedAt": -1 });
CourseSchema.index({ tags: 1, status: 1 });

// Virtual for formatted price
CourseSchema.virtual("formattedPrice").get(function () {
  if (this.price.isFree) return "Free";
  return `${this.price.currency} ${this.price.amount.toLocaleString()}`;
});

// Virtual for formatted duration
CourseSchema.virtual("formattedDuration").get(function () {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Virtual for completion percentage
CourseSchema.virtual("completionPercentage").get(function () {
  if (!this.sections.length) return 0;
  const totalLectures = this.sections.reduce(
    (sum, section) => sum + section.lectures.length,
    0
  );
  return totalLectures > 0
    ? Math.round((totalLectures / totalLectures) * 100)
    : 0;
});

// Method to calculate revenue
CourseSchema.methods.calculateRevenue = function (saleAmount: number) {
  const instructorShare = saleAmount * 0.7; // 70% to instructor
  const platformShare = saleAmount * 0.3; // 30% to platform

  this.revenue.total += saleAmount;
  this.revenue.instructorShare += instructorShare;
  this.revenue.platformShare += platformShare;

  return { instructorShare, platformShare };
};

// Method to update rating
CourseSchema.methods.updateRating = function (newRating: number) {
  const oldAverage = this.rating.average;
  const oldCount = this.rating.count;

  this.rating.count += 1;
  this.rating.average = (oldAverage * oldCount + newRating) / this.rating.count;

  // Update distribution
  if (newRating === 5) this.rating.distribution.five += 1;
  else if (newRating === 4) this.rating.distribution.four += 1;
  else if (newRating === 3) this.rating.distribution.three += 1;
  else if (newRating === 2) this.rating.distribution.two += 1;
  else if (newRating === 1) this.rating.distribution.one += 1;
};

// Method to publish course
CourseSchema.methods.publish = function () {
  this.status = "published";
  this.isPublished = true;
  this.metadata.publishedAt = new Date();
  this.metadata.lastModified = new Date();
};

// Method to unpublish course
CourseSchema.methods.unpublish = function () {
  this.status = "draft";
  this.isPublished = false;
  this.metadata.lastModified = new Date();
};

// Static method to find featured courses
CourseSchema.statics.findFeatured = function (limit = 10) {
  return this.find({
    isPublished: true,
    isFeatured: true,
    status: "published",
  })
    .populate("instructor", "firstName lastName avatar")
    .sort({ "rating.average": -1, enrollment: -1 })
    .limit(limit);
};

// Static method to find best sellers
CourseSchema.statics.findBestSellers = function (limit = 10) {
  return this.find({
    isPublished: true,
    status: "published",
  })
    .populate("instructor", "firstName lastName avatar")
    .sort({ "enrollment.total": -1, "revenue.total": -1 })
    .limit(limit);
};

// Static method to find courses by category
CourseSchema.statics.findByCategory = function (category: string, limit = 20) {
  return this.find({
    category,
    isPublished: true,
    status: "published",
  })
    .populate("instructor", "firstName lastName avatar")
    .sort({ "rating.average": -1, enrollment: -1 })
    .limit(limit);
};

// Pre-save middleware to update metadata
CourseSchema.pre("save", function (next) {
  this.metadata.updatedAt = new Date();
  this.metadata.lastModified = new Date();

  // Calculate total duration and lectures
  this.duration = this.sections.reduce(
    (total, section) =>
      total +
      section.lectures.reduce(
        (sectionTotal, lecture) =>
          sectionTotal + (lecture.content.duration || 0),
        0
      ),
    0
  );

  this.lectures = this.sections.reduce(
    (total, section) => total + section.lectures.length,
    0
  );

  next();
});

export const CourseModel =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
