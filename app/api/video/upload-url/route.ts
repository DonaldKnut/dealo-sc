import { NextRequest, NextResponse } from "next/server";
import { createCloudflareUploadUrl } from "@/service/cloudflareStream";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const data = await createCloudflareUploadUrl();
    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Upload URL error" }, { status: 500 });
  }
}
