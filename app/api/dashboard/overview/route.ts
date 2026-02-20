import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { rateLimiters } from "@/lib/middleware/rate-limit";
import { connect } from "@/database";
import { UserModel } from "@/models/User";
import { CertificationModel } from "@/models/Certification";
import { FollowModel } from "@/models/Follow";
import { JobApplicationModel } from "@/models/JobApplication";
import { ProgressModel } from "@/models/Progress";
import { SectionModel } from "@/models/Section";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(req);
    
    // Apply rate limiting
    const rateLimitResult = await rateLimiters.standard(req, user.id);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(rateLimitResult.resetTime / 1000).toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    await connect();

    // Get session to access _id if available
    const session = await getServerSession(authOptions);
    
    // Resolve user by _id if available, else by email (handles OAuth provider ids)
    let userDoc = null as any;
    const sessionAny = session?.user as any;
    if (sessionAny?._id) {
      userDoc = await UserModel.findById(sessionAny._id).select(
        "firstName lastName email avatar isProfileComplete"
      );
    }
    if (!userDoc && user.email) {
      userDoc = await UserModel.findOne({ email: user.email }).select(
        "firstName lastName email avatar isProfileComplete"
      );
    }
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userDoc._id;

    const [activeCerts, connectionsCount, jobAppsCount] = await Promise.all([
      CertificationModel.find({ userId, isActive: true })
        .sort({ issuedAt: -1 })
        .limit(10),
      FollowModel.countDocuments({ followerId: userId }),
      JobApplicationModel.countDocuments({ userId }),
    ]);

    // Compute courses completed: count distinct courseIds where all sections have completed progress
    let coursesCompleted = 0;
    try {
      // Find sections with completed progress for this user via StudentInfo
      const completedProgress = await ProgressModel.find({ completed: true })
        .populate({ path: "studentId", select: "userId" })
        .populate({ path: "sectionId", select: "courseId" });

      const courseIdToSectionCounts = new Map<
        string,
        { completed: number; total: number }
      >();

      for (const p of completedProgress as any[]) {
        if (String(p?.studentId?.userId) !== String(userId)) continue;
        const courseId = p?.sectionId?.courseId?.toString();
        if (!courseId) continue;
        const entry = courseIdToSectionCounts.get(courseId) || {
          completed: 0,
          total: 0,
        };
        entry.completed += 1;
        courseIdToSectionCounts.set(courseId, entry);
      }

      // For each course we saw progress in, compute total sections
      const courseIds = Array.from(courseIdToSectionCounts.keys());
      if (courseIds.length > 0) {
        const totals = await SectionModel.aggregate([
          {
            $match: {
              courseId: {
                $in: courseIds.map(
                  (id) => new (require("mongoose").Types.ObjectId)(id)
                ),
              },
            },
          },
          { $group: { _id: "$courseId", total: { $sum: 1 } } },
        ]);
        const totalMap = new Map<string, number>();
        for (const t of totals) totalMap.set(String(t._id), t.total);
        for (const id of courseIds) {
          const entry = courseIdToSectionCounts.get(id)!;
          entry.total = totalMap.get(id) || entry.total;
          if (entry.total > 0 && entry.completed >= entry.total)
            coursesCompleted += 1;
        }
      }
    } catch {}

    const [recentFollows, recentJobApps] = await Promise.all([
      FollowModel.find({ followerId: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("followingId", "firstName lastName"),
      JobApplicationModel.find({ userId }).sort({ _id: -1 }).limit(5),
    ]);

    const certEvents = activeCerts.slice(0, 5).map((c: any) => ({
      id: c._id,
      type: "cert",
      title: `Certification issued in ${c.field} (${c.level})`,
      ts: c.issuedAt ? new Date(c.issuedAt).getTime() : Date.now(),
    }));
    const followEvents = recentFollows.map((f: any) => ({
      id: f._id,
      type: "network",
      title: `Followed ${f.followingId?.firstName || "User"} ${
        f.followingId?.lastName || ""
      }`.trim(),
      ts: f.createdAt ? new Date(f.createdAt).getTime() : Date.now(),
    }));
    const jobEvents = recentJobApps.map((a: any) => ({
      id: a._id,
      type: "job",
      title: "Submitted a job application",
      ts: a.createdAt ? new Date(a.createdAt).getTime() : Date.now(),
    }));

    const recentActivity = [...certEvents, ...followEvents, ...jobEvents]
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 10);

    // Don't expose email in response - it's sensitive data
    const response = NextResponse.json({
      user: {
        id: userDoc?._id?.toString(),
        name: `${userDoc?.firstName || ""} ${userDoc?.lastName || ""}`.trim(),
        // Email removed - sensitive data should not be exposed
        avatar: userDoc?.avatar || null,
        isProfileComplete: !!userDoc?.isProfileComplete,
      },
      stats: {
        coursesCompleted,
        certifications: activeCerts.length,
        connections: connectionsCount,
        jobApplications: jobAppsCount,
      },
      recentActivity,
    });
    
    // Add rate limit headers
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", Math.ceil(rateLimitResult.resetTime / 1000).toString());
    
    return response;
  } catch (error: any) {
    console.error("/api/dashboard/overview error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
