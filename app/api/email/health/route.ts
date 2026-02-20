import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const host = process.env.EMAIL_HOST || "smtp.zoho.com";
    const port = parseInt(process.env.EMAIL_PORT || "465", 10);
    const secure = process.env.EMAIL_SECURE === "true" || port === 465;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing EMAIL_USER or EMAIL_PASS environment variables",
          provider: {
            host,
            port,
            secure,
            userPresent: Boolean(user),
            passPresent: Boolean(pass),
          },
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    // Verify connection configuration
    await transporter.verify();

    return NextResponse.json({
      ok: true,
      provider: {
        host,
        port,
        secure,
        userPresent: Boolean(user),
        passPresent: Boolean(pass),
        user: user.substring(0, 3) + "***" + user.substring(user.indexOf("@")),
      },
    });
  } catch (error: any) {
    console.error("SMTP verification error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to verify SMTP transporter",
        details: error?.code || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json().catch(() => ({ to: undefined }));

    const host = process.env.EMAIL_HOST || "smtp.zoho.com";
    const port = parseInt(process.env.EMAIL_PORT || "465", 10);
    const secure = process.env.EMAIL_SECURE === "true" || port === 465;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const from =
      process.env.EMAIL_FROM ||
      (user ? `"Dealo Talent Network" <${user}>` : undefined);

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });

    await transporter.verify();

    if (to) {
      const info = await transporter.sendMail({
        from,
        to,
        subject: "Dealo email health-check",
        text: "This is a test message to verify SMTP configuration.",
      });

      return NextResponse.json({ ok: true, messageId: info.messageId });
    }

    return NextResponse.json({
      ok: true,
      note: "No 'to' provided; verification only",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to send test email",
      },
      { status: 500 }
    );
  }
}
