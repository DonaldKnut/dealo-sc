import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions/authOptions";
import { connect } from "@/database";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

interface AIPrepopulateRequest {
  currentResume?: any;
  enhance?: boolean;
  role?: string;
  industry?: string;
  yearsExperience?: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connect();

    const body: AIPrepopulateRequest = await req.json();
    const { currentResume, enhance, role, industry, yearsExperience } = body;

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // Get user data for context
    const sessionAny = session.user as any;
    const userId = sessionAny?._id || sessionAny?.id || null;
    let userData: any = null;

    if (userId) {
      try {
        userData = await UserModel.findById(userId).select(
          "name email profile role skills experience education"
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    // Build context for AI
    const userContext = userData
      ? `
User Profile:
- Name: ${userData.name || "User"}
- Email: ${userData.email || ""}
- Role: ${userData.role || role || "Professional"}
- Skills: ${userData.skills?.join(", ") || ""}
- Experience: ${userData.experience || yearsExperience || "3-5"} years
- Education: ${userData.education || "Not specified"}
`
      : `
User Context:
- Role: ${role || "Professional"}
- Industry: ${industry || "General"}
- Experience: ${yearsExperience || "3-5"} years
`;

    let prompt = "";

    if (enhance && currentResume) {
      // Enhance existing resume
      prompt = `You are an expert resume writer and career coach. Enhance and improve the following resume with professional, ATS-friendly content.

${userContext}

Current Resume Data:
${JSON.stringify(currentResume, null, 2)}

Tasks:
1. Improve the professional summary to be compelling and keyword-rich (2-3 sentences)
2. Enhance experience descriptions with quantifiable achievements and action verbs
3. Add relevant technical skills based on the role and industry
4. Improve education descriptions if needed
5. Add languages if appropriate (English, Spanish, French, etc.)
6. Ensure all content is professional, ATS-friendly, and uses industry-standard terminology

Return a complete JSON object matching this structure:
{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (optional)",
    "github": "string (optional)"
  },
  "summary": "Enhanced professional summary (2-3 sentences)",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or empty string",
      "current": false,
      "description": "Enhanced job description with quantifiable achievements",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "location": "City, Country",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "current": false
    }
  ],
  "skills": {
    "technical": ["Skill1", "Skill2", "Skill3"],
    "soft": ["Skill1", "Skill2"],
    "languages": [
      {
        "language": "English",
        "proficiency": "Native"
      }
    ]
  }
}

Ensure all dates are in YYYY-MM-DD format. Return ONLY valid JSON, no markdown, no code blocks.`;
    } else {
      // Create new resume from scratch
      prompt = `You are an expert resume writer. Create a complete, professional resume based on the following user context.

${userContext}

Create a comprehensive resume with:
1. Professional summary (2-3 sentences highlighting key strengths)
2. 2-3 relevant work experiences with quantifiable achievements
3. Education background (1-2 entries)
4. Technical skills relevant to the role (8-12 skills)
5. Soft skills (3-5 skills)
6. Languages (at least English, add 1-2 more if appropriate)

Make all content:
- Professional and ATS-friendly
- Use action verbs and quantifiable metrics
- Industry-appropriate terminology
- Realistic and believable

Return a complete JSON object matching this structure:
{
  "personalInfo": {
    "firstName": "Generated first name",
    "lastName": "Generated last name",
    "email": "user@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "City, Country",
    "linkedin": "https://linkedin.com/in/username (optional)",
    "github": "https://github.com/username (optional)"
  },
  "summary": "Professional summary (2-3 sentences)",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or empty string",
      "current": false,
      "description": "Job description with achievements",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "location": "City, Country",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "current": false
    }
  ],
  "skills": {
    "technical": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6", "Skill7", "Skill8"],
    "soft": ["Communication", "Leadership", "Problem Solving"],
    "languages": [
      {
        "language": "English",
        "proficiency": "Native"
      },
      {
        "language": "Spanish",
        "proficiency": "Intermediate"
      }
    ]
  }
}

Ensure all dates are in YYYY-MM-DD format. Return ONLY valid JSON, no markdown, no code blocks.`;
    }

    // Call Gemini API
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini API error:", text);
      return NextResponse.json(
        { error: "AI generation failed", details: text },
        { status: 500 }
      );
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      const text = await res.text();
      console.error("Failed to parse response as JSON:", text);
      return NextResponse.json(
        { error: "Invalid response from AI service", details: text.substring(0, 200) },
        { status: 500 }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text || text.trim().length === 0) {
      console.error("Empty response from Gemini API");
      return NextResponse.json(
        { error: "AI service returned empty response" },
        { status: 500 }
      );
    }

    // Parse JSON response
    let generatedResume;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || text.match(/(\{[\s\S]*\})/);
      const jsonString = jsonMatch ? jsonMatch[1] : text.trim();
      
      if (!jsonString || jsonString.length === 0) {
        throw new Error("No JSON found in response");
      }
      
      generatedResume = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", text.substring(0, 500));
      return NextResponse.json(
        { error: "Failed to parse AI response", raw: text.substring(0, 500) },
        { status: 500 }
      );
    }

    // Merge with existing resume if enhancing
    let finalResume;
    if (enhance && currentResume) {
      finalResume = {
        ...currentResume,
        personalInfo: {
          ...currentResume.personalInfo,
          ...generatedResume.personalInfo,
        },
        summary: generatedResume.summary || currentResume.summary,
        experience: generatedResume.experience || currentResume.experience,
        education: generatedResume.education || currentResume.education,
        skills: {
          technical: Array.from(new Set([
            ...(currentResume.skills?.technical || []),
            ...(generatedResume.skills?.technical || []),
          ])),
          soft: Array.from(new Set([
            ...(currentResume.skills?.soft || []),
            ...(generatedResume.skills?.soft || []),
          ])),
          languages: generatedResume.skills?.languages || currentResume.skills?.languages || [],
        },
      };
    } else {
      // Use user's actual email if available
      if (userData?.email) {
        generatedResume.personalInfo.email = userData.email;
      }
      if (userData?.name) {
        const nameParts = userData.name.split(" ");
        generatedResume.personalInfo.firstName = nameParts[0] || generatedResume.personalInfo.firstName;
        generatedResume.personalInfo.lastName = nameParts.slice(1).join(" ") || generatedResume.personalInfo.lastName;
      }

      finalResume = {
        title: "My Resume",
        template: "professional-two-column",
        ...generatedResume,
        projects: [],
        certifications: [],
        isPublic: false,
        isDefault: false,
      };
    }

    return NextResponse.json({
      success: true,
      resume: finalResume,
      message: enhance ? "Resume enhanced successfully" : "Resume generated successfully",
    });
  } catch (error: any) {
    console.error("AI prepopulation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate resume",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

