import { connect } from "@/database";
import { UserModel } from "@/models/User";
import { CloudflareStreamDataModel } from "@/models/CloudflareStreamData";
import { Types } from "mongoose";

/**
 * Add video storage to instructor's used quota
 */
export async function addInstructorStorage(
  instructorId: string | Types.ObjectId,
  fileSize: number
): Promise<void> {
  await connect();
  
  await UserModel.findByIdAndUpdate(instructorId, {
    $inc: { videoStorageUsed: fileSize },
  });
}

/**
 * Remove video storage from instructor's used quota
 */
export async function removeInstructorStorage(
  instructorId: string | Types.ObjectId,
  fileSize: number
): Promise<void> {
  await connect();
  
  await UserModel.findByIdAndUpdate(instructorId, {
    $inc: { videoStorageUsed: -fileSize },
  });
}

/**
 * Get all videos for an instructor and calculate total storage
 */
export async function getInstructorVideoStorage(
  instructorId: string | Types.ObjectId
): Promise<number> {
  await connect();
  
  const videos = await CloudflareStreamDataModel.find({
    instructorId: new Types.ObjectId(instructorId),
  });
  
  return videos.reduce((total, video) => total + (video.fileSize || 0), 0);
}

/**
 * Recalculate and sync instructor storage from actual video data
 */
export async function recalculateInstructorStorage(
  instructorId: string | Types.ObjectId
): Promise<number> {
  await connect();
  
  const totalStorage = await getInstructorVideoStorage(instructorId);
  
  await UserModel.findByIdAndUpdate(instructorId, {
    videoStorageUsed: totalStorage,
  });
  
  return totalStorage;
}


