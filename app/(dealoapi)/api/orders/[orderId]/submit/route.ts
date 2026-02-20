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
  const { note } = await req.json().catch(() => ({ note: "" }));

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only assigned freelancer or admin can submit
    const userId = (session.user as any).id;
    const isAdmin = (session.user as any).isAdmin;
    if (!isAdmin && String(order.freelancer) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status !== "in-progress") {
      return NextResponse.json(
        { error: "Order is not in progress" },
        { status: 400 }
      );
    }

    order.isSubmitted = true;
    order.submittedAt = new Date();
    await order.save();

    // TODO: notify buyer to review

    return NextResponse.json({ message: "Submission recorded", order });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to submit work" },
      { status: 500 }
    );
  }
}












