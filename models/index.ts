/**
 * Barrel export for all database models
 * Import models from here: import { UserModel, CourseModel } from "@/models"
 */

// User models
export { UserModel } from "./User";
export { UserRoleModel } from "./UserRole";
export { UserProfileModel } from "./UserProfile";
export { InstructorInfoModel } from "./InstructorInfo";
export { default as StudentInfoModel } from "./StudentInfo";
export { JobSeekerModel } from "./JobSeeker";
export { CompanyModel } from "./Company";

// Course models
export { CourseModel } from "./Course";
export { SectionModel } from "./Section";
export { CloudflareStreamDataModel } from "./CloudflareStreamData";
export { ResourceModel } from "./Resource";
export { ProgressModel } from "./Progress";

// Marketplace models
export { default as Work } from "./Work";
export { OrderModel } from "./Order";
export { CartItemModel } from "./CartItem";
export { WishlistItemModel } from "./WishlistItem";

// Employment models
export { JobModel } from "./Job";
export { JobPostModel } from "./JobPost";
export { JobApplicationModel } from "./JobApplication";

// Social models
export { FollowModel } from "./Follow";
export { CommentModel } from "./Comment";
export { LikeModel } from "./Like";
export { MessageModel } from "./Message";
export { ConversationModel } from "./Conversation";

// Certification models
export { Assessment } from "./Assessment";
export { Profession } from "./Profession";
export { CertificationModel } from "./Certification";
// Export aliases for backward compatibility
export { Assessment as AssessmentModel } from "./Assessment";
export { Profession as ProfessionModel } from "./Profession";
export { CertificationModel as Certification } from "./Certification";

// Other models
export { default as Resume } from "./Resume";
export { ScratchCardTransactionModel } from "./ScratchCardTransaction";
