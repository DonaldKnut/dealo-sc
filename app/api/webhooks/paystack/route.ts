import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/database";
import { ResourceModel } from "@/models/Resource";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    if (!signature)
      return NextResponse.json({ error: "No signature" }, { status: 400 });

    const computed = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
      .update(rawBody)
      .digest("hex");
    if (computed !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const { event, data } = body;

    if (event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const { reference, amount, metadata } = data;
    if (!metadata?.resourceId || !metadata?.userId) {
      return NextResponse.json({ received: true });
    }

    await connect();

    // Verify the payment amount matches the resource price
    const resource = await ResourceModel.findById(metadata.resourceId);
    if (!resource || !resource.isPaid) {
      return NextResponse.json({ received: true });
    }

    const expectedAmount = resource.price * 100; // Convert to kobo
    if (amount !== expectedAmount) {
      console.error("Payment amount mismatch", {
        expected: expectedAmount,
        received: amount,
      });
      return NextResponse.json({ received: true });
    }

    // Mark resource as purchased (you can create a separate Purchase model if needed)
    // For now, we'll increment the purchases count
    await ResourceModel.findByIdAndUpdate(metadata.resourceId, {
      $inc: { purchases: 1 },
    });

    // TODO: Create purchase record, send download link, etc.
    console.log("Payment successful:", {
      resourceId: metadata.resourceId,
      userId: metadata.userId,
    });

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("Paystack webhook error:", e);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
