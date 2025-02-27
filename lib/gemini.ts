import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeVideoContent(transcript: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Analyze this video transcript and provide insights in the following JSON format:
    {
      "summary": "Brief 2-3 sentence summary",
      "keyPoints": ["Array of 3-5 main points"],
      "sentiment": "overall sentiment (positive/negative/neutral)",
      "suggestedTags": ["3-5 relevant tags"],
      "contentRating": "family-friendly/mature/educational"
    }

    Transcript:
    ${transcript}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze video content");
  }
} 