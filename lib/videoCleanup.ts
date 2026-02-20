import { connect } from "@/database";
import { CloudflareStreamDataModel } from "@/models/CloudflareStreamData";
import { deleteCloudflareVideo } from "@/service/cloudflareStream";
import { removeInstructorStorage } from "@/lib/instructorStorage";
import { SectionModel } from "@/models/Section";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MAX_AGE_DAYS = Number(process.env.STALE_VIDEO_MAX_DAYS || 30);
const DEFAULT_CLEANUP_LIMIT = Number(process.env.STALE_VIDEO_CLEANUP_LIMIT || 10);

interface CleanupResult {
  checked: number;
  deleted: number;
  reclaimedBytes: number;
}

/**
 * Remove stale or unpublished videos to reclaim storage automatically.
 * A video is considered stale if:
 *  - It's not ready after MAX_AGE days, OR
 *  - It belongs to an unpublished/missing section older than MAX_AGE days
 */
export async function cleanupStaleVideos(
  opts: { maxAgeDays?: number; limit?: number } = {}
): Promise<CleanupResult> {
  const maxAgeDays = opts.maxAgeDays ?? DEFAULT_MAX_AGE_DAYS;
  const limit = opts.limit ?? DEFAULT_CLEANUP_LIMIT;

  if (maxAgeDays <= 0 || limit <= 0) {
    return { checked: 0, deleted: 0, reclaimedBytes: 0 };
  }

  await connect();

  const cutoff = new Date(Date.now() - maxAgeDays * DAY_MS);

  const candidates = await CloudflareStreamDataModel.find({
    updatedAt: { $lt: cutoff },
  })
    .sort({ updatedAt: 1 })
    .limit(limit)
    .populate("sectionId");

  let deleted = 0;
  let reclaimedBytes = 0;

  for (const streamData of candidates) {
    const section: any = streamData.sectionId;

    const isUnpublishedSection =
      !section || section.isPublished === false || !section.courseId;

    const isStalledUpload = streamData.status !== "ready";

    if (!isUnpublishedSection && !isStalledUpload) {
      continue;
    }

    try {
      if (streamData.uid) {
        await deleteCloudflareVideo(streamData.uid);
      }

      if (streamData.fileSize && streamData.instructorId) {
        await removeInstructorStorage(streamData.instructorId.toString(), streamData.fileSize);
        reclaimedBytes += streamData.fileSize;
      }

      if (section?._id) {
        await SectionModel.updateMany(
          { _id: section._id, cloudflareStreamData: streamData._id },
          { $unset: { cloudflareStreamData: "" }, $set: { videoUrl: null } }
        );
      }

      await CloudflareStreamDataModel.deleteOne({ _id: streamData._id });
      deleted += 1;
    } catch (err) {
      console.error("Failed to cleanup stale video:", err);
      // continue with next candidate
    }
  }

  return { checked: candidates.length, deleted, reclaimedBytes };
}


