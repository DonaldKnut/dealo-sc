import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Online Courses Nigeria | Learn Programming, Design, Marketing | Free & Paid",
  description:
    "🇳🇬 10,000+ online courses for Nigerians. Learn programming, web development, graphic design, digital marketing, business skills & more. Many FREE courses! Get certified, upskill, and boost your career. Better than Udemy, Coursera & Alison for Nigerian learners. Start learning today!",
  keywords: [
    "online courses nigeria",
    "free courses nigeria",
    "learn programming nigeria",
    "web development courses nigeria",
    "graphic design courses nigeria",
    "digital marketing courses nigeria",
    "business courses nigeria",
    "data science courses nigeria",
    "ai courses nigeria",
    "udemy nigeria",
    "coursera nigeria",
    "alison courses nigeria",
    "tech training nigeria",
    "coding courses nigeria",
    "learn to code nigeria",
    "online learning nigeria",
    "skill development nigeria",
    "professional courses nigeria",
    "certification courses nigeria",
    "learn online nigeria",
  ],
  openGraph: {
    title: "10,000+ Online Courses for Nigerians | Free & Paid Learning",
    description:
      "Learn in-demand skills. Get certified. Boost your career. Many free courses for Nigerians.",
    type: "website",
    locale: "en_NG",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


