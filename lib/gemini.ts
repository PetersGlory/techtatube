import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeVideoContent(transcript: string) {
  try {
    // Change from gemini-pro to gemini-1.5-flash for the free version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      // Return a simplified response if JSON parsing fails
      return {
        summary: "Failed to parse response",
        keyPoints: ["Error processing transcript"],
        sentiment: "neutral",
        suggestedTags: ["error"],
        contentRating: "unknown"
      };
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze video content");
  }
}