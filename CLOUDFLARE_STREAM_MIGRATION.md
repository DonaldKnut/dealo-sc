# Cloudflare Stream Migration Guide

## Overview

This document explains the migration from Mux to Cloudflare Stream for video uploads and playback in the Dealo platform.

## Understanding Cloudflare Services

### Cloudflare R2 vs Cloudflare Stream

**Cloudflare R2:**
- Object storage service (similar to AWS S3)
- Used for storing files: images, documents, raw video files
- No video processing capabilities
- Files are stored as-is
- Located in: `lib/r2.ts`

**Cloudflare Stream:**
- Video streaming and processing service
- Handles video uploads, transcoding, adaptive streaming
- Generates thumbnails automatically
- Provides optimized playback URLs (HLS/DASH)
- Located in: `service/cloudflareStream.ts`

**For course videos, we use Cloudflare Stream** because it:
- Processes and transcodes videos for optimal playback
- Provides adaptive bitrate streaming
- Generates thumbnails
- Handles video optimization automatically

## What Was Changed

### 1. Removed Mux Dependencies
- ✅ Removed `@mux/mux-node` from `package.json`
- ✅ Removed `@mux/mux-player-react` from `package.json`
- ✅ Deleted `mux-node.d.ts` type definitions
- ✅ Deleted `lib/muxUtils.ts` utility file

### 2. Created Cloudflare Stream Models
- ✅ Created `models/CloudflareStreamData.ts` - stores video metadata
- ✅ Updated `models/Section.ts` - replaced `muxData` with `cloudflareStreamData`

### 3. Updated Utilities
- ✅ Created `lib/cloudflareStreamUtils.ts` - helper functions for Cloudflare Stream URLs
- ✅ Created `lib/cloudflareStreamHelpers.ts` - database helpers
- ✅ Updated `lib/utils.ts` - replaced Mux utilities with Cloudflare Stream

### 4. Enhanced Webhook Handler
- ✅ Updated `app/api/video/webhook/route.ts` - saves video metadata when videos are ready

### 5. Created Video Player Component
- ✅ Created `components/video/CloudflareStreamPlayer.tsx` - React component for Cloudflare Stream videos

### 6. Created Migration Script
- ✅ Created `scripts/migrate-mux-to-cloudflare.ts` - migrates existing MuxData to CloudflareStreamData

## Environment Variables Required

Make sure you have these in your `.env` file:

```env
# Cloudflare Stream (for video uploads and streaming)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# Optional: For client-side video player
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_account_id

# Cloudflare R2 (for other file storage)
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT=your_endpoint_url
R2_PUBLIC_URL=your_public_url
```

## How Video Upload Works

1. **Instructor uploads video:**
   - Frontend calls `/api/videos/upload-url`
   - API creates Cloudflare Stream direct upload URL
   - Video is uploaded directly to Cloudflare Stream

2. **Cloudflare processes video:**
   - Cloudflare transcodes the video
   - Generates thumbnails
   - Creates adaptive streaming manifests

3. **Webhook updates database:**
   - Cloudflare sends webhook to `/api/video/webhook`
   - Webhook saves video metadata to `CloudflareStreamData`
   - Updates video status to "ready"

4. **Video playback:**
   - Use `CloudflareStreamPlayer` component
   - Or use iframe embed: `https://iframe.videodelivery.net/{videoId}`

## Migration Steps

### Step 1: Run Migration Script

```bash
npx ts-node scripts/migrate-mux-to-cloudflare.ts
```

**Important Notes:**
- The script creates placeholder records with `MIGRATED_{muxAssetId}` as the UID
- You'll need to manually upload videos to Cloudflare Stream
- Update the UIDs in `CloudflareStreamData` with actual Cloudflare Stream video IDs

### Step 2: Upload Videos to Cloudflare Stream

For each Mux video:
1. Download the original video from Mux (if available)
2. Upload to Cloudflare Stream using the upload API
3. Update the `CloudflareStreamData` record with the new UID

### Step 3: Update Video Player Components

Replace any Mux player components with `CloudflareStreamPlayer`:

```tsx
import CloudflareStreamPlayer from "@/components/video/CloudflareStreamPlayer";

// Usage
<CloudflareStreamPlayer
  videoId={cloudflareStreamData.uid}
  thumbnail={cloudflareStreamData.thumbnail}
  controls={true}
  autoplay={false}
/>
```

### Step 4: Verify and Clean Up

1. Test all course videos play correctly
2. Verify webhook is receiving events
3. Once confirmed, you can delete old `MuxData` records

## Using Cloudflare Stream Player

### Option 1: Iframe Embed (Recommended)

```tsx
import CloudflareStreamPlayer from "@/components/video/CloudflareStreamPlayer";

<CloudflareStreamPlayer
  videoId="your-cloudflare-stream-uid"
  controls={true}
  autoplay={false}
/>
```

### Option 2: Direct HLS/DASH Playback

```tsx
import { CloudflareStreamVideoElement } from "@/components/video/CloudflareStreamPlayer";

<CloudflareStreamVideoElement
  videoId="your-cloudflare-stream-uid"
  controls={true}
/>
```

## API Endpoints

- `GET /api/videos/upload-url` - Get Cloudflare Stream upload URL
- `POST /api/video/webhook` - Cloudflare Stream webhook handler

## Troubleshooting

### Videos not playing?
- Check that `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID` is set
- Verify video UID is correct
- Check browser console for errors

### Webhook not updating videos?
- Verify webhook URL is configured in Cloudflare Stream dashboard
- Check webhook endpoint is accessible
- Review server logs for webhook events

### Upload failing?
- Verify `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are set
- Check video file size limits
- Review Cloudflare Stream API quotas

## Next Steps

1. ✅ Remove Mux packages (done)
2. ✅ Create Cloudflare Stream models (done)
3. ✅ Update webhook handler (done)
4. ✅ Create video player component (done)
5. ⏳ Run migration script
6. ⏳ Upload existing videos to Cloudflare Stream
7. ⏳ Update video player components in course pages
8. ⏳ Test and verify all videos work
9. ⏳ Remove old MuxData records

## Support

For Cloudflare Stream documentation:
- https://developers.cloudflare.com/stream/
- https://developers.cloudflare.com/stream/getting-started/



