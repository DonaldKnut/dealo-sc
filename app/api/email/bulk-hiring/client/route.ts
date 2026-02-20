import { NextResponse } from "next/server";
import { bulkHiringEmailTemplates } from "@/lib/email/bulk-hiring-emails";

export async function POST(req: Request) {
  try {
    const { request } = await req.json();

    const template = bulkHiringEmailTemplates.clientConfirmation(request);

    // Use your existing email service (Resend, SendGrid, etc.)
    // For now, we'll log it (replace with actual email sending)
    console.log("Sending client confirmation email to:", request.email);
    console.log("Subject:", template.subject);

    // TODO: Replace with actual email service
    // Example with Resend:
    // const { data, error } = await resend.emails.send({
    //   from: 'Dealo <hello@dealo.africa>',
    //   to: request.email,
    //   subject: template.subject,
    //   html: template.html,
    // });

    return NextResponse.json(
      { success: true, message: "Client email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending client email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}












