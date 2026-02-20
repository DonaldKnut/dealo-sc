import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { OrderModel } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  await connect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = params;

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "in-progress") {
      return NextResponse.json(
        { error: "Order not in progress" },
        { status: 400 }
      );
    }

    // Compute platform fee/payout if not present (fallback)
    if (!order.platformFee || !order.freelancerPayout) {
      const total = order.totalAmount;
      const platformFee = Math.round(total * 0.1 * 100) / 100;
      order.platformFee = platformFee;
      order.freelancerPayout = total - platformFee;
    }

    order.status = "completed";
    order.releasedAt = new Date();
    await order.save();

    return NextResponse.json({ message: "Order completed", order });
  } catch (error) {
    console.error("Error releasing funds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
