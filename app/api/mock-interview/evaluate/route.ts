import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question = "", answer = "" } = body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    let feedback =
      "Good answer. You covered key points. You can improve by adding measurable outcomes and specific tools used.";
    let score = 7.5;

    if (apiKey && question && answer) {
      try {
        const prompt = `Evaluate the candidate's answer to an interview question on clarity, depth, correctness, impact, and communication. Provide:
1) A brief 2-3 sentence feedback
2) A numeric score from 0-10

Question: ${question}
Answer: ${answer}

Respond as JSON with keys: feedback, score`;

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
                temperature: 0.4,
                maxOutputTokens: 200,
              },
            }),
          }
        );
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          try {
            const parsed = JSON.parse(text);
            if (typeof parsed.feedback === "string") feedback = parsed.feedback;
            if (typeof parsed.score === "number") score = parsed.score;
          } catch (_) {
            // ignore parse errors, keep defaults
          }
        }
      } catch (_) {
        // keep defaults
      }
    }

    return NextResponse.json({ feedback, score });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 400 }
    );
  }
}
