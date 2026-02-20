import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { ResourceModel } from "@/models/Resource";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resourceId, provider = "paystack" } = await req.json();
    if (!resourceId)
      return NextResponse.json(
        { error: "Resource ID required" },
        { status: 400 }
      );

    await connect();

    const resource = await ResourceModel.findById(resourceId);
    if (!resource)
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    if (!resource.isPaid)
      return NextResponse.json({ error: "Resource is free" }, { status: 400 });

    // Create payment session
    const paymentData = {
      amount: resource.price * 100, // Convert to kobo/pesos
      currency: resource.currency,
      email: session.user.email,
      metadata: {
        resourceId: resource._id.toString(),
        userId: session.user.id,
        provider,
      },
    };

    let paymentUrl = "";
    let reference = "";

    if (provider === "paystack") {
      // Paystack initialization
      const paystackResponse = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...paymentData,
            callback_url: `${process.env.NEXTAUTH_URL}/api/webhooks/paystack`,
          }),
        }
      );

      if (!paystackResponse.ok) {
        throw new Error("Paystack initialization failed");
      }

      const paystackData = await paystackResponse.json();
      paymentUrl = paystackData.data.authorization_url;
      reference = paystackData.data.reference;
    } else if (provider === "flutterwave") {
      // Flutterwave initialization
      const flutterwaveResponse = await fetch(
        "https://api.flutterwave.com/v3/payments",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...paymentData,
            redirect_url: `${process.env.NEXTAUTH_URL}/api/webhooks/flutterwave`,
            tx_ref: `resource_${resourceId}_${Date.now()}`,
          }),
        }
      );

      if (!flutterwaveResponse.ok) {
        throw new Error("Flutterwave initialization failed");
      }

      const flutterwaveData = await flutterwaveResponse.json();
      paymentUrl = flutterwaveData.data.link;
      reference = flutterwaveData.data.tx_ref;
    }

    return NextResponse.json({
      success: true,
      paymentUrl,
      reference,
      amount: resource.price,
      currency: resource.currency,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Payment initialization failed" },
      { status: 500 }
    );
  }
}
