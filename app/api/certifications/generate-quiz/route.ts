import { NextRequest, NextResponse } from "next/server";

type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number; // 0-based index
};

export async function POST(request: NextRequest) {
  try {
    const {
      topic = "",
      level = "beginner",
      numQuestions = 5,
    } = await request.json();
    if (!topic)
      return NextResponse.json({ error: "Topic required" }, { status: 400 });

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    let quiz: QuizQuestion[] = Array.from({ length: numQuestions }, (_, i) => ({
      question: `Sample ${i + 1}: ${topic} basics`,
      options: ["A", "B", "C", "D"],
      answerIndex: 0,
    }));

    if (apiKey) {
      try {
        const prompt = `Create ${numQuestions} multiple-choice quiz questions on ${topic} for ${level} learners. Return strict JSON array with objects: {question, options[4], answerIndex}. Example: [{"question":"What is X?","options":["A","B","C","D"],"answerIndex":0}]`;
        const res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
            apiKey,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.6, maxOutputTokens: 1500 },
            }),
          }
        );
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          // Try to extract JSON from the response
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          const jsonStr = jsonMatch ? jsonMatch[0] : text;
          try {
            const parsed = JSON.parse(jsonStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Validate structure
              const valid = parsed.every(
                (q) =>
                  q.question &&
                  Array.isArray(q.options) &&
                  q.options.length === 4 &&
                  typeof q.answerIndex === "number" &&
                  q.answerIndex >= 0 &&
                  q.answerIndex < 4
              );
              if (valid) quiz = parsed;
            }
          } catch (parseErr) {
            console.error("Failed to parse quiz JSON:", parseErr);
          }
        }
      } catch {}
    }

    return NextResponse.json({ quiz });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}
