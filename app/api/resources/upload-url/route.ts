import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// For resources (PDF/ZIP), use direct-to-storage via a simple signed URL pattern or fallback to server upload.
// Here we keep it simple: we only validate size and type and let the client upload to any configured storage later.

const MAX_MB = Number(process.env.MAX_RESOURCE_SIZE_MB || 25);
const MAX_BYTES = MAX_MB * 1024 * 1024;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sizeParam = Number(searchParams.get("size"));
    const type = (searchParams.get("type") || "").toLowerCase();

    if (sizeParam && sizeParam > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max allowed is ${MAX_MB}MB.` },
        { status: 413 }
      );
    }

    if (!type || (!type.includes("pdf") && !type.includes("zip"))) {
      return NextResponse.json(
        { error: "Only PDF and ZIP resources are allowed" },
        { status: 400 }
      );
    }

    // In a real system, return a signed URL to S3/Cloudflare R2/GCS etc.
    // For now just acknowledge client-side upload permitted.
    return NextResponse.json({ allowed: true, maxBytes: MAX_BYTES });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed to validate resource upload" },
      { status: 500 }
    );
  }
}
