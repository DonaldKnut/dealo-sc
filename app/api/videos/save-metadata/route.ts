import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { createOrUpdateCloudflareStreamData } from "@/lib/cloudflareStreamHelpers";

export const dynamic = "force-dynamic";

/**
 * Save video metadata after upload
 * This should be called immediately after video upload completes
 * to track file size and instructor ID before webhook fires
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?._id || (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { uid, sectionId, fileSize } = body;

    if (!uid || !sectionId) {
      return NextResponse.json(
        { error: "uid and sectionId are required" },
        { status: 400 }
      );
    }

    await connect();

    // Create or update CloudflareStreamData with fileSize and instructorId
    const streamData = await createOrUpdateCloudflareStreamData(
      uid,
      sectionId,
      userId, // instructorId
      fileSize || undefined
    );

    return NextResponse.json({
      success: true,
      streamData: {
        uid: streamData.uid,
        sectionId: streamData.sectionId,
        instructorId: streamData.instructorId,
        fileSize: streamData.fileSize,
      },
    });
  } catch (e: any) {
    console.error("Error saving video metadata:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to save video metadata" },
      { status: 500 }
    );
  }
}


