import {
  GoogleGenerativeAI,
  GenerationConfig,
  ChatSession,
} from "@google/generative-ai";

// Fetch the API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

// Initialize the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Define the configuration for text generation
const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Define the expected structure for the course layout
interface Chapter {
  chapter_name: string;
  content: Array<{
    type: string;
    title: string;
    description: string;
    duration?: string;
  }>;
}

interface CourseLayout {
  category: string;
  topic: string;
  description: string;
  difficultyLevel: string;
  courseDuration: string;
  noOfChapters: string;
  addVideo: boolean;
  chapters: Chapter[];
}

// Function to generate the course layout using Gemini API
export const generateCourseLayout = async (
  formData: Omit<CourseLayout, "chapters"> // Exclude chapters from the input
): Promise<CourseLayout> => {
  const chatSession: ChatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `Generate a detailed course layout based on the following details:
              Category: ${formData.category}
              Topic: ${formData.topic}
              Description: ${formData.description}
              Difficulty Level: ${formData.difficultyLevel}
              Course Duration: ${formData.courseDuration}
              Number of Chapters: ${formData.noOfChapters}
              Add Video: ${formData.addVideo ? "Yes" : "No"}.

              Each chapter must have:
              - A unique title.
              - A description.
              - Topics covered (if applicable).
              - Placeholder content if specific details are not available.`,
          },
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage("");

    // Parse the response text into JSON
    const parsedResponse = JSON.parse(result.response?.text() || "{}");

    // Validate that the response includes chapters and all necessary fields
    if (!parsedResponse.chapters || !Array.isArray(parsedResponse.chapters)) {
      throw new Error(
        "Invalid response: 'chapters' is missing or not an array."
      );
    }

    // Ensure chapters array matches the requested number of chapters
    const requestedChapterCount = parseInt(formData.noOfChapters, 10);
    if (parsedResponse.chapters.length !== requestedChapterCount) {
      throw new Error(
        `Mismatch: Expected ${requestedChapterCount} chapters, but got ${parsedResponse.chapters.length}.`
      );
    }

    // Return the parsed response as a CourseLayout
    return {
      category: formData.category,
      topic: formData.topic,
      description: formData.description,
      difficultyLevel: formData.difficultyLevel,
      courseDuration: formData.courseDuration,
      noOfChapters: formData.noOfChapters,
      addVideo: formData.addVideo,
      chapters: parsedResponse.chapters, // Use AI-generated chapters
    };
  } catch (error) {
    console.error("Error generating course layout:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};
