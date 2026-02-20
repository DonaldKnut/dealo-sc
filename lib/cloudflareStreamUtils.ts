import { CloudflareStreamData } from "@/models/CloudflareStreamData";

export function isCloudflareStreamData(obj: any): obj is CloudflareStreamData {
  return obj && obj.uid !== undefined;
}

/**
 * Get Cloudflare Stream playback URL from UID
 * @param uid Cloudflare Stream video UID
 * @returns Playback URL
 */
export function getCloudflareStreamUrl(uid: string, accountId?: string): string {
  // Cloudflare Stream playback URL format
  // You can use the embed URL or direct HLS/DASH URLs
  const accId = accountId || process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || "";
  return `https://customer-${accId}.cloudflarestream.com/${uid}/manifest/video.m3u8`;
}

/**
 * Get Cloudflare Stream embed URL
 * @param uid Cloudflare Stream video UID
 * @returns Embed URL
 */
export function getCloudflareStreamEmbedUrl(uid: string): string {
  return `https://iframe.videodelivery.net/${uid}`;
}

