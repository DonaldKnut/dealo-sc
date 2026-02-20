import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      history = [],
      role = "software_engineer",
      seniority = "mid",
    } = body || {};

    const lastTwo = history.slice(-3);
    const prompt = `You are an expert interviewer for a ${seniority} ${role} position.
Generate the next single interview question only (concise, one sentence), based on this recent Q&A history:
${JSON.stringify(lastTwo)}
Avoid repeating previous questions. Ask progressively deeper, practical, real-world questions.`;

    const apiKey = process.env.GEMINI_API_KEY;
    let question =
      "Tell me about a challenging project you worked on recently and your specific contributions.";

    if (apiKey) {
      try {
        // Minimal call to Gemini via Google Generative Language API (text-only)
        const res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
            apiKey,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                  role: "user",
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 128,
              },
            }),
          }
        );
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) question = text;
      } catch (_) {
        // Fallback silently to default
      }
    }

    return NextResponse.json({ question });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 400 }
    );
  }
}
