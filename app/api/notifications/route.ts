import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { NotificationModel } from "@/models/Notification";

export const dynamic = "force-dynamic";

// GET: Fetch all notifications for the current user (returns empty when not signed in)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    await connect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const query: any = { user: session.user.id };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await NotificationModel.countDocuments({
      user: session.user.id,
      isRead: false,
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH: Mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { notificationIds, markAllAsRead } = await req.json();

    await connect();

    if (markAllAsRead) {
      await NotificationModel.updateMany(
        { user: session.user.id, isRead: false },
        { isRead: true }
      );
    } else if (notificationIds && Array.isArray(notificationIds)) {
      await NotificationModel.updateMany(
        {
          _id: { $in: notificationIds },
          user: session.user.id,
        },
        { isRead: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update notifications" },
      { status: 500 }
    );
  }
}
