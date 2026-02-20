import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { JobAlertModel } from "@/models/JobAlert";

export const dynamic = "force-dynamic";

// Create or update job alert
export async function POST(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const alertData = await req.json();

    // Check if alert already exists for this user with same criteria
    const existing = await JobAlertModel.findOne({
      user: session.user.id,
      searchQuery: alertData.searchQuery || undefined,
      location: alertData.location || undefined,
      experience: alertData.experience || undefined,
      category: alertData.category || undefined,
    });

    if (existing) {
      // Update existing alert
      existing.isActive = alertData.isActive !== false;
      existing.minSalary = alertData.minSalary;
      existing.maxSalary = alertData.maxSalary;
      existing.remote = alertData.remote;
      await existing.save();

      return NextResponse.json(
        { success: true, alert: existing },
        { status: 200 }
      );
    }

    // Create new alert
    const alert = await JobAlertModel.create({
      user: session.user.id,
      ...alertData,
      isActive: true,
    });

    return NextResponse.json(
      { success: true, alert },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating job alert:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create job alert" },
      { status: 500 }
    );
  }
}

// Get user's job alerts
export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const alerts = await JobAlertModel.find({
      user: session.user.id,
      isActive: true,
    }).lean();

    return NextResponse.json(
      {
        success: true,
        alerts: alerts.map((alert: any) => ({
          _id: alert._id.toString(),
          ...alert,
          createdAt: alert.createdAt?.toISOString(),
          updatedAt: alert.updatedAt?.toISOString(),
          lastNotifiedAt: alert.lastNotifiedAt?.toISOString(),
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching job alerts:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch job alerts" },
      { status: 500 }
    );
  }
}

// Delete job alert
export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const alertId = url.searchParams.get("alertId");

    if (!alertId) {
      return NextResponse.json(
        { success: false, message: "Alert ID is required" },
        { status: 400 }
      );
    }

    await JobAlertModel.findOneAndDelete({
      _id: alertId,
      user: session.user.id,
    });

    return NextResponse.json(
      { success: true, message: "Alert deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting job alert:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete job alert" },
      { status: 500 }
    );
  }
}




