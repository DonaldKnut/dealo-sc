import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { section, userData, jobTitle, industry, experience } =
      await request.json();

    if (!section) {
      return NextResponse.json(
        { error: "Section type is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    let responseFormat = "";

    switch (section) {
      case "summary":
        prompt = `Generate a compelling professional summary for a resume based on the following information:
        - Job Title: ${jobTitle || "Professional"}
        - Industry: ${industry || "General"}
        - Years of Experience: ${experience || "3-5 years"}
        - User Background: ${userData || "Experienced professional"}
        
        Requirements:
        - 3-4 sentences maximum
        - Focus on achievements and value proposition
        - Use action verbs and quantifiable results when possible
        - Professional and engaging tone
        - ATS-friendly language`;
        break;

      case "skills":
        prompt = `Generate relevant skills for a resume based on:
        - Job Title: ${jobTitle || "Professional"}
        - Industry: ${industry || "General"}
        - Years of Experience: ${experience || "3-5 years"}
        
        Provide a mix of:
        - Technical skills (if applicable)
        - Soft skills
        - Industry-specific skills
        - Leadership skills (if senior level)
        
        Return as a JSON array of skill strings.`;
        responseFormat = "json";
        break;

      case "experience":
        prompt = `Generate 3-4 professional experience bullet points for a resume based on:
        - Job Title: ${jobTitle || "Professional"}
        - Industry: ${industry || "General"}
        - Years of Experience: ${experience || "3-5 years"}
        
        Requirements:
        - Use action verbs (Led, Developed, Implemented, etc.)
        - Include quantifiable achievements
        - Focus on impact and results
        - Professional tone
        - Each bullet point should be 1-2 lines
        
        Return as a JSON array of bullet point strings.`;
        responseFormat = "json";
        break;

      case "achievements":
        prompt = `Generate 3-5 professional achievements for a resume based on:
        - Job Title: ${jobTitle || "Professional"}
        - Industry: ${industry || "General"}
        - Years of Experience: ${experience || "3-5 years"}
        
        Focus on:
        - Quantifiable results (%, $, numbers)
        - Leadership accomplishments
        - Process improvements
        - Team achievements
        - Industry recognition
        
        Return as a JSON array of achievement strings.`;
        responseFormat = "json";
        break;

      default:
        // Full draft: summary + skills + 3 experience bullets
        prompt = `Generate a concise resume draft in JSON with keys: summary (2-3 sentences), skills (array of 8-14 keywords), experienceBullets (array of 3-4 bullet points). Base it on:\nJob Title: ${
          jobTitle || "Professional"
        }\nIndustry: ${industry || "General"}\nExperience: ${
          experience || "3-5 years"
        }\nBackground: ${
          userData || "Experienced professional"
        }\nUse ATS-friendly language and measurable outcomes.`;
        responseFormat = "json";
        break;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (responseFormat === "json") {
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json({ content: parsed });
      } catch (error) {
        // If JSON parsing fails, return as plain text
        return NextResponse.json({ content: text });
      }
    }

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Resume generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume content" },
      { status: 500 }
    );
  }
}
