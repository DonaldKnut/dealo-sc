import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/database";
import { EnterpriseModel } from "@/models/Enterprise";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";

const FREE_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
];

function extractDomain(email: string) {
  const at = email.indexOf("@");
  return at > -1 ? email.slice(at + 1).toLowerCase() : "";
}

function isFreeDomain(domain: string) {
  return FREE_DOMAINS.includes(domain);
}

export async function POST(req: NextRequest) {
  try {
    const { companyName, email } = await req.json();
    if (!companyName || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const domain = extractDomain(email);
    if (!domain) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await connect();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // simple rate limit: 1 OTP per minute
    const existing = await EnterpriseModel.findOne({ primaryEmail: email });
    if (
      existing?.lastOtpSentAt &&
      Date.now() - existing.lastOtpSentAt.getTime() < 60 * 1000
    ) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a minute." },
        { status: 429 }
      );
    }

    const doc = await EnterpriseModel.findOneAndUpdate(
      { primaryEmail: email },
      {
        companyName,
        primaryEmail: email,
        domain,
        isFreeEmailDomain: isFreeDomain(domain),
        verified: false,
        verificationCode: code,
        verificationExpires: expires,
        trustLevel: isFreeDomain(domain) ? "low" : "medium",
        lastOtpSentAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Send OTP
    await sendVerificationEmail(email, companyName, "", code);

    return NextResponse.json({
      success: true,
      domain: doc.domain,
      free: doc.isFreeEmailDomain,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
