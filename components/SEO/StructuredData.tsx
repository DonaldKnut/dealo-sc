import Script from "next/script";
import { generateStructuredData } from "@/lib/seo";

interface StructuredDataProps {
  type: "Organization" | "Course" | "Article" | "Person";
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = generateStructuredData({ type, ...data });

  return (
    <Script
      id={`json-ld-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  breadcrumbs: BreadcrumbItem[];
}

export function BreadcrumbStructuredData({
  breadcrumbs,
}: BreadcrumbStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dealo.ng";

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: (breadcrumbs || []).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  return (
    <Script
      id="json-ld-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData),
      }}
    />
  );
}

interface FAQStructuredDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="json-ld-faq"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  );
}

interface CourseStructuredDataProps {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: {
      name: string;
      bio: string;
    };
    price: {
      amount: number;
      currency: string;
    };
    duration: string;
    level: string;
    rating: {
      average: number;
      count: number;
    };
    thumbnail: string;
    category: string;
    tags: string[];
    whatYouWillLearn: string[];
    prerequisites: string[];
    language: string;
    lastUpdated: string;
  };
}

export function CourseStructuredData({ course }: CourseStructuredDataProps) {
  const courseData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Dealo",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://dealo.ng",
    },
    instructor: {
      "@type": "Person",
      name: course.instructor.name,
      description: course.instructor.bio,
    },
    courseMode: "online",
    educationalLevel: course.level,
    inLanguage: course.language || "en",
    isAccessibleForFree: course.price.amount === 0,
    image: course.thumbnail,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: course.rating.average,
      reviewCount: course.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    coursePrerequisites: course.prerequisites.join(", "),
    teaches: course.whatYouWillLearn,
    about: {
      "@type": "Thing",
      name: course.category,
    },
    keywords: course.tags.join(", "),
    offers: {
      "@type": "Offer",
      price: course.price.amount,
      priceCurrency: course.price.currency,
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
    },
    dateModified: course.lastUpdated,
  };

  return (
    <Script
      id="json-ld-course"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(courseData),
      }}
    />
  );
}
