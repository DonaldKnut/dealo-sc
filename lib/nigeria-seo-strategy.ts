/**
 * COMPREHENSIVE NIGERIAN SEO STRATEGY
 * Target: Compete with Udemy, LinkedIn, Fiverr, Turing in Nigerian market
 */

export const NIGERIAN_SEO_KEYWORDS = {
  // Primary Money Keywords (High Intent)
  primary: [
    "freelance jobs in nigeria",
    "online courses nigeria",
    "learn programming nigeria",
    "freelance marketplace nigeria",
    "hire freelancers nigeria",
    "online learning platform nigeria",
    "remote jobs nigeria",
    "skill development nigeria",
    "professional training nigeria",
    "certified courses nigeria",
  ],

  // City-Specific (Local SEO)
  cities: [
    "freelancer lagos",
    "freelancer abuja",
    "online courses lagos",
    "remote jobs lagos",
    "tech training lagos",
    "business courses abuja",
    "freelance work port harcourt",
    "online learning ibadan",
    "professional development enugu",
    "skill training kano",
  ],

  // Category-Specific
  categories: {
    freelancing: [
      "become a freelancer in nigeria",
      "freelance website nigeria",
      "how to freelance in nigeria",
      "best freelance sites for nigerians",
      "nigerian freelancers",
      "upwork alternative nigeria",
      "fiverr nigeria",
      "freelance graphic designer nigeria",
      "freelance developer nigeria",
      "freelance writer nigeria",
    ],
    learning: [
      "best online courses in nigeria",
      "free online courses nigeria",
      "learn tech skills nigeria",
      "programming courses nigeria",
      "digital marketing courses nigeria",
      "udemy alternative nigeria",
      "coursera nigeria",
      "alison courses nigeria",
      "tech training lagos",
      "coding bootcamp nigeria",
    ],
    jobs: [
      "remote jobs nigeria 2024",
      "work from home nigeria",
      "online jobs nigeria",
      "nigerian job sites",
      "jobberman alternative",
      "linkedin jobs nigeria",
      "graduate jobs nigeria",
      "entry level jobs nigeria",
      "tech jobs nigeria",
      "part time jobs nigeria",
    ],
    networking: [
      "professional networking nigeria",
      "linkedin alternative nigeria",
      "business networking nigeria",
      "connect with professionals nigeria",
      "nigerian professionals network",
      "business connections nigeria",
    ],
  },

  // Long-tail Questions (Featured Snippets)
  questions: [
    "how to make money online in nigeria",
    "best way to learn programming in nigeria",
    "where to find freelance work in nigeria",
    "how much do freelancers earn in nigeria",
    "best online courses for nigerians",
    "how to become a certified professional in nigeria",
    "where to hire developers in nigeria",
    "best platform for online learning in nigeria",
    "how to upskill in nigeria",
    "remote work opportunities for nigerians",
  ],

  // Competitor Comparison
  competitive: [
    "dealo vs fiverr",
    "dealo vs upwork",
    "dealo vs udemy",
    "dealo vs linkedin",
    "best alternative to fiverr in nigeria",
    "nigerian alternative to upwork",
    "better than udemy for nigerians",
    "linkedin alternative for african professionals",
  ],
};

