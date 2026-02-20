import {
  nigerianKeywords,
  allNigerianKeywords,
  highPriorityKeywords,
} from "./nigerian-keywords";
import {
  allGlobalKeywords,
  highPriorityGlobalKeywords,
  regionalKeywords,
  countryKeywords,
} from "./global-keywords";

export interface KeywordInjectionConfig {
  pageType:
    | "home"
    | "course"
    | "blog"
    | "job"
    | "freelance"
    | "business"
    | "tech"
    | "writing"
    | "social";
  location?: string;
  industry?: string;
  skill?: string;
  userIntent?: "learn" | "earn" | "network" | "hire" | "sell";
  region?:
    | "westAfrica"
    | "eastAfrica"
    | "southernAfrica"
    | "centralAfrica"
    | "northAfrica"
    | "diaspora"
    | "international"
    | "globalTechHubs"
    | "emergingMarkets";
  country?:
    | "nigeria"
    | "ghana"
    | "kenya"
    | "southAfrica"
    | "egypt"
    | "cameroon";
  includeGlobal?: boolean;
}

export function getRelevantKeywords(config: KeywordInjectionConfig): string[] {
  const {
    pageType,
    location,
    industry,
    skill,
    userIntent,
    region,
    country,
    includeGlobal,
  } = config;

  let keywords: string[] = [];

  // Base keywords based on page type
  switch (pageType) {
    case "home":
      keywords = [
        ...nigerianKeywords.platform,
        ...nigerianKeywords.ai,
        ...nigerianKeywords.business,
        ...nigerianKeywords.freelancing,
        ...nigerianKeywords.jobs,
        ...nigerianKeywords.social,
        ...nigerianKeywords.writing,
        ...nigerianKeywords.bloggers,
        ...nigerianKeywords.tech,
      ];
      break;
    case "course":
      keywords = [
        ...nigerianKeywords.platform,
        ...nigerianKeywords.ai,
        ...nigerianKeywords.tech,
        ...nigerianKeywords.skills,
      ];
      break;
    case "blog":
      keywords = [
        ...nigerianKeywords.writing,
        ...nigerianKeywords.bloggers,
        ...nigerianKeywords.content,
      ];
      break;
    case "job":
      keywords = [
        ...nigerianKeywords.jobs,
        ...nigerianKeywords.freelancing,
        ...nigerianKeywords.business,
      ];
      break;
    case "freelance":
      keywords = [
        ...nigerianKeywords.freelancing,
        ...nigerianKeywords.jobs,
        ...nigerianKeywords.business,
      ];
      break;
    case "business":
      keywords = [
        ...nigerianKeywords.business,
        ...nigerianKeywords.social,
        ...nigerianKeywords.networking,
      ];
      break;
    case "tech":
      keywords = [
        ...nigerianKeywords.tech,
        ...nigerianKeywords.ai,
        ...nigerianKeywords.skills,
      ];
      break;
    case "writing":
      keywords = [
        ...nigerianKeywords.writing,
        ...nigerianKeywords.bloggers,
        ...nigerianKeywords.content,
      ];
      break;
    case "social":
      keywords = [
        ...nigerianKeywords.social,
        ...nigerianKeywords.business,
        ...nigerianKeywords.networking,
      ];
      break;
  }

  // Add location-specific keywords
  if (location) {
    const locationKeywords = nigerianKeywords.cities.filter((city) =>
      city.toLowerCase().includes(location.toLowerCase())
    );
    keywords.push(...locationKeywords);
  }

  // Add industry-specific keywords
  if (industry) {
    const industryKeywords = nigerianKeywords.industries.filter(
      (industryKeyword) =>
        industryKeyword.toLowerCase().includes(industry.toLowerCase())
    );
    keywords.push(...industryKeywords);
  }

  // Add skill-specific keywords
  if (skill) {
    const skillKeywords = nigerianKeywords.skills.filter((skillKeyword) =>
      skillKeyword.toLowerCase().includes(skill.toLowerCase())
    );
    keywords.push(...skillKeywords);
  }

  // Add intent-specific keywords
  if (userIntent) {
    switch (userIntent) {
      case "learn":
        keywords.push(
          ...nigerianKeywords.platform,
          ...nigerianKeywords.ai,
          ...nigerianKeywords.tech
        );
        break;
      case "earn":
        keywords.push(
          ...nigerianKeywords.freelancing,
          ...nigerianKeywords.jobs,
          ...nigerianKeywords.business
        );
        break;
      case "network":
        keywords.push(...nigerianKeywords.social, ...nigerianKeywords.business);
        break;
      case "hire":
        keywords.push(
          ...nigerianKeywords.freelancing,
          ...nigerianKeywords.jobs
        );
        break;
      case "sell":
        keywords.push(
          ...nigerianKeywords.business,
          ...nigerianKeywords.freelancing
        );
        break;
    }
  }

  // Add regional keywords
  if (region && regionalKeywords[region]) {
    keywords.push(...regionalKeywords[region]);
  }

  // Add country-specific keywords
  if (country && countryKeywords[country]) {
    keywords.push(...countryKeywords[country]);
  }

  // Add global keywords if requested
  if (includeGlobal) {
    keywords.push(...highPriorityGlobalKeywords);
    keywords.push(...allGlobalKeywords.slice(0, 100)); // Top 100 global keywords
  }

  // Always include high-priority keywords
  keywords.push(...highPriorityKeywords);

  // Remove duplicates and return
  return Array.from(new Set(keywords));
}

