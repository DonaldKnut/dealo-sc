import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article" | "course" | "profile";
  locale?: string;
  url?: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    type = "website",
    locale = "en_US",
    url,
    image,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags = [],
  } = config;

  const fullUrl = url
    ? `${process.env.NEXTAUTH_URL || "https://dealo.ng"}${url}`
    : undefined;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: author,
    publisher: "Dealo",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXTAUTH_URL || "https://dealo.ng"),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type: type === "course" ? "website" : type,
      locale,
      url: fullUrl,
      title,
      description,
      siteName: "Dealo",
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      publishedTime,
      modifiedTime,
      section,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
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
    },
  };

  return metadata;
}

export function generateStructuredData(data: {
  type:
    | "Organization"
    | "WebSite"
    | "Article"
    | "Course"
    | "BreadcrumbList"
    | "FAQPage";
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  potentialAction?: any;
  mainEntity?: any;
  itemListElement?: any[];
  headline?: string;
  author?: any;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  publisher?: any;
  courseCode?: string;
  provider?: any;
  offers?: any;
  inLanguage?: string;
  hasPart?: any[];
  about?: any;
  mainContentOfPage?: any;
  breadcrumb?: any[];
  faq?: any[];
}) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": data.type,
  };

  switch (data.type) {
    case "Organization":
      return {
        ...baseStructuredData,
        name: data.name || "Dealo",
        description:
          data.description ||
          "Nigeria's leading platform for learning, earning, and professional networking",
        url: data.url || "https://dealo.ng",
        logo: data.logo || "https://dealo.ng/logo.png",
        sameAs: data.sameAs || [
          "https://twitter.com/dealo_ng",
          "https://linkedin.com/company/dealo-ng",
          "https://facebook.com/dealo.ng",
        ],
        potentialAction: data.potentialAction,
      };

    case "WebSite":
      return {
        ...baseStructuredData,
        name: data.name || "Dealo",
        description:
          data.description ||
          "Nigeria's leading platform for learning, earning, and professional networking",
        url: data.url || "https://dealo.ng",
        potentialAction: data.potentialAction || {
          "@type": "SearchAction",
          target: "https://dealo.ng/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };

    case "Article":
      return {
        ...baseStructuredData,
        headline: data.headline,
        description: data.description,
        image: data.image,
        author: data.author,
        publisher: data.publisher || {
          "@type": "Organization",
          name: "Dealo",
          logo: {
            "@type": "ImageObject",
            url: "https://dealo.ng/logo.png",
          },
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        mainEntityOfPage: data.mainContentOfPage,
      };

    case "Course":
      return {
        ...baseStructuredData,
        name: data.name,
        description: data.description,
        provider: data.provider || {
          "@type": "Organization",
          name: "Dealo",
          url: "https://dealo.ng",
        },
        courseCode: data.courseCode,
        offers: data.offers,
        inLanguage: data.inLanguage || "en",
        hasPart: data.hasPart,
        about: data.about,
      };

    case "BreadcrumbList":
      return {
        ...baseStructuredData,
        itemListElement: data.itemListElement || [],
      };

    case "FAQPage":
      return {
        ...baseStructuredData,
        mainEntity:
          data.faq?.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })) || [],
      };

    default:
      return baseStructuredData;
  }
}
