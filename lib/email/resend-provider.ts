/**
 * Resend Email Provider Integration
 * Plug-and-play: Just add RESEND_API_KEY to .env
 */

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmailViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set. Email not sent:", payload.subject);
    return { success: false, error: "Email provider not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: payload.from || "Dealo <hello@dealo.africa>",
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return { success: false, error: data.message || "Email send failed" };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// Fallback to console log if no provider configured
export async function sendEmail(payload: EmailPayload) {
  const provider = process.env.EMAIL_PROVIDER || "resend";

  if (provider === "resend") {
    return sendEmailViaResend(payload);
  }

  // Default: log to console (development mode)
  console.log("📧 Email (not sent - no provider):", {
    to: payload.to,
    subject: payload.subject,
  });

  return { success: false, error: "No email provider configured" };
}


