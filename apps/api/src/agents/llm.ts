import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

let aiInstance: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!aiInstance) {
    aiInstance = new GoogleGenerativeAI(config.geminiApiKey || process.env.GEMINI_API_KEY || "mock-key");
  }
  return aiInstance;
}

export async function generateStructuredOutput<T>(
  prompt: string,
  schemaDescription: string,
  fallback: () => T
): Promise<T> {
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "mock-key") {
    return fallback();
  }

  try {
    const ai = getGeminiClient();
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const callPromise = model.generateContent(
      `${prompt}\n\nYou must return ONLY valid raw JSON matching this schema: ${schemaDescription}. Do not include markdown code block formatting (like \`\`\`json). Just the raw json string.`
    );
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("LLM generation timed out after 6 seconds")), 6000)
    );

    const response = await Promise.race([callPromise, timeoutPromise]);
    const text = response.response.text()?.trim() || "";
    const cleanJson = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
    return JSON.parse(cleanJson) as T;
  } catch (error) {
    console.warn("Gemini call failed, timed out or rate-limited, invoking robust fallback:", error);
    return fallback();
  }
}
