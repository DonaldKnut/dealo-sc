import { Home, Zap, Code, Package, Webhook, Key } from "lucide-react";

export interface DocsNavItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
  icon?: any;
  children?: DocsNavItem[];
}

export const docsNavigation: DocsNavItem[] = [
  {
    title: "Overview",
    href: "/docs",
    icon: Home,
    description: "Start here to understand Dealo's platform and APIs",
  },
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: Zap,
    description: "Auth keys, environments, and your first request",
  },
  {
    title: "API Reference",
    href: "/docs/api",
    icon: Code,
    description: "REST resources, response schemas, errors",
    badge: "Live",
  },
  {
    title: "SDKs",
    href: "/docs/sdks",
    icon: Package,
    description: "Install and configure Dealo SDKs",
  },
  {
    title: "Webhooks",
    href: "/docs/webhooks",
    icon: Webhook,
    description: "Notifications for jobs, payouts, and verifications",
  },
  {
    title: "Authentication",
    href: "/docs/auth",
    icon: Key,
    description: "OAuth, API keys, token lifecycles",
  },
];


