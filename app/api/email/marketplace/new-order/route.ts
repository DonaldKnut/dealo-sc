import { NextResponse } from "next/server";
import {
  marketplaceEmailTemplates,
  sendMarketplaceEmail,
} from "@/lib/email/marketplace-emails";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { buyer, freelancer, workTitle, amount } = payload || {};

    if (!buyer?.email || !freelancer?.email || !workTitle || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const buyerTpl = marketplaceEmailTemplates.buyerConfirmation({
      buyerEmail: buyer.email,
      buyerName: buyer.name,
      freelancerEmail: freelancer.email,
      freelancerName: freelancer.name,
      workTitle,
      amount,
    });
    await sendMarketplaceEmail(
      buyer.email,
      buyerTpl.subject,
      buyerTpl.html,
      buyerTpl.text
    );

    const flTpl = marketplaceEmailTemplates.freelancerNotification({
      buyerEmail: buyer.email,
      buyerName: buyer.name,
      freelancerEmail: freelancer.email,
      freelancerName: freelancer.name,
      workTitle,
      amount,
    });
    await sendMarketplaceEmail(
      freelancer.email,
      flTpl.subject,
      flTpl.html,
      flTpl.text
    );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("marketplace new-order email failed", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}












