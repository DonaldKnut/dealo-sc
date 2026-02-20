import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { OrderModel } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

export async function POST(req: NextRequest) {
  await connect();

  const session = await getServerSession(authOptions);

  // Ensure the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      transactionId,
      workId,
      price,
      quantity,
      status,
      freelancerId,
      requirements,
    } = await req.json();

    // Validate required fields
    if (!transactionId || !workId || !price || !quantity || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new order
    const total = price * quantity;
    const platformFee = Math.round(total * 0.1 * 100) / 100; // 10% fee
    const payout = total - platformFee;

    const order = await OrderModel.create({
      transactionId,
      user: (session.user as any).id,
      freelancer: freelancerId,
      totalAmount: total,
      items: [{ work: workId, price, quantity }],
      status,
      escrowAmount: total,
      requirements,
      platformFee,
      freelancerPayout: payout,
    });

    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
