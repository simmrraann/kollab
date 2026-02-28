import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const generateNotes = async (topic: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  if (!topic || topic.trim() === "") {
    throw new Error("Topic is required to generate notes.");
  }

  try {
    // Choose the model - gemini-1.5-flash is generally faster for these tasks
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Act as an expert, highly knowledgeable tutor. 
Generate well-structured, comprehensive, and easy-to-understand study notes on the topic: "${topic}".

Please format the response using standard Markdown. Include:
- A clear main heading (# Heading)
- Relevant subheadings (## Subheadings) for different sections
- Bullet points to organize key concepts or facts
- Bold text (**text**) to emphasize important terms or definitions
- Ensure the language is educational, engaging, and accurate.

Do not include any other conversational text; just output the Markdown notes directly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating notes with Gemini:", error);
    throw new Error("Failed to generate notes. Please try again later.");
  }
};
