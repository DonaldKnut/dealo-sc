import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { JobAlertModel } from "@/models/JobAlert";
import { JobModel } from "@/models/Job";
import { UserModel } from "@/models/User";
import { sendJobAlertEmail } from "@/lib/job-alert-email";

export const dynamic = "force-dynamic";

// This endpoint should be called by a cron job or scheduled task
// to check for new jobs matching user alerts and send notifications
export async function POST(req: NextRequest) {
  try {
    await connect();

    // Get all active job alerts
    const alerts = await JobAlertModel.find({ isActive: true }).populate("user");

    let notificationsSent = 0;

    for (const alert of alerts) {
      try {
        const user: any = alert.user;
        if (!user || !user.email) continue;

        // Build query based on alert criteria
        const query: any = {};

        if (alert.searchQuery) {
          query.$or = [
            { title: { $regex: alert.searchQuery, $options: "i" } },
            { description: { $regex: alert.searchQuery, $options: "i" } },
            { skillsRequired: { $in: [new RegExp(alert.searchQuery, "i")] } },
          ];
        }

        if (alert.location) {
          if (alert.location.toLowerCase() === "remote") {
            query.remote = true;
          } else {
            query.$or = [
              ...(query.$or || []),
              { location: { $regex: alert.location, $options: "i" } },
              { city: { $regex: alert.location, $options: "i" } },
              { country: { $regex: alert.location, $options: "i" } },
            ];
          }
        }

        if (alert.experience) {
          const experienceMap: Record<string, any> = {
            "Entry Level": { $lte: 1 },
            "Mid Level": { $gte: 2, $lte: 5 },
            "Senior Level": { $gte: 5, $lte: 10 },
            "Expert Level": { $gte: 10 },
          };
          if (experienceMap[alert.experience]) {
            query.experienceRequired = experienceMap[alert.experience];
          }
        }

        if (alert.category) {
          query.category = { $regex: alert.category, $options: "i" };
        }

        if (alert.type) {
          query.type = alert.type;
        }

        if (alert.remote !== undefined) {
          query.remote = alert.remote;
        }

        if (alert.minSalary || alert.maxSalary) {
          query.budget = {};
          if (alert.minSalary) query.budget.$gte = alert.minSalary;
          if (alert.maxSalary) query.budget.$lte = alert.maxSalary;
        }

        // Only get jobs created after the last notification
        if (alert.lastNotifiedAt) {
          query.createdAt = { $gt: alert.lastNotifiedAt };
        } else {
          // For first-time alerts, only get jobs from last 7 days
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          query.createdAt = { $gte: sevenDaysAgo };
        }

        // Find matching jobs
        const matchingJobs = await JobModel.find(query)
          .populate("company", "name")
          .limit(10)
          .lean();

        if (matchingJobs.length > 0) {
          // Send email notification
          const result = await sendJobAlertEmail({
            email: user.email,
            firstName: user.firstName || "User",
            jobs: matchingJobs.map((job: any) => ({
              title: job.title,
              company: job.company?.name,
              location: job.location || job.city || job.country || "Location not specified",
              budget: job.budget,
              type: job.type,
              _id: job._id.toString(),
            })),
            searchCriteria: alert.searchQuery || alert.location || alert.category,
          });

          if (result.success) {
            // Update last notified time
            alert.lastNotifiedAt = new Date();
            await alert.save();
            notificationsSent++;
          }
        }
      } catch (error) {
        console.error(`Error processing alert ${alert._id}:`, error);
        continue;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Processed ${alerts.length} alerts, sent ${notificationsSent} notifications`,
        notificationsSent,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking job alerts:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to check job alerts" },
      { status: 500 }
    );
  }
}

// GET endpoint to manually trigger (for testing)
export async function GET(req: NextRequest) {
  // You might want to add authentication here for security
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Create a mock POST request
  const mockReq = new NextRequest(req.url, {
    method: "POST",
    headers: req.headers,
  });
  return POST(mockReq);
}

