import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Career Tips, Tech Insights & Success Stories | Dealo Nigeria",
  description:
    "🇳🇬 Read expert advice on freelancing, career growth, tech skills, remote work tips for Nigerians. Learn from successful Nigerian professionals, get industry insights, discover earning strategies. Updated daily with actionable content for Nigerian freelancers, developers, designers & entrepreneurs.",
  keywords: [
    "freelance tips nigeria",
    "career advice nigeria",
    "tech blog nigeria",
    "remote work tips nigeria",
    "how to freelance nigeria",
    "nigerian success stories",
    "career development nigeria",
    "professional growth nigeria",
    "freelancing guide nigeria",
    "tech industry nigeria",
    "digital skills nigeria",
    "online earning nigeria",
    "business tips nigeria",
    "entrepreneur blog nigeria",
  ],
  openGraph: {
    title: "Dealo Blog - Career & Tech Insights for Nigerian Professionals",
    description:
      "Expert tips on freelancing, career growth, and tech skills for Nigerians. Real success stories, actionable advice.",
    type: "website",
    locale: "en_NG",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


