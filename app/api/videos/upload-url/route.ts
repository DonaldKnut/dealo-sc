import { NextRequest, NextResponse } from "next/server";
import { createCloudflareUploadUrl } from "@/service/cloudflareStream";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { UserModel } from "@/models/User";
import { Role } from "@/types/role";
import { moderateContentWithGemini } from "@/lib/contentModeration";
import { cleanupStaleVideos } from "@/lib/videoCleanup";

export const dynamic = "force-dynamic";

// MVP: 450MB per instructor to stay within 10GB total (leaves room for resumes/files)
const INSTRUCTOR_STORAGE_QUOTA = Number(
  process.env.INSTRUCTOR_STORAGE_QUOTA_BYTES || 450 * 1024 * 1024
); // 450MB in bytes
const MAX_VIDEO_SIZE_MB = Number(process.env.MAX_VIDEO_SIZE_MB || 400); // Individual upload limit
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id || (session?.user as any)?.id;
    if (!userId) {
      console.log("🔐 Video Upload: Unauthorized attempt (no session or user ID)");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // Check if user is an instructor
    const user = await UserModel.findById(userId);
    if (!user || user.role !== Role.INSTRUCTOR) {
      return NextResponse.json(
        { error: "Only instructors can upload videos" },
        { status: 403 }
      );
    }

    // Opportunistically cleanup stale videos before processing new uploads
    cleanupStaleVideos().catch((err) =>
      console.error("Stale video cleanup failed:", err)
    );

    const { searchParams } = new URL(req.url);
    const sizeParam = searchParams.get("size");
    const titleParam = searchParams.get("title"); // For content moderation
    const descriptionParam = searchParams.get("description"); // For content moderation

    if (sizeParam) {
      const size = Number(sizeParam);
      if (Number.isNaN(size) || size <= 0) {
        return NextResponse.json(
          { error: "Invalid file size" },
          { status: 400 }
        );
      }

      // Check individual file size limit
      if (size > MAX_VIDEO_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `Video too large. Maximum allowed size is ${MAX_VIDEO_SIZE_MB}MB.`,
          },
          { status: 413 }
        );
      }

      // Check instructor storage quota
      const storageUsed = user.videoStorageUsed || 0;
      const storageQuota = user.videoStorageQuota || INSTRUCTOR_STORAGE_QUOTA;
      const remainingQuota = storageQuota - storageUsed;

      if (size > remainingQuota) {
        const usedGB = (storageUsed / (1024 * 1024 * 1024)).toFixed(2);
        const quotaGB = (storageQuota / (1024 * 1024 * 1024)).toFixed(2);
        return NextResponse.json(
          {
            error: `Storage quota exceeded. You have used ${usedGB}GB of ${quotaGB}GB. Please delete unused videos to free up space.`,
            storageUsed,
            storageQuota,
            remaining: remainingQuota,
          },
          { status: 413 }
        );
      }
    }

    // Content moderation with Gemini AI
    if (titleParam || descriptionParam) {
      const contentToModerate = `${titleParam || ""} ${descriptionParam || ""}`.trim();
      if (contentToModerate) {
        try {
          const moderationResult = await moderateContentWithGemini(contentToModerate);
          if (!moderationResult.approved) {
            return NextResponse.json(
              {
                error: "Content does not meet platform policies",
                reason: moderationResult.reason,
              },
              { status: 400 }
            );
          }
        } catch (modError) {
          console.error("Content moderation error:", modError);
          // Don't block upload if moderation fails, but log it
        }
      }
    }

    const { uploadURL, uid } = await createCloudflareUploadUrl();
    return NextResponse.json({ uploadURL, uid });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed to get upload URL" },
      { status: 500 }
    );
  }
}
