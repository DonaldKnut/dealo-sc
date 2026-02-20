import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { question, category, context } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 500,
      },
    });

    // Create a comprehensive prompt based on the category
    let systemPrompt = `You are Sarah, a friendly and professional assistant for Dealo - a comprehensive platform that includes:
- AI-powered courses and certifications
- Freelance marketplace
- Professional networking
- Social platform for professionals
- Business development tools

${context || ""}

Be conversational, warm, and helpful. Use natural language, occasional emojis (but not too many), and make responses feel human. Keep responses concise (2-3 paragraphs max) but comprehensive. Address the user directly and be encouraging.`;

    // Add category-specific context
    switch (category) {
      case "business":
        systemPrompt += `\n\nFocus on business development, entrepreneurship, marketing, strategy, and professional growth.`;
        break;
      case "professional":
        systemPrompt += `\n\nFocus on career development, skill building, professional networking, and workplace success.`;
        break;
      case "learning":
        systemPrompt += `\n\nFocus on effective learning strategies, skill development, and educational approaches.`;
        break;
      case "platform":
        systemPrompt += `\n\nFocus on how to use Dealo platform features effectively.`;
        break;
      default:
        systemPrompt += `\n\nProvide general professional development advice.`;
    }

    const prompt = `${systemPrompt}\n\nUser Question: ${question}\n\nProvide a helpful response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
