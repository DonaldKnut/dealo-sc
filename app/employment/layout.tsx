import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs in Nigeria | Remote Jobs Nigeria | Hire Employees | Job Board",
  description:
    "🇳🇬 Find remote jobs, post job listings, hire employees in Nigeria. 10,000+ active job listings. For employers: Hire developers, designers, marketers. For job seekers: Find remote work, freelance gigs, full-time positions. Better than Jobberman & LinkedIn Jobs for Nigerian talent!",
  keywords: [
    "jobs in nigeria",
    "remote jobs nigeria",
    "work from home nigeria",
    "job vacancies nigeria",
    "hire employees nigeria",
    "job board nigeria",
    "recruitment nigeria",
    "job portal nigeria",
    "jobs lagos",
    "jobs abuja",
    "nigerian job site",
    "employment nigeria",
    "career opportunities nigeria",
    "tech jobs nigeria",
    "graduate jobs nigeria",
    "entry level jobs nigeria",
    "jobberman alternative",
    "linkedin jobs nigeria",
    "indeed nigeria",
    "hire developers nigeria",
    "remote work opportunities nigeria",
  ],
  openGraph: {
    title: "Jobs & Employment in Nigeria | Remote Work Opportunities",
    description:
      "10,000+ job listings. Find remote jobs or hire Nigerian talent. Trusted by 500+ companies.",
    type: "website",
    locale: "en_NG",
  },
};

export default function EmploymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
