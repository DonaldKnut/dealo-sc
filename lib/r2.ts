import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Helper function to extract or get R2 Account ID
function getR2AccountId(): string {
  // First check if R2_ACCOUNT_ID is explicitly set
  if (process.env.R2_ACCOUNT_ID) {
    return process.env.R2_ACCOUNT_ID;
  }
  
  // Try to extract from R2_ENDPOINT if available
  if (process.env.R2_ENDPOINT) {
    const endpoint = process.env.R2_ENDPOINT;
    // R2 endpoint format: https://<account-id>.r2.cloudflarestorage.com
    const match = endpoint.match(/https?:\/\/([a-f0-9]+)\.r2\.cloudflarestorage\.com/);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Try to extract from R2_ACCESS_KEY_ID if it's the account ID
  // (Some setups use the account ID as the access key ID)
  if (process.env.R2_ACCESS_KEY_ID && process.env.R2_ACCESS_KEY_ID.length === 32) {
    // Account IDs are typically 32 character hex strings
    return process.env.R2_ACCESS_KEY_ID;
  }
  
  throw new Error("R2_ACCOUNT_ID could not be determined. Please set R2_ACCOUNT_ID or ensure R2_ENDPOINT contains the account ID.");
}

// Initialize S3Client for R2 lazily to avoid issues at module load time
function getS3Client(): S3Client {
  if (!process.env.R2_ENDPOINT) {
    throw new Error("R2_ENDPOINT environment variable is not set");
  }
  if (!process.env.R2_ACCESS_KEY_ID) {
    throw new Error("R2_ACCESS_KEY_ID environment variable is not set");
  }
  if (!process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error("R2_SECRET_ACCESS_KEY environment variable is not set");
  }
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME environment variable is not set");
  }

  // Clean endpoint - remove bucket name if included
  let endpoint = process.env.R2_ENDPOINT.trim();
  // Remove trailing bucket name if present (some configs include it)
  if (endpoint.includes('/' + process.env.R2_BUCKET_NAME)) {
    endpoint = endpoint.replace('/' + process.env.R2_BUCKET_NAME, '');
  }
  // Ensure it ends with just the domain
  if (!endpoint.endsWith('.r2.cloudflarestorage.com')) {
    const accountId = getR2AccountId();
    endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  }

  return new S3Client({
    region: process.env.R2_REGION || "auto",
    endpoint: endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export type UploadPrefix = 
  | "avatars" 
  | "covers" 
  | "marketplace" 
  | "employment" 
  | "courses" 
  | "posts" 
  | "uploads";

export interface UploadOptions {
  prefix?: UploadPrefix;
  fileName?: string;
  contentType?: string;
  makePublic?: boolean;
}

/**
 * Upload file to Cloudflare R2
 * @param file Buffer or File to upload
 * @param options Upload options
 * @returns Public URL of uploaded file
 */
export async function uploadToR2(
  file: Buffer | File,
  options: UploadOptions = {}
): Promise<string> {
  try {
    const {
      prefix = "uploads",
      fileName,
      contentType,
      makePublic = true,
    } = options;

    // Convert File to Buffer if needed
    let fileBuffer: Buffer;
    let finalFileName: string;
    let finalContentType: string;

    if (file instanceof File) {
      fileBuffer = Buffer.from(await file.arrayBuffer());
      finalFileName = fileName || file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      finalContentType = contentType || file.type || "application/octet-stream";
    } else {
      fileBuffer = file;
      finalFileName = fileName || `file-${Date.now()}`;
      finalContentType = contentType || "application/octet-stream";
    }

    // Generate unique key with timestamp
    const timestamp = Date.now();
    const key = `${prefix}/${timestamp}-${finalFileName}`;

    // R2 doesn't support ACL like S3, use public URL instead
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: finalContentType,
      // Note: R2 doesn't support ACL, files are made public via R2 Public URL
    });

    const client = getS3Client();
    await client.send(command);

    const publicUrl = process.env.R2_PUBLIC_URL 
      ? `${process.env.R2_PUBLIC_URL}/${key}`
      : `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`;

    return publicUrl;
  } catch (error: any) {
    console.error("R2 upload error:", error);
    
    // Check for common R2 configuration issues first
    if (!process.env.R2_BUCKET_NAME) {
      throw new Error("R2_BUCKET_NAME environment variable is not set");
    }
    if (!process.env.R2_ACCESS_KEY_ID) {
      throw new Error("R2_ACCESS_KEY_ID environment variable is not set");
    }
    if (!process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error("R2_SECRET_ACCESS_KEY environment variable is not set");
    }
    
    // Provide more detailed error message
    const errorMessage = error?.message || "Unknown error";
    const errorCode = error?.code || error?.name || "UNKNOWN";
    const statusCode = error?.$metadata?.httpStatusCode || error?.statusCode;
    
    // Handle specific unauthorized errors
    if (errorCode === "Unauthorized" || statusCode === 401 || errorMessage.includes("Unauthorized")) {
      const detailedError = `
R2 Upload Failed: Unauthorized

This usually means one of the following:
1. Invalid R2_ACCESS_KEY_ID or R2_SECRET_ACCESS_KEY
2. API token expired or revoked in Cloudflare dashboard
3. API token doesn't have R2:Edit permissions
4. Wrong bucket name (R2_BUCKET_NAME)

To fix:
1. Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Create a new API token with "Object Read & Write" permissions
3. Update R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in .env.local
4. Restart your dev server

Current config:
- Bucket: ${process.env.R2_BUCKET_NAME}
- Endpoint: ${process.env.R2_ENDPOINT?.replace(/\/[^\/]+$/, '')}
- Access Key ID: ${process.env.R2_ACCESS_KEY_ID?.substring(0, 8)}...
      `.trim();
      
      console.error(detailedError);
      throw new Error("R2 Upload Unauthorized: Check your API token credentials in Cloudflare dashboard");
    }
    
    throw new Error(`Failed to upload file to R2: ${errorMessage} (${errorCode})`);
  }
}

/**
 * Delete file from Cloudflare R2
 * @param fileUrl Full URL or key of file to delete
 * @returns Success status
 */
export async function deleteFromR2(fileUrl: string): Promise<boolean> {
  try {
    // Extract key from URL or use as-is if it's already a key
    let key: string;
    
    if (fileUrl.startsWith("http")) {
      // Extract key from URL
      const urlParts = fileUrl.split("/");
      const keyIndex = urlParts.findIndex(part => 
        ["avatars", "covers", "marketplace", "employment", "courses", "posts", "uploads"].includes(part)
      );
      
      if (keyIndex !== -1) {
        key = urlParts.slice(keyIndex).join("/");
      } else {
        // Fallback: get last part after domain
        const pathParts = new URL(fileUrl).pathname.split("/").filter(Boolean);
        key = pathParts.slice(1).join("/"); // Remove bucket name if present
      }
    } else {
      key = fileUrl;
    }

    if (!key) {
      throw new Error("Invalid file URL or key");
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const client = getS3Client();
    await client.send(command);
    return true;
  } catch (error) {
    console.error("R2 delete error:", error);
    throw new Error("Failed to delete file from R2");
  }
}

/**
 * Upload multiple files to R2
 * @param files Array of files to upload
 * @param options Upload options
 * @returns Array of public URLs
 */
export async function uploadMultipleToR2(
  files: (Buffer | File)[],
  options: UploadOptions = {}
): Promise<string[]> {
  try {
    const uploads = await Promise.all(
      files.map((file, index) => 
        uploadToR2(file, {
          ...options,
          fileName: file instanceof File 
            ? file.name 
            : `${options.fileName || "file"}-${index}`,
        })
      )
    );
    return uploads;
  } catch (error) {
    console.error("R2 bulk upload error:", error);
    throw new Error("Failed to upload files to R2");
  }
}
