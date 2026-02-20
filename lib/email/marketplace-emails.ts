export interface NewOrderEmailPayload {
  buyerEmail: string;
  buyerName?: string;
  freelancerEmail: string;
  freelancerName?: string;
  workTitle: string;
  amount: number;
  orderId?: string;
}

export const marketplaceEmailTemplates = {
  buyerConfirmation: (p: NewOrderEmailPayload) => ({
    subject: `Your order is now in escrow - ${p.workTitle}`,
    text: `Hi ${
      p.buyerName || "there"
    },\n\nWe received your payment of ₦${p.amount.toLocaleString()} for "${
      p.workTitle
    }". Your funds are now held in escrow. The freelancer has been notified and will start.\n\nYou'll be able to review the delivery before we release the funds.\n\nThanks,\nDealo`,
    html: `<p>Hi ${
      p.buyerName || "there"
    },</p><p>We received your payment of <strong>₦${p.amount.toLocaleString()}</strong> for <strong>${
      p.workTitle
    }</strong>. Your funds are now held in escrow. The freelancer has been notified and will start.</p><p>You'll be able to review the delivery before we release the funds.</p><p>Thanks,<br/>Dealo</p>`,
  }),
  freelancerNotification: (p: NewOrderEmailPayload) => ({
    subject: `New order assigned - ${p.workTitle}`,
    text: `Hi ${p.freelancerName || "there"},\n\nYou have a new order for "${
      p.workTitle
    }". The buyer has paid ₦${p.amount.toLocaleString()} which is held in escrow. Start work and submit when done.\n\nThanks,\nDealo`,
    html: `<p>Hi ${
      p.freelancerName || "there"
    },</p><p>You have a new order for <strong>${
      p.workTitle
    }</strong>. The buyer has paid <strong>₦${p.amount.toLocaleString()}</strong> which is held in escrow.</p><p>Please start work and submit when done.</p><p>Thanks,<br/>Dealo</p>`,
  }),
};

export async function sendMarketplaceEmail(
  to: string | string[],
  subject: string,
  html: string,
  text: string
) {
  // Placeholder: integrate your email provider here
  try {
    await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html, text }),
    });
  } catch (e) {
    console.error("Failed to send marketplace email", e);
  }
}












