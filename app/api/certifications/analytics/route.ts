import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { certificationEngine } from "@/lib/certification-engine";
import { Assessment, Certification } from "@/models";
import { connect } from "@/database";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Authenticate user (admin only)
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    await connect();

    // Get analytics from certification engine
    const engineAnalytics = await certificationEngine.getAssessmentAnalytics();

    // Additional analytics queries
    const totalCertifications = await Certification.countDocuments();
    const totalAssessments = await Assessment.countDocuments();

    const recentCertifications = await Certification.find()
      .sort({ issuedAt: -1 })
      .limit(10)
      .populate("userId", "firstName lastName email")
      .populate("professionId", "name category");

    const professionStats = await Certification.aggregate([
      {
        $lookup: {
          from: "professions",
          localField: "professionId",
          foreignField: "_id",
          as: "profession",
        },
      },
      {
        $unwind: "$profession",
      },
      {
        $group: {
          _id: "$profession.name",
          count: { $sum: 1 },
          averageScore: { $avg: "$score" },
          totalRevenue: { $sum: "$profession.pricing" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const costAnalytics = await Assessment.aggregate([
      {
        $group: {
          _id: null,
          totalAICost: { $sum: "$aiCost" },
          averageAICost: { $avg: "$aiCost" },
          totalRevenue: { $sum: "$totalCost" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalCertifications,
          totalAssessments,
          successRate:
            totalAssessments > 0
              ? (totalCertifications / totalAssessments) * 100
              : 0,
          averageScore: engineAnalytics.averageScore || 0,
          totalAICost: costAnalytics[0]?.totalAICost || 0,
          totalRevenue: costAnalytics[0]?.totalRevenue || 0,
          profitMargin:
            costAnalytics[0]?.totalRevenue > 0
              ? ((costAnalytics[0].totalRevenue -
                  costAnalytics[0].totalAICost) /
                  costAnalytics[0].totalRevenue) *
                100
              : 0,
        },
        professionStats,
        recentCertifications: recentCertifications.map((cert: any) => ({
          id: cert._id,
          user: `${cert.userId.firstName} ${cert.userId.lastName}`,
          profession: cert.professionId.name,
          score: cert.score,
          level: cert.level,
          issuedAt: cert.issuedAt,
        })),
        engineAnalytics,
      },
    });
  } catch (error) {
    console.error("Error fetching certification analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
