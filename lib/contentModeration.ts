import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Gemini API key not found. Content moderation will be disabled.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface ModerationResult {
  approved: boolean;
  reason?: string;
  confidence?: number;
}

/**
 * Moderate content using Gemini AI to ensure it follows platform policies
 */
export async function moderateContentWithGemini(
  content: string
): Promise<ModerationResult> {
  if (!genAI) {
    // If Gemini is not configured, allow content (fail open for MVP)
    return { approved: true, reason: "Moderation service unavailable" };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a content moderation system for an educational platform. Analyze the following course content (title/description) and determine if it complies with platform policies.

Platform Policies:
1. No hate speech, discrimination, or offensive content
2. No illegal activities or content promoting illegal acts
3. No adult/sexual content
4. No violence or graphic content
5. Content must be educational or professional in nature
6. No spam, scams, or misleading information
7. No copyright infringement or pirated content
8. No personal attacks or harassment

Content to review: "${content}"

Respond in JSON format only:
{
  "approved": true/false,
  "reason": "brief explanation",
  "confidence": 0.0-1.0
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;
      const parsed = JSON.parse(jsonText);

      return {
        approved: parsed.approved === true,
        reason: parsed.reason || "Content moderation check completed",
        confidence: parsed.confidence || 0.5,
      };
    } catch (parseError) {
      // If JSON parsing fails, check if response contains rejection keywords
      const lowerText = text.toLowerCase();
      const rejectionKeywords = [
        "reject",
        "not approved",
        "violates",
        "inappropriate",
        "not allowed",
        "policy violation",
      ];

      const hasRejection = rejectionKeywords.some((keyword) =>
        lowerText.includes(keyword)
      );

      return {
        approved: !hasRejection,
        reason: hasRejection
          ? "Content may violate platform policies"
          : "Content appears acceptable",
        confidence: 0.7,
      };
    }
  } catch (error: any) {
    console.error("Gemini moderation error:", error);
    // Fail open - allow content if moderation fails
    return {
      approved: true,
      reason: "Moderation service error - content allowed",
      confidence: 0.3,
    };
  }
}


