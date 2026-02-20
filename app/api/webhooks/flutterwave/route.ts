import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/database";
import { ResourceModel } from "@/models/Resource";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("verif-hash");
    if (!signature)
      return NextResponse.json({ error: "No signature" }, { status: 400 });

    const secret = process.env.FLW_SECRET_KEY || "";
    const computed = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    if (computed !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const { event, data } = body;

    if (event !== "charge.completed") {
      return NextResponse.json({ received: true });
    }

    const { tx_ref, amount, customer } = data;
    if (!tx_ref || !amount) {
      return NextResponse.json({ received: true });
    }

    // Extract resource ID from tx_ref (format: resource_${resourceId}_${timestamp})
    const resourceId = tx_ref.split("_")[1];
    if (!resourceId) {
      return NextResponse.json({ received: true });
    }

    await connect();

    // Verify the payment amount matches the resource price
    const resource = await ResourceModel.findById(resourceId);
    if (!resource || !resource.isPaid) {
      return NextResponse.json({ received: true });
    }

    const expectedAmount = resource.price * 100; // Convert to pesewas
    if (amount !== expectedAmount) {
      console.error("Payment amount mismatch", {
        expected: expectedAmount,
        received: amount,
      });
      return NextResponse.json({ received: true });
    }

    // Mark resource as purchased
    await ResourceModel.findByIdAndUpdate(resourceId, {
      $inc: { purchases: 1 },
    });

    // TODO: Create purchase record, send download link, etc.
    console.log("Payment successful:", {
      resourceId,
      customer: customer?.email,
    });

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("Flutterwave webhook error:", e);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