export function generateDynamicMetaDescription(
  baseDescription: string,
  keywords: string[],
  maxLength: number = 160
): string {
  // Select top 3-5 most relevant keywords
  const topKeywords = keywords.slice(0, 5);

  // Create keyword-rich description
  let description = baseDescription;

  // Add keywords naturally
  if (topKeywords.length > 0) {
    const keywordPhrase = topKeywords.slice(0, 3).join(", ");
    description += ` Perfect for ${keywordPhrase} in Nigeria.`;
  }

  // Ensure it doesn't exceed max length
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + "...";
  }

  return description;
}

export function generateDynamicTitle(
  baseTitle: string,
  keywords: string[],
  maxLength: number = 60
): string {
  // Select most relevant keyword
  const topKeyword = keywords[0];

  if (!topKeyword) return baseTitle;

  // Create keyword-rich title
  let title = `${baseTitle} - ${topKeyword}`;

  // Ensure it doesn't exceed max length
  if (title.length > maxLength) {
    title = title.substring(0, maxLength - 3) + "...";
  }

  return title;
}

export function injectKeywordsIntoTemplate(
  template: string,
  keywords: string[],
  replacements: Record<string, string> = {}
): string {
  let content = template;

  // Replace placeholders with keywords
  keywords.forEach((keyword, index) => {
    content = content.replace(
      new RegExp(`\\{keyword${index + 1}\\}`, "g"),
      keyword
    );
  });

  // Replace custom placeholders
  Object.entries(replacements).forEach(([placeholder, value]) => {
    content = content.replace(new RegExp(`\\{${placeholder}\\}`, "g"), value);
  });

  return content;
}

export function generateKeywordRichContent(
  baseContent: string,
  keywords: string[],
  keywordDensity: number = 0.02 // 2% keyword density
): string {
  let content = baseContent;

  // Calculate how many keywords to inject
  const wordCount = baseContent.split(" ").length;
  const targetKeywordCount = Math.floor(wordCount * keywordDensity);

  // Select keywords to inject
  const keywordsToInject = keywords.slice(
    0,
    Math.min(targetKeywordCount, keywords.length)
  );

  // Inject keywords naturally into content
  keywordsToInject.forEach((keyword, index) => {
    // Find good insertion points (after sentences)
    const sentences = content.split(". ");
    if (sentences.length > index + 1) {
      const insertionPoint = index + 1;
      sentences[insertionPoint] = `${keyword} ${sentences[insertionPoint]}`;
      content = sentences.join(". ");
    }
  });

  return content;
}

export function generateLocalSEOContent(
  baseContent: string,
  location: string,
  keywords: string[]
): string {
  let content = baseContent;

  // Add location-specific content
  const locationKeywords = keywords.filter((keyword) =>
    keyword.toLowerCase().includes(location.toLowerCase())
  );

  if (locationKeywords.length > 0) {
    content += ` Perfect for professionals in ${location}.`;
  }

  // Add local business context
  content += ` Join thousands of ${location} professionals who are already learning, connecting, and growing on Dealo.`;

  return content;
}

export function generateCompetitorTargetingContent(
  baseContent: string,
  competitor: string
): string {
  let content = baseContent;

  // Add competitor comparison
  content += ` Better than ${competitor} for Nigerian professionals.`;

  // Add local advantage
  content += ` Designed specifically for the Nigerian market with local payment methods, Naira pricing, and culturally relevant content.`;

  return content;
}

export function generateIntentBasedContent(
  baseContent: string,
  intent: "learn" | "earn" | "network" | "hire" | "sell",
  keywords: string[]
): string {
  let content = baseContent;

  switch (intent) {
    case "learn":
      content += ` Start your learning journey today with expert-led courses designed for Nigerian professionals.`;
      break;
    case "earn":
      content += ` Monetize your skills and find freelance opportunities in Nigeria's growing digital economy.`;
      break;
    case "network":
      content += ` Connect with like-minded professionals and build your network across Nigeria.`;
      break;
    case "hire":
      content += ` Find skilled Nigerian professionals for your projects and business needs.`;
      break;
    case "sell":
      content += ` Sell your courses and services to thousands of Nigerian learners and professionals.`;
      break;
  }

  return content;
}



