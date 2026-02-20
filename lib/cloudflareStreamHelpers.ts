import { connect } from "@/database";
import { CloudflareStreamDataModel } from "@/models/CloudflareStreamData";
import { Types } from "mongoose";

/**
 * Create or update CloudflareStreamData for a section
 * @param uid Cloudflare Stream video UID
 * @param sectionId Section ID to associate with
 * @param instructorId Instructor ID who uploaded the video
 * @param fileSize Original file size in bytes
 * @returns CloudflareStreamData document
 */
export async function createOrUpdateCloudflareStreamData(
  uid: string,
  sectionId: string | Types.ObjectId,
  instructorId?: string | Types.ObjectId,
  fileSize?: number
): Promise<any> {
  await connect();
  
  const updateData: any = {
    uid,
    sectionId: new Types.ObjectId(sectionId),
    status: "uploading",
  };
  
  if (instructorId) {
    updateData.instructorId = new Types.ObjectId(instructorId);
  }
  
  if (fileSize !== undefined) {
    updateData.fileSize = fileSize;
  }
  
  const streamData = await CloudflareStreamDataModel.findOneAndUpdate(
    { uid },
    updateData,
    {
      upsert: true,
      new: true,
    }
  );
  
  return streamData;
}

/**
 * Get Cloudflare Stream data for a section
 * @param sectionId Section ID
 * @returns CloudflareStreamData or null
 */
export async function getCloudflareStreamDataForSection(
  sectionId: string | Types.ObjectId
): Promise<any | null> {
  await connect();
  
  return await CloudflareStreamDataModel.findOne({
    sectionId: new Types.ObjectId(sectionId),
  }).populate("sectionId");
}



