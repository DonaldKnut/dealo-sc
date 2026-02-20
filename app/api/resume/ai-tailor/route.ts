import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { role, industry, seniority, coreSkills } = await req.json();

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const prompt = `You are an expert resume tailoring assistant.
Role: ${role || ""}
Industry: ${industry || ""}
Seniority: ${seniority || ""}
Core skills: ${(coreSkills || []).join(", ")}

Return concise JSON with keys: summary (2-3 sentences), skills (array of 8-14 keywords), achievements (array of 3-6 bullet points phrased with impact and metrics), keywords (array), suggestions (array of short tips). Do not include any extra commentary.`;

    // Lightweight call using generative API via fetch to avoid importing SDK
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: text || "Gemini request failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      // Fallback: try to extract JSON block
      const match = text.match(/\{[\s\S]*\}/);
      json = match ? JSON.parse(match[0]) : {};
    }

    return NextResponse.json({ success: true, result: json });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
