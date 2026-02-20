import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/database";
import { UserModel } from "@/models/User";
import { authOptions } from "@/authOptions/authOptions";
import Work from "@/models/Work";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    console.log("📡 Incoming request to /api/fetch-details");

    await connect();
    console.log("✅ Database connected successfully");

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.error("❌ Unauthorized: No session user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("✅ User authenticated:", session.user.id);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const workId = searchParams.get("workId");

    if (!userId || !workId) {
      console.error("❌ Missing userId or workId");
      return NextResponse.json(
        { error: "Missing userId or workId." },
        { status: 400 }
      );
    }

    // Fetch user details
    console.log("🔎 Fetching user details from database...");
    const user = await UserModel.findById(userId).populate([
      "cart",
      "wishlist",
    ]);

    if (!user) {
      console.error("❌ User not found in database:", userId);
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    console.log("✅ User found:", user._id);

    // Fetch work details
    console.log("🔎 Fetching work details for workId:", workId);
    const product = await Work.findById(workId)
      .populate("creator", "firstName lastName")
      .select("name freelancerName freelancerRating price category creator");

    if (!product) {
      console.error("❌ Work not found for workId:", workId);
      return NextResponse.json(
        { error: "Product (work) not found." },
        { status: 404 }
      );
    }
    console.log("✅ Work found:", product._id);
    console.log("Creator details:", product.creator);

    return NextResponse.json(
      {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          cart: user.cart,
          wishlist: user.wishlist,
          credits: user.credits || 0,
        },
        product: {
          name: product.name,
          freelancerName: product.freelancerName,
          freelancerRating: product.freelancerRating,
          price: product.price,
          category: product.category,
          creator: product.creator
            ? {
                firstName: product.creator.firstName,
                lastName: product.creator.lastName,
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error in GET /api/fetch-details:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
