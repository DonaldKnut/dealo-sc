// api/wishlist/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { WishlistItemModel, WishlistItemType } from "@/models/WishlistItem";
import { JobModel } from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession({ req: req, ...authOptions });
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { refId, refType } = await req.json();

    if (!refId || !refType) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!Object.values(WishlistItemType).includes(refType)) {
      return NextResponse.json(
        { message: "Invalid reference type." },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if the item already exists in the wishlist
    const existingItem = await WishlistItemModel.findOne({
      user: userId,
      refId,
      refType,
    });
    if (existingItem) {
      return NextResponse.json(
        { message: "Item is already in the wishlist." },
        { status: 400 }
      );
    }

    // Create a new wishlist item
    const wishlistItem = await WishlistItemModel.create({
      user: userId,
      refId,
      refType,
    });

    return NextResponse.json({
      message: "Item added to wishlist.",
      item: wishlistItem,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
