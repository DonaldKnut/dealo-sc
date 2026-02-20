import { connect } from "@/database";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PurchaseModel } from "../../../../models/Purchase"; // Corrected import

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  await connect(); // Ensure MongoDB connection is established

  const rawBody = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customerId = session?.metadata?.customerId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!customerId || !courseId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    try {
      await PurchaseModel.create({
        userId: customerId, // Use `userId` field from the schema
        courseId: courseId, // Use `courseId` field from the schema
        amount: session.amount_total, // Example: Add the amount
        paymentDate: new Date(),
      });
    } catch (error) {
      console.error("Error saving purchase to database:", error);
      return new NextResponse("Failed to save purchase", { status: 500 });
    }
  } else {
    return new NextResponse(`Unhandled event type: ${event.type}`, {
      status: 400,
    });
  }

  return new NextResponse("Success", { status: 200 });
};
