import { NextRequest, NextResponse } from "next/server";
import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";

// Validate API key at runtime
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables."
  );
}

// Initialize Google Generative AI instance
const genAI = new GoogleGenerativeAI(apiKey); // Pass the API key as a string directly

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { work } = body;
    if (!work) {
      return NextResponse.json({ error: "Missing work data" }, { status: 400 });
    }

    // Generate prompt for AI based on the work details
    const prompt = `Provide detailed insights for the following work:
      - Title: ${work.title}
      - Description: ${work.description}
      - Price: $${work.price}
      - Experience Level: ${work.experienceLevel}
      - Languages Spoken: ${
        work.languagesSpoken ? work.languagesSpoken.join(", ") : "N/A"
      }
      - Skills: ${work.skills.join(", ")}
      - Portfolio Link: ${work.portfolioLink ? work.portfolioLink : "N/A"}
      - Delivery Date: ${
        work.deliveryDate
          ? new Date(work.deliveryDate).toLocaleDateString()
          : "N/A"
      }
      - Delivery Time: ${work.deliveryTime || "N/A"}
      - Created by: ${work.creator.firstName} ${work.creator.lastName}`;

    // Configure AI generation
    const generationConfig: GenerationConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 300,
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await chatSession.sendMessage("");
    const insights =
      result.response?.text() || "No insights could be generated at this time.";

    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
