import {
  GoogleGenerativeAI,
  GenerationConfig,
  ChatSession,
} from "@google/generative-ai";

// Use environment variable for security and flexibility
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

// Model instance and AI generation configuration
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Chapter content interface for type safety
interface ChapterContent {
  title: string;
  description: string;
  formula?: string;
  example?: string;
  videoId: string;
}

// Helper function to safely escape special characters for JSON
function escapeHTML(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

// Enhanced JSON parser with fallback handling
function safeParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(
      "Failed to parse JSON:",
      error,
      "\nInvalid JSON:",
      jsonString
    );
    return fallback;
  }
}

// Generates content specifically for a given topic and chapter name
async function generateAIResponse(
  topic: string,
  description: string
): Promise<string> {
  const session: ChatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `Generate content in JSON format with the following fields:
              {
                "title": "Content title focused on ${topic} - ${description}",
                "description": "Detailed explanation of ${description} in ${topic}",
                "formula": "Relevant formula if applicable",
                "example": "Example in bullet points or text format",
                "videoId": "Video ID related to ${topic} - ${description}"
              }`,
          },
        ],
      },
    ],
  });

  const result = await session.sendMessage("");
  const rawResponse = (await result.response?.text()) || ""; // Ensure rawResponse is a string

  if (!rawResponse) {
    throw new Error("AI returned an empty or undefined response.");
  }

  console.log("Raw AI Response:", rawResponse); // Log raw response
  return rawResponse;
}

// Main function to generate validated and escaped chapter content
export async function generateChapterContent(
  topic: string,
  description: string
): Promise<ChapterContent> {
  try {
    const rawText = await generateAIResponse(topic, description);

    // Default structure for fallback handling
    const defaultChapterContent: ChapterContent = {
      title: `${topic} - ${description}`,
      description: `Content not available for ${description} in ${topic}.`,
      formula: "",
      example: "",
      videoId: "DEFAULT_VIDEO_ID",
    };

    // Parse and validate AI response
    const parsedResponse = safeParse<ChapterContent>(
      rawText,
      defaultChapterContent
    );

    console.log("Parsed Chapter Content:", parsedResponse); // Monitor parsed content

    // Return sanitized content with defaults as needed
    return {
      title: escapeHTML(parsedResponse.title || defaultChapterContent.title),
      description: escapeHTML(
        parsedResponse.description || defaultChapterContent.description
      ),
      formula: escapeHTML(parsedResponse.formula || ""),
      example: escapeHTML(parsedResponse.example || ""),
      videoId: escapeHTML(
        parsedResponse.videoId || defaultChapterContent.videoId
      ),
    };
  } catch (error) {
    console.error("Error generating chapter content:", error);
    throw new Error("Failed to generate chapter content. Please try again.");
  }
}
