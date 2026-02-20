/**
 * Migration Script: MuxData to CloudflareStreamData
 * 
 * This script migrates existing Mux video data to Cloudflare Stream format.
 * 
 * IMPORTANT: 
 * - This assumes you have Cloudflare Stream videos that correspond to Mux assets
 * - You may need to manually upload videos to Cloudflare Stream first
 * - Run this script in a controlled environment and backup your database first
 * 
 * Usage:
 *   npx ts-node scripts/migrate-mux-to-cloudflare.ts
 */

import { connect } from "../database";
import { MuxDataModel } from "../models/MuxData";
import { CloudflareStreamDataModel } from "../models/CloudflareStreamData";
import { SectionModel } from "../models/Section";

interface MigrationStats {
  total: number;
  migrated: number;
  skipped: number;
  errors: number;
}

async function migrateMuxToCloudflare() {
  console.log("🚀 Starting Mux to Cloudflare Stream migration...\n");

  try {
    await connect();
    console.log("✅ Connected to database\n");

    const muxRecords = await MuxDataModel.find().populate("sectionId").lean();
    console.log(`📊 Found ${muxRecords.length} Mux records to migrate\n`);

    const stats: MigrationStats = {
      total: muxRecords.length,
      migrated: 0,
      skipped: 0,
      errors: 0,
    };

    for (const muxRecord of muxRecords) {
      try {
        const sectionId = muxRecord.sectionId;
        
        if (!sectionId) {
          console.log(`⚠️  Skipping Mux record ${muxRecord._id} - no sectionId`);
          stats.skipped++;
          continue;
        }

        // Check if CloudflareStreamData already exists for this section
        const existing = await CloudflareStreamDataModel.findOne({
          sectionId: sectionId,
        });

        if (existing) {
          console.log(`⏭️  Skipping section ${sectionId} - CloudflareStreamData already exists`);
          stats.skipped++;
          continue;
        }

        // IMPORTANT: You need to map Mux assetId/playbackId to Cloudflare Stream UID
        // This is a placeholder - you'll need to:
        // 1. Either manually create Cloudflare Stream videos from Mux assets
        // 2. Or have a mapping table of Mux IDs to Cloudflare Stream UIDs
        // 3. Or re-upload videos to Cloudflare Stream
        
        // For now, we'll create a placeholder record that needs manual update
        const cloudflareStreamData = new CloudflareStreamDataModel({
          uid: `MIGRATED_${muxRecord.assetId}`, // Placeholder - needs to be replaced with actual Cloudflare Stream UID
          sectionId: sectionId,
          status: "uploading", // Mark as uploading until actual Cloudflare Stream UID is set
          // Note: You'll need to update these after uploading to Cloudflare Stream
          // playbackUrl, thumbnail, duration, etc. will be set by webhook
        });

        await cloudflareStreamData.save();

        // Update Section model to reference CloudflareStreamData instead of MuxData
        await SectionModel.findByIdAndUpdate(sectionId, {
          $unset: { muxData: "" },
          $set: { cloudflareStreamData: cloudflareStreamData._id },
        });

        console.log(`✅ Migrated Mux record ${muxRecord._id} -> CloudflareStreamData ${cloudflareStreamData._id}`);
        stats.migrated++;

        // Optional: Delete old MuxData record (uncomment if you want to remove old data)
        // await MuxDataModel.findByIdAndDelete(muxRecord._id);
      } catch (error: any) {
        console.error(`❌ Error migrating Mux record ${muxRecord._id}:`, error.message);
        stats.errors++;
      }
    }

    console.log("\n📈 Migration Summary:");
    console.log(`   Total records: ${stats.total}`);
    console.log(`   ✅ Migrated: ${stats.migrated}`);
    console.log(`   ⏭️  Skipped: ${stats.skipped}`);
    console.log(`   ❌ Errors: ${stats.errors}`);

    if (stats.migrated > 0) {
      console.log("\n⚠️  IMPORTANT NEXT STEPS:");
      console.log("   1. Upload all Mux videos to Cloudflare Stream");
      console.log("   2. Update CloudflareStreamData records with actual UIDs");
      console.log("   3. Verify all videos are working correctly");
      console.log("   4. Then you can safely delete old MuxData records");
    }

    console.log("\n✨ Migration completed!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateMuxToCloudflare()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrateMuxToCloudflare };



