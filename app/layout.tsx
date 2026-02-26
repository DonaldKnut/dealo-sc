import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import ConditionalLayout from "./ConditionalLayout";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";
import NotificationContainer from "@/components/ui/Notification";
import ErrorBoundary from "@/components/ErrorBoundary";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ClientOnly from "@/components/ClientOnly";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default:
      "Dealo - Nigeria's #1 Freelance, Learning & Professional Platform | Hire Freelancers, Take Courses, Find Jobs",
    template: "%s | Dealo Nigeria",
  },
  description:
    "🇳🇬 Nigeria's largest platform for freelancers, online learning, remote jobs & professional networking. 50,000+ Nigerians earning ₦500M+ monthly. Find freelance work, hire talent, take certified courses, network with professionals. Better than Fiverr, Upwork & Udemy for Nigerians!",
  keywords: [
    // Primary Keywords
    "freelance jobs nigeria",
    "online courses nigeria",
    "hire freelancers nigeria",
    "remote jobs nigeria",
    "freelance marketplace nigeria",
    "online learning platform nigeria",

    // Location-Specific
    "freelancer lagos",
    "freelancer abuja",
    "remote jobs lagos",
    "online courses lagos",
    "tech training nigeria",

    // Category-Specific
    "learn programming nigeria",
    "graphic design courses nigeria",
    "digital marketing nigeria",
    "business courses nigeria",
    "professional training nigeria",
    "certified courses nigeria",

    // Competitive
    "fiverr alternative nigeria",
    "upwork alternative nigeria",
    "udemy alternative nigeria",
    "linkedin nigeria",
    "best freelance site nigeria",

    // Money Keywords
    "make money online nigeria",
    "work from home nigeria",
    "earn money freelancing nigeria",
    "nigerian freelancers",
    "hire nigerian developers",

    // Long-tail
    "how to become a freelancer in nigeria",
    "best online courses for nigerians",
    "where to find freelance work nigeria",
    "professional networking platform nigeria",
    "skill development courses nigeria",
  ],
  authors: [{ name: "Dealo Team" }],
  creator: "Dealo",
  publisher: "Dealo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://dealo.ng"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    title:
      "Dealo - Nigeria's Premier Learning & Professional Networking Platform",
    description:
      "Connect, learn, and grow with Dealo's AI-powered professional platform. Join thousands of Nigerian professionals, bloggers, and entrepreneurs building their careers.",
    siteName: "Dealo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dealo - Nigeria Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Dealo - Nigeria's Premier Learning & Professional Networking Platform",
    description:
      "Connect, learn, and grow with Dealo's AI-powered professional platform. Join thousands of Nigerian professionals, bloggers, and entrepreneurs.",
    images: ["/twitter-image.jpg"],
    creator: "@dealo_ng",
    site: "@dealo_ng",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body
        className="font-sans overflow-x-hidden antialiased bg-gradient-to-br from-black via-[#0f1a0f] to-black"
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <ErrorBoundary>
          <ClientOnly>
            <GlobalErrorHandler />
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <AuthProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </AuthProvider>
            </ThemeProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#1a2e1a",
                  color: "#fff",
                  border: "1px solid #22c55e",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
            <NotificationContainer />
          </ClientOnly>
        </ErrorBoundary>
      </body>
    </html>
  );
}
