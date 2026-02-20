import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, uploadMultipleToR2, UploadPrefix } from "@/lib/r2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { withRateLimit, rateLimiters } from "@/lib/middleware/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const files = formData.getAll("files") as File[];
    const prefix = (formData.get("prefix") as string | null) || "uploads";
    
    // Check authentication - allow unauthenticated uploads for employment/job postings
    const isEmploymentUpload = prefix === "employment" || prefix === "uploads";
    const session = await getServerSession({ req, ...authOptions });
    let userId: string = "anonymous";
    
    if (session?.user?.id) {
      userId = session.user.id;
    } else if (!isEmploymentUpload) {
      // Require auth for non-employment uploads
      return NextResponse.json(
        { error: "Authentication required for this upload type" },
        { status: 401 }
      );
    } else {
      // For employment uploads, use IP-based tracking for anonymous users
      const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
      userId = `anonymous-${ip}`;
    }
    
    // Apply rate limiting for uploads (use userId for tracking)
    const rateLimitResult = await rateLimiters.upload(req, userId);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many upload requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(rateLimitResult.resetTime / 1000).toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Validate prefix
    const validPrefixes: UploadPrefix[] = [
      "avatars",
      "covers",
      "marketplace",
      "employment",
      "courses",
      "posts",
      "uploads",
    ];
    const uploadPrefix = validPrefixes.includes(prefix as UploadPrefix)
      ? (prefix as UploadPrefix)
      : "uploads";

    // Single file upload
    if (file) {
      // Validate file type
      const allowedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];
      const allowedVideoTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
      ];
      const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only images and videos are allowed." },
          { status: 400 }
        );
      }

      // Validate file size
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for videos, 10MB for images
      
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error: `File too large. Maximum size is ${isVideo ? "100MB" : "10MB"}.`,
          },
          { status: 400 }
        );
      }

      try {
        const url = await uploadToR2(file, {
          prefix: uploadPrefix,
          contentType: file.type,
        });

        return NextResponse.json({
          url,
          contentType: file.type,
          size: file.size,
          type: isVideo ? "video" : "image",
        });
      } catch (uploadError: any) {
        console.error("Upload to R2 failed:", uploadError);
        return NextResponse.json(
          { 
            error: uploadError?.message || "Failed to upload file to R2",
            details: process.env.NODE_ENV === "development" ? uploadError?.stack : undefined
          },
          { status: 500 }
        );
      }
    }

    // Multiple files upload
    if (files.length > 0) {
      // Validate all files
      for (const f of files) {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "video/mp4",
          "video/webm",
        ];
        if (!allowedTypes.includes(f.type)) {
          return NextResponse.json(
            { error: `Invalid file type: ${f.name}` },
            { status: 400 }
          );
        }
        if (f.size > 100 * 1024 * 1024) {
          return NextResponse.json(
            { error: `File too large: ${f.name}` },
            { status: 400 }
          );
        }
      }

      const urls = await uploadMultipleToR2(files, {
        prefix: uploadPrefix,
      });

      return NextResponse.json({
        urls,
        count: urls.length,
      });
    }

    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  } catch (e: any) {
    console.error("R2 upload error:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to upload" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    const { deleteFromR2 } = await import("@/lib/r2");
    await deleteFromR2(fileUrl);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("R2 delete error:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to delete" },
      { status: 500 }
    );
  }
}


