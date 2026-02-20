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

    if (order.status !== "disputed") {
      return NextResponse.json(
        { error: "Order not in dispute" },
        { status: 400 }
      );
    }

    order.status = "in-progress"; // Or adjust based on business rules
    await order.save();

    return NextResponse.json({ message: "Dispute resolved", order });
  } catch (error) {
    console.error("Error resolving dispute:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
