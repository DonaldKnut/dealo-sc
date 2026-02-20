import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Freelance Marketplace Nigeria | Hire Nigerian Freelancers | Find Freelance Work",
  description:
    "🇳🇬 Nigeria's largest freelance marketplace. 50,000+ freelancers offering services from ₦5,000. Hire graphic designers, developers, writers, marketers. Secure escrow payments. 10% fees (vs Fiverr 20%). Best Fiverr & Upwork alternative for Nigerians!",
  keywords: [
    "freelance marketplace nigeria",
    "hire freelancers nigeria",
    "freelance services nigeria",
    "fiverr nigeria",
    "upwork nigeria",
    "nigerian freelancers",
    "hire graphic designer nigeria",
    "hire developer nigeria",
    "hire content writer nigeria",
    "freelance website nigeria",
    "gig economy nigeria",
    "freelance work nigeria",
    "find freelance jobs nigeria",
    "sell services online nigeria",
    "freelancer platform nigeria",
    "remote work marketplace nigeria",
    "hire virtual assistant nigeria",
    "hire digital marketer nigeria",
    "freelance portfolio nigeria",
    "nigerian talent marketplace",
  ],
  openGraph: {
    title: "Freelance Marketplace Nigeria | 50,000+ Nigerian Freelancers",
    description:
      "Hire vetted Nigerian freelancers or find freelance work. Secure payments, 10% fees, escrow protection.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nigeria's #1 Freelance Marketplace",
    description:
      "50,000+ freelancers. Services from ₦5K. Better than Fiverr for Nigerians.",
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
