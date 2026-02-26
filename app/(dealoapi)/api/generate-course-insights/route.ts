import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI(): GoogleGenerativeAI | null {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("NEXT_PUBLIC_GEMINI_API_KEY is missing.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

// Define TypeScript types
interface Course {
  name: string;
  courseOutput?: {
    overview?: string;
  };
  category: string;
  level: string;
  price?: string;
  publish: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { course }: { course?: Course } = body;

    console.log("Incoming Request Body:", body);

    // Validate required fields
    if (!course || !course.name || !course.category || !course.level) {
      console.error("Missing required course data in request body");
      return NextResponse.json(
        { error: "Missing required course data: name, category, level" },
        { status: 400 }
      );
    }

    // Convert to expected format
    const formattedCourse = {
      title: course.name,
      description: course.courseOutput?.overview || "No description provided",
      experienceLevel: course.level,
      price: course.price || "Not specified",
      category: course.category,
      isPublished: course.publish,
    };

    // Construct AI prompt
    const prompt = `Provide detailed insights for the following course:
      - Title: ${formattedCourse.title}
      - Description: ${formattedCourse.description}
      - Experience Level: ${formattedCourse.experienceLevel}
      - Price: ${formattedCourse.price}
      - Category: ${formattedCourse.category}
      - Published: ${formattedCourse.isPublished ? "Yes" : "No"}
      
      Format the response as:
      - Key Takeaways:
      - Target Audience:
      - Content Suggestions:`;

    const genAI = getGenAI();
    if (!genAI) {
      return NextResponse.json(
        { error: "Gemini API is not configured. Set NEXT_PUBLIC_GEMINI_API_KEY." },
        { status: 503 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const insights = response.text();

    console.log("Generated Insights:", insights);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
