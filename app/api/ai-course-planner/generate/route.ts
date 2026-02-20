import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic = "", level = "beginner", durationMinutes = 45 } = body || {};
    if (!topic)
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are an expert instructional designer. Create a concise course outline with:
- Title
- Target audience (${level})
- Total duration: ~${durationMinutes} minutes
- Sections (each with title, duration, objectives)
- 5 quiz questions (with answers)
- 2 practical assignments
- Recommended readings/resources (non-copyrighted or official docs)
Keep it scoped to fit the total time. Return plain text, formatted with headings and bullet points.`;

    let outline = `Course Title: ${topic} (${level})\n\nTotal Duration: ~${durationMinutes} minutes\n\nSections:\n1) Introduction (5m)\n- Objective: Overview\n\n2) Core Concepts (20m)\n- Objective: Fundamentals\n\n3) Applied Practice (15m)\n- Objective: Hands-on\n\n4) Wrap-up (5m)\n- Objective: Summary\n\nQuizzes:\n- 5 questions...\n\nAssignments:\n- 2 tasks...\n\nReadings:\n- Official docs...`;

    if (apiKey) {
      try {
        const res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
            apiKey,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: `Topic: ${topic}\n\n${systemPrompt}` }],
                  role: "user",
                },
              ],
              generationConfig: { temperature: 0.6, maxOutputTokens: 1200 },
            }),
          }
        );
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) outline = text;
      } catch (_) {
        // keep default outline
      }
    }

    return NextResponse.json({ outline });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 400 }
    );
  }
}
