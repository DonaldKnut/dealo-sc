import { NextResponse } from "next/server";
import { bulkHiringEmailTemplates } from "@/lib/email/bulk-hiring-emails";

export async function POST(req: Request) {
  try {
    const { request } = await req.json();

    const template = bulkHiringEmailTemplates.adminNotification(request);

    // Admin emails - send to multiple admins if needed
    const adminEmails = [
      process.env.ADMIN_EMAIL || "hello@dealo.africa",
      // Add more admin emails as needed
    ];

    console.log("Sending admin notification to:", adminEmails);
    console.log("Subject:", template.subject);

    // TODO: Replace with actual email service
    // Example with Resend:
    // for (const adminEmail of adminEmails) {
    //   await resend.emails.send({
    //     from: 'Dealo Notifications <notifications@dealo.africa>',
    //     to: adminEmail,
    //     subject: template.subject,
    //     html: template.html,
    //   });
    // }

    return NextResponse.json(
      { success: true, message: "Admin notification sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 }
    );
  }
}












