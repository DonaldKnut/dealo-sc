import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend-provider";

export async function POST(req: Request) {
  try {
    const { to, subject, html, text } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "to, subject, and html are required" },
        { status: 400 }
      );
    }

    const result = await sendEmail({ to, subject, html, text });

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Email route error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}


