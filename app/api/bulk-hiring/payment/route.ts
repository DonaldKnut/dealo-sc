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

// Payment Schema for tracking bulk hiring payments
const bulkHiringPaymentSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, required: true },
  companyName: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, enum: ["deposit", "final"], required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: { type: String },
  transactionId: { type: String },
  reference: { type: String, unique: true },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BulkHiringPayment =
  mongoose.models.BulkHiringPayment ||
  mongoose.model("BulkHiringPayment", bulkHiringPaymentSchema);

// Initialize Paystack payment
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { requestId, amount, paymentType, companyEmail } = await req.json();

    // Validate inputs
    if (!requestId || !amount || !paymentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `BH-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create payment record
    const payment = await BulkHiringPayment.create({
      requestId,
      companyName: session.user.name || "Unknown",
      amount,
      paymentType,
      status: "pending",
      reference,
      metadata: {
        email: companyEmail || session.user.email,
        userId: session.user.id,
      },
    });

    // Initialize payment using selected provider
    const provider = getSelectedProvider();
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/employment/bulk-hiring/payment/success`;
    const result = await initializePayment({
      email: companyEmail || (session.user as any).email,
      amount,
      reference,
      callbackUrl,
      metadata: {
        requestId,
        paymentType,
        paymentId: payment._id,
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
    console.error("Error initializing bulk hiring payment:", error);
    const msg = String(error?.message || "");
    const provider = getSelectedProvider();
    const needsConfiguration = /not set|Configure env/i.test(msg);
    return NextResponse.json(
      {
        error: needsConfiguration
          ? `Payment provider ${provider} is not configured. Add API keys to env.`
          : "Failed to initialize payment",
        details: error.message,
        provider,
        needsConfiguration,
      },
      { status: needsConfiguration ? 503 : 500 }
    );
  }
}

// Verify payment
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

    // Verify via selected provider
    const provider = getSelectedProvider();
    const verify = await verifyPayment(reference);

    // Update payment record
    await BulkHiringPayment.findOneAndUpdate(
      { reference },
      {
        status:
          verify.status === "success"
            ? "completed"
            : verify.status === "failed"
            ? "failed"
            : "pending",
        transactionId: (verify.raw?.data?.id as any) || undefined,
        paymentMethod: verify.channel,
        updatedAt: new Date(),
      }
    );

    // Normalize metadata for client
    const metadata =
      provider === "paystack"
        ? verify.raw?.data?.metadata
        : Array.isArray(verify.raw?.data)
        ? verify.raw?.data?.[0]?.meta
        : verify.raw?.data?.meta;

    return NextResponse.json(
      {
        success: verify.success,
        status: verify.status,
        amount: verify.amount,
        metadata,
        provider,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment", details: error.message },
      { status: 500 }
    );
  }
}
