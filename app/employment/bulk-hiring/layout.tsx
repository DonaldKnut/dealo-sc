import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Hiring & Team Outsourcing in Nigeria | Hire 5-50+ Zoom",
  description:
    "🇳🇬 Hire entire teams of vetted Nigerian zoom in 2-4 weeks. From ₦500K. Get developers, designers, marketers & more. 98% success rate. Better than recruitment agencies - save 60%. Bulk hiring made simple for Nigerian businesses.",
  keywords: [
    "bulk hiring nigeria",
    "team outsourcing nigeria",
    "hire developers nigeria",
    "recruitment agency nigeria",
    "staff outsourcing nigeria",
    "team augmentation nigeria",
    "hire programmers nigeria",
    "bulk recruitment nigeria",
    "hire team lagos",
    "outsource recruitment nigeria",
    "hire 10 developers nigeria",
    "team hiring services nigeria",
    "scalable hiring nigeria",
    "project-based hiring nigeria",
    "contract staff hiring nigeria",
  ],
  openGraph: {
    title: "Bulk Hiring & Team Outsourcing in Nigeria",
    description:
      "Hire teams of 5-50+ vetted Nigerian professionals. Fast deployment, quality guarantee, 60% cost savings.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Hiring Solutions for Nigerian Businesses",
    description:
      "Hire vetted teams in 2-4 weeks. From ₦500K. Trusted by 500+ companies.",
  },
};

export default function BulkHiringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


