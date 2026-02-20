import { NextResponse } from "next/server";
import { connect } from "@/database";
import mongoose from "mongoose";

// Get models
const getModels = async () => {
  await connect();

  const MarketplacePayment = mongoose.models.MarketplacePayment;
  const BulkHiringPayment = mongoose.models.BulkHiringPayment;

  return { MarketplacePayment, BulkHiringPayment };
};

export async function POST(req: Request) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "change-me-in-production";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { MarketplacePayment, BulkHiringPayment } = await getModels();

    // Cleanup payments older than 1 hour that are still "initialized"
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    let marketplaceCount = 0;
    let bulkHiringCount = 0;

    if (MarketplacePayment) {
      const result = await MarketplacePayment.updateMany(
        {
          status: "initialized",
          createdAt: { $lt: oneHourAgo },
        },
        {
          $set: { status: "failed", updatedAt: new Date() },
        }
      );
      marketplaceCount = result.modifiedCount || 0;
    }

    if (BulkHiringPayment) {
      const result = await BulkHiringPayment.updateMany(
        {
          status: "pending",
          createdAt: { $lt: oneHourAgo },
        },
        {
          $set: { status: "failed", updatedAt: new Date() },
        }
      );
      bulkHiringCount = result.modifiedCount || 0;
    }

    return NextResponse.json({
      success: true,
      cleaned: {
        marketplacePayments: marketplaceCount,
        bulkHiringPayments: bulkHiringCount,
        total: marketplaceCount + bulkHiringCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Cleanup failed", details: error.message },
      { status: 500 }
    );
  }
}

// GET for manual trigger (admin only)
export async function GET(req: Request) {
  return POST(req);
}


