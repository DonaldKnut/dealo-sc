"use client";

import type { ReactNode } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import { docsNavigation } from "@/constants/docsNav";

export default function DocsRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DocsLayout nav={docsNavigation}>{children}</DocsLayout>;
}


