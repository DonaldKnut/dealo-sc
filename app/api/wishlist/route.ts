import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { WishlistModel } from "@/models/Wishlist";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const wishlist = await WishlistModel.findOne({
      userId: session.user.id,
    }).populate({
      path: "items.workId",
      populate: {
        path: "creator",
        select: "firstName lastName avatar",
      },
    });

    return NextResponse.json({
      wishlist: wishlist?.items || [],
      count: wishlist?.items?.length || 0,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workId, action } = await req.json();
    if (!workId)
      return NextResponse.json({ error: "Work ID required" }, { status: 400 });

    await connect();

    const wishlist = await WishlistModel.findOne({ userId: session.user.id });

    if (action === "add") {
      // Check if item already exists
      const existingItem = wishlist?.items.find(
        (item: any) => item.workId.toString() === workId
      );

      if (existingItem) {
        return NextResponse.json({ message: "Already in wishlist" });
      }

      if (wishlist) {
        await WishlistModel.findByIdAndUpdate(wishlist._id, {
          $push: { items: { workId, addedAt: new Date() } },
        });
      } else {
        await WishlistModel.create({
          userId: session.user.id,
          items: [{ workId, addedAt: new Date() }],
        });
      }
    } else if (action === "remove") {
      if (wishlist) {
        await WishlistModel.findByIdAndUpdate(wishlist._id, {
          $pull: { items: { workId } },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
