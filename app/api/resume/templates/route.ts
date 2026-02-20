import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const templates = [
  {
    id: "professional-two-column",
    name: "Professional Two-Column",
    description: "Modern two-column layout with dark sidebar - perfect for professional resumes.",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean, single-column, ATS-friendly.",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional two-column layout with emphasis on experience.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Subtle accents and section highlights for portfolios.",
  },
];

export async function GET(_req: NextRequest) {
  return NextResponse.json({ templates });
}



