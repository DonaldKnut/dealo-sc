import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { EnterpriseModel } from "@/models/Enterprise";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    await connect();
    const doc = await EnterpriseModel.findOne({ primaryEmail: email });
    if (!doc || !doc.verificationCode || !doc.verificationExpires) {
      return NextResponse.json(
        { error: "No verification pending" },
        { status: 400 }
      );
    }
    if (doc.verificationCode !== code) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
    if (doc.verificationExpires.getTime() < Date.now()) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 });
    }
    doc.verified = true;
    doc.trustLevel = doc.isFreeEmailDomain ? "low" : "high";
    doc.verificationCode = undefined;
    doc.verificationExpires = undefined as any;
    await doc.save();
    return NextResponse.json({ success: true, trustLevel: doc.trustLevel });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
