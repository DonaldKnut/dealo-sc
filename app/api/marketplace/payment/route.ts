import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import mongoose from "mongoose";
import {
  initializePayment,
  verifyPayment,
  getSelectedProvider,
} from "@/lib/payments/providers";
import { OrderModel } from "@/models/Order";

// Schema to track marketplace payment intents (optional minimal)
const marketplacePaymentSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  workId: { type: mongoose.Schema.Types.ObjectId, required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["initialized", "verified", "failed"],
    default: "initialized",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MarketplacePayment =
  mongoose.models.MarketplacePayment ||
  mongoose.model("MarketplacePayment", marketplacePaymentSchema);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { workId, freelancerId, amount, requirements } = await req.json();
    if (!workId || !freelancerId || !amount) {
      return NextResponse.json(
        { error: "workId, freelancerId and amount are required" },
        { status: 400 }
      );
    }

    const buyerId = (session.user as any).id;

    const reference = `MK-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}`;

    await MarketplacePayment.create({
      reference,
      workId,
      buyerId,
      freelancerId,
      amount,
      status: "initialized",
    });

    const provider = getSelectedProvider();
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/payment/success`;
    const result = await initializePayment({
      email: (session.user as any).email,
      amount,
      reference,
      callbackUrl,
      metadata: {
        workId,
        buyerId,
        freelancerId,
        requirements,
        type: "marketplace-escrow",
      },
    });

    return NextResponse.json(
      {
        success: true,
        authorizationUrl: result.authorizationUrl,
        reference: result.reference,
        provider,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error initializing marketplace payment:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const reference =
      searchParams.get("reference") ||
      searchParams.get("tx_ref") ||
      searchParams.get("ref") ||
      "";
    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      );
    }

    const verify = await verifyPayment(reference);
    const provider = getSelectedProvider();

    // Update payment record
    const paymentRecord = await MarketplacePayment.findOneAndUpdate(
      { reference },
      { status: verify.success ? "verified" : "failed", updatedAt: new Date() },
      { new: true }
    );

    // On success, create an order in escrow (in-progress)
    if (verify.success && paymentRecord) {
      const existingOrder = await OrderModel.findOne({
        user: paymentRecord.buyerId,
        "items.work": paymentRecord.workId,
        totalAmount: paymentRecord.amount,
        status: { $in: ["pending", "in-progress"] },
      });

      if (!existingOrder) {
        const total = paymentRecord.amount;
        const platformFee = Math.round(total * 0.1 * 100) / 100;
        const payout = total - platformFee;

        const order = await OrderModel.create({
          user: paymentRecord.buyerId,
          freelancer: paymentRecord.freelancerId,
          items: [
            {
              work: paymentRecord.workId,
              quantity: 1,
              price: paymentRecord.amount,
            },
          ],
          totalAmount: total,
          status: "in-progress",
          escrowAmount: total,
          platformFee,
          freelancerPayout: payout,
        });

        // Fire-and-forget emails to buyer and placeholder freelancer email
        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        fetch(`${appUrl}/api/email/marketplace/new-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buyer: { email: verify.raw?.data?.customer?.email },
            freelancer: { email: "support@dealo.africa" },
            workTitle: "Marketplace Order",
            amount: total,
            orderId: order._id,
          }),
        }).catch(() => {});
      }
    }

    return NextResponse.json(
      {
        success: verify.success,
        status: verify.status,
        amount: verify.amount,
        metadata: verify.raw?.data?.metadata || verify.raw?.data?.[0]?.meta,
        provider,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying marketplace payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment", details: error.message },
      { status: 500 }
    );
  }
}
