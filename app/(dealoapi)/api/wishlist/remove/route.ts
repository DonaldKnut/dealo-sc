// api/wishlist/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { WishlistItemModel } from "@/models/WishlistItem";
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

    const userId = session.user.id;

    // Remove the item from the wishlist
    const wishlistItem = await WishlistItemModel.findOneAndDelete({
      user: userId,
      refId,
      refType,
    });
    if (!wishlistItem) {
      return NextResponse.json(
        { message: "Wishlist item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Item removed from wishlist." });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