export const STRUCTURED_DATA_TEMPLATES = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dealo",
    alternateName: ["Dealo Network", "Dealo Africa", "Dealo Nigeria"],
    url: "https://dealonetwork.com",
    logo: "https://dealonetwork.com/dealo_logo.png",
    description:
      "Nigeria's #1 platform for freelancing, online learning, professional networking, and remote work opportunities. Join 50,000+ Nigerian zoom earning and learning.",
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "Dealo Team",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
      addressRegion: "Lagos",
      addressLocality: "Lagos",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+234-XXX-XXX-XXXX",
        contactType: "customer service",
        email: "hello@dealo.africa",
        areaServed: "NG",
        availableLanguage: ["en", "yo", "ig", "ha"],
      },
    ],
    sameAs: [
      "https://twitter.com/dealo_ng",
      "https://linkedin.com/company/dealo",
      "https://facebook.com/dealo.ng",
      "https://instagram.com/dealo_ng",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://dealonetwork.com/search/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dealo - Nigeria's Leading Professional Platform",
    url: "https://dealonetwork.com",
    description:
      "Find freelance work, take courses, network with professionals, and build your career in Nigeria. 50,000+ active users earning and learning daily.",
    inLanguage: "en-NG",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://dealonetwork.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  },

  breadcrumb: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://dealonetwork.com${item.url}`,
    })),
  }),

  faqPage: (faqs: { question: string; answer: string }[]) => ({
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
  }),
};

export const NIGERIAN_FAQS = [
  {
    question: "How can I make money as a freelancer in Nigeria?",
    answer:
      "Join Dealo to access thousands of freelance opportunities from Nigerian and international clients. Create your profile, showcase your portfolio, and start bidding on projects. We support payment in Naira via Paystack and Flutterwave.",
  },
  {
    question: "Are the courses on Dealo recognized in Nigeria?",
    answer:
      "Yes! Dealo offers industry-recognized certifications that are valued by Nigerian employers. Our AI-powered assessments ensure you gain practical skills that matter in the Nigerian job market.",
  },
  {
    question: "How do I get paid as a Nigerian freelancer on Dealo?",
    answer:
      "We use secure escrow payments with Paystack and Flutterwave. Clients pay upfront, funds are held safely, and released to you once work is approved. We charge only 10% platform fee - much lower than Fiverr or Upwork.",
  },
  {
    question: "Is Dealo free to use in Nigeria?",
    answer:
      "Yes! Creating an account, browsing opportunities, and accessing many courses is completely free. We only charge a small fee when you successfully complete paid projects or purchase premium courses.",
  },
  {
    question: "Can I hire Nigerian freelancers for my business?",
    answer:
      "Absolutely! Dealo has 50,000+ vetted Nigerian professionals. Post your job requirements, review portfolios, and hire the best talent. We also offer bulk hiring services for teams of 5-50+ people.",
  },
  {
    question: "What makes Dealo better than Fiverr or Upwork for Nigerians?",
    answer:
      "Dealo is built FOR Nigerians, BY Nigerians. We support local payment methods (Paystack, Flutterwave), charge lower fees (10% vs 20%), offer Naira pricing, and understand the Nigerian market better than foreign platforms.",
  },
  {
    question: "How long does it take to start earning on Dealo?",
    answer:
      "Nigerian freelancers can start earning within 24-48 hours! Create your profile, upload portfolio samples, and start applying to projects immediately. First-time users often get their first client within a week.",
  },
  {
    question: "Can I learn new skills on Dealo if I'm a beginner?",
    answer:
      "Yes! We have courses for all levels - from complete beginners to advanced zoom. Our AI creates personalized learning paths based on your goals, and many courses are FREE for Nigerian users.",
  },
];

export function generatePageMetadata(page: {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  image?: string;
  type?: "website" | "article" | "profile";
}) {
  const baseUrl = "https://dealonetwork.com";
  const fullUrl = `${baseUrl}${page.url}`;

  return {
    title: `${page.title} | Dealo - Nigeria's #1 Professional Platform`,
    description: page.description,
    keywords: [
      ...page.keywords,
      "dealo",
      "dealo network",
      "nigeria",
      "nigerian",
      "lagos",
      "abuja",
    ],
    openGraph: {
      title: page.title,
      description: page.description,
      url: fullUrl,
      siteName: "Dealo",
      locale: "en_NG",
      type: page.type || "website",
      images: [
        {
          url: page.image || `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [page.image || `${baseUrl}/twitter-image.jpg`],
      creator: "@dealo_ng",
    },
    alternates: {
      canonical: fullUrl,
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
  };
}


