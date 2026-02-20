export function getCloudflareImageUrl(id: string, variant?: string): string {
  if (!id) return "";
  // If it's already a URL, return as-is
  if (/^https?:\/\//i.test(id)) return id;

  const deliveryHash = process.env.CLOUDFLARE_IMAGES_DELIVERY_HASH as string;
  const chosenVariant =
    variant || process.env.CF_IMAGES_DEFAULT_VARIANT || "public";

  if (!deliveryHash) {
    // Fallback to r2/public URL style if misconfigured, or return the id so callers can handle
    return id;
  }

  // https://imagedelivery.net/{deliveryHash}/{id}/{variant}
  return `https://imagedelivery.net/${deliveryHash}/${id}/${chosenVariant}`;
}


