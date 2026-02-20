import { NextRequest, NextResponse } from "next/server";
import { S3 } from "aws-sdk";

// Setup S3
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: "eu-north-1",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const params = {
      Bucket: "dealo-media-bucket",
      Key: `${Date.now()}_${file.name}`,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read" as const,
    };

    const uploadResult = await s3.upload(params).promise();
    return NextResponse.json({ url: uploadResult.Location });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
