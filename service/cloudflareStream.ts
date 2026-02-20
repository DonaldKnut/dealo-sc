export interface CreateSignedUploadUrlResponse {
  uploadURL: string;
  uid?: string;
}

export async function createCloudflareUploadUrl(): Promise<CreateSignedUploadUrlResponse> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID as string;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN as string;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare Stream env vars missing");
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maxDurationSeconds: 10800,
      allowedOrigins: ["*"],
      creator: "dealo-platform",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudflare upload URL error: ${res.status} ${text}`);
  }

  const json = await res.json();
  // Cloudflare’s response shape: { result: { uploadURL, id }, success, errors, messages }
  return { uploadURL: json?.result?.uploadURL, uid: json?.result?.id };
}

export interface StreamWebhookEvent {
  type: string;
  payload: any;
}

/**
 * Delete a video from Cloudflare Stream
 */
export async function deleteCloudflareVideo(videoId: string): Promise<boolean> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID as string;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN as string;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare Stream env vars missing");
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`Cloudflare delete error: ${res.status} ${text}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error("Error deleting Cloudflare video:", error);
    return false;
  }
}
