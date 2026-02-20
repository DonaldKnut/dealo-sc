import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dealonetwork.com";
  const lastModified = new Date();

  // High priority pages (1.0) - Main landing pages
  const highPriority: string[] = [
    "/",
    "/marketplace",
    "/courses",
    "/employment",
    "/blog",
  ];

  // Medium-high priority (0.9) - Key features
  const mediumHighPriority: string[] = [
    "/certifications/explore",
    "/employment/bulk-hiring",
    "/search/freelance",
    "/search/professionals",
    "/dealoforge",
  ];

  // Medium priority (0.8) - Important pages
  const mediumPriority: string[] = [
    "/learn",
    "/explore",
    "/earn",
    "/jobs",
    "/gigs",
    "/certifications/my-certifications",
    "/mock-interview",
    "/solutions/businesses",
    "/solutions/individuals",
  ];

  // Standard priority (0.7) - Secondary pages
  const standardPriority: string[] = [
    "/africa",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
    "/scratch-cards",
    "/onboarding",
    "/social/feed",
    "/messenger",
  ];

  // Low priority (0.5) - Auth pages
  const lowPriority: string[] = ["/sign-in", "/complete-profile"];

  const createSitemapEntries = (
    routes: string[],
    priority: number,
    changeFreq:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never" = "weekly"
  ) =>
    routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency: changeFreq,
      priority,
    }));

  return [
    ...createSitemapEntries(highPriority, 1.0, "daily"),
    ...createSitemapEntries(mediumHighPriority, 0.9, "daily"),
    ...createSitemapEntries(mediumPriority, 0.8, "weekly"),
    ...createSitemapEntries(standardPriority, 0.7, "weekly"),
    ...createSitemapEntries(lowPriority, 0.5, "monthly"),
  ];
}
