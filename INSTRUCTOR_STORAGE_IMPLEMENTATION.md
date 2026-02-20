# Instructor Storage Management & Content Moderation Implementation

## Overview

This document describes the implementation of storage quota management, video deletion, and content moderation for instructors in the MVP stage.

## Features Implemented

### 1. Storage Quota Tracking ✅

**Location:** `models/User.ts`

- Added `videoStorageUsed` field to track total bytes used by each instructor
- Added `videoStorageQuota` field with default of 450MB (471,859,200 bytes)
- Keeps overall usage under 10GB when combined with resumes/images

### 2. File Size Tracking ✅

**Location:** `models/CloudflareStreamData.ts`

- Added `fileSize` field to store original video file size in bytes
- Added `instructorId` field to track which instructor uploaded each video
- Added index on `instructorId` for efficient queries

### 3. Upload Size Limits ✅

**Location:** `app/api/videos/upload-url/route.ts`

- Reduced `MAX_VIDEO_SIZE_MB` from 500MB to **400MB** (configurable via env var)
- Individual file size validation before upload
- Quota check: Prevents upload if instructor has exceeded their 450MB quota
- Returns helpful error messages with storage usage details

### 4. Content Moderation with Gemini AI ✅

**Location:** `lib/contentModeration.ts`

- Uses Gemini 1.5 Flash model for content analysis
- Checks course titles and descriptions against platform policies:
  - No hate speech, discrimination, or offensive content
  - No illegal activities
  - No adult/sexual content
  - No violence or graphic content
  - Must be educational/professional
  - No spam, scams, or misleading info
  - No copyright infringement
  - No personal attacks or harassment
- Fails open (allows content) if moderation service is unavailable

### 5. Cloudflare Stream Video Deletion ✅

**Location:** `service/cloudflareStream.ts`

- Added `deleteCloudflareVideo()` function
- Deletes videos from Cloudflare Stream via API
- Properly handles errors and logs deletion status

### 6. Course Deletion with Video Cleanup ✅

**Location:** `app/api/courses/[id]/route.ts`

- When instructor deletes a course:
  1. Finds all videos associated with course sections
  2. Deletes each video from Cloudflare Stream
  3. Removes video storage from instructor's quota
  4. Deletes CloudflareStreamData records
  5. Deletes the course
- Returns count of videos deleted

### 7. Storage Helper Functions ✅

**Location:** `lib/instructorStorage.ts`

- `addInstructorStorage()` - Add bytes to instructor's used quota
- `removeInstructorStorage()` - Remove bytes from instructor's used quota
- `getInstructorVideoStorage()` - Calculate total storage from video records
- `recalculateInstructorStorage()` - Sync storage from actual video data

### 8. Video Metadata API ✅

**Location:** `app/api/videos/save-metadata/route.ts`

- New endpoint to save video metadata after upload
- Stores `fileSize` and `instructorId` immediately after upload
- Should be called by frontend after successful upload

### 9. Webhook Storage Updates ✅

**Location:** `app/api/video/webhook/route.ts`

- When video becomes ready for the first time, adds storage to instructor quota
- Prevents double-counting by checking if video was already ready
- Only counts storage when video is successfully processed

### 10. Automatic Cleanup of Stale Videos ✅

**Location:** `lib/videoCleanup.ts`

- Deletes stalled uploads or unpublished videos older than 30 days (configurable)
- Reclaims instructor storage quota automatically
- Invoked opportunistically whenever `/api/videos/upload-url` is called

## Configuration

### Environment Variables

```env
# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# Video Upload Limits & Quotas
MAX_VIDEO_SIZE_MB=400                 # Default individual upload limit
INSTRUCTOR_STORAGE_QUOTA_BYTES=471859200  # 450MB per instructor (optional override)
STALE_VIDEO_MAX_DAYS=30               # Auto-delete videos older than N days
STALE_VIDEO_CLEANUP_LIMIT=10          # Max stale videos to delete per run

# Gemini AI for Content Moderation
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
# OR
GEMINI_API_KEY=your_gemini_api_key
```

## Storage Quota Details

- **Per Instructor Quota:** 450MB (471,859,200 bytes) — configurable via env
- **Total Platform Storage:** 10GB (Cloudflare Stream free tier)
- **Max Instructors Supported:** 6–9 depending on usage
- **Max File Size:** 400MB per video (configurable)

## Usage Flow

### Video Upload Flow

1. **Frontend calls** `/api/videos/upload-url?size={fileSize}&title={title}&description={description}`
2. **API checks:**
   - User is authenticated and is an instructor
   - File size ≤ 400MB
   - Instructor hasn't exceeded 450MB quota
   - Content passes Gemini AI moderation
3. **API returns** upload URL and video UID
4. **Frontend uploads** video directly to Cloudflare Stream
5. **Frontend calls** `/api/videos/save-metadata` with `uid`, `sectionId`, `fileSize`
6. **Cloudflare processes** video and sends webhook
7. **Webhook updates** metadata and adds storage to instructor quota

### Course Deletion Flow

1. **Instructor deletes** course via `DELETE /api/courses/[id]`
2. **API finds** all videos in course sections
3. **For each video:**
   - Deletes from Cloudflare Stream
   - Removes storage from instructor quota
   - Deletes CloudflareStreamData record
4. **API deletes** the course
5. **Returns** success with count of videos deleted

## Frontend Integration

### Update Upload Functions

When uploading videos, after getting the UID from Cloudflare, call:

```typescript
// After successful upload
await fetch("/api/videos/save-metadata", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uid: videoUID,
    sectionId: sectionId,
    fileSize: file.size, // Original file size in bytes
  }),
});
```

### Update Upload URL Calls

Include title and description for content moderation:

```typescript
const urlRes = await fetch(
  `/api/videos/upload-url?size=${file.size}&title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(description)}`,
  { cache: "no-store" }
);
```

## Monitoring & Maintenance

### Check Instructor Storage

```typescript
import { getInstructorVideoStorage } from "@/lib/instructorStorage";

const totalStorage = await getInstructorVideoStorage(instructorId);
console.log(`Instructor has used ${totalStorage} bytes`);
```

### Recalculate Storage

If storage gets out of sync:

```typescript
import { recalculateInstructorStorage } from "@/lib/instructorStorage";

const actualStorage = await recalculateInstructorStorage(instructorId);
```

## Notes

- Storage is only counted when videos are successfully processed (status: "ready")
- Failed uploads don't count toward quota
- Deleted courses automatically free up storage
- Automatic cleanup removes stalled/unpublished videos older than 30 days
- Content moderation fails open (allows content) if Gemini is unavailable
- All storage values are in bytes

## Future Enhancements

- Admin dashboard to view instructor storage usage
- Email notifications when approaching quota limits
- Automatic storage cleanup for old/unused videos _(done ✅)_
- More granular content moderation (video analysis)
- Storage upgrade tiers so instructors can pay for more quota (future)
