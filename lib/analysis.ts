"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeVideo(videoId: string, transcript: string, userId: string) {
  try {
    console.log("Starting video analysis for:", videoId);
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Analyze the transcript
    const prompt = `
      Analyze this YouTube video transcript and provide:
      1. A concise summary (max 3 sentences)
      2. 5 key points from the content
      3. Overall sentiment (positive, negative, or neutral)
      4. Content rating (General, Teen, Mature)
      5. 5-7 suggested tags for the video
      
      Transcript:
      ${transcript}
      
      Format your response as JSON:
      {
        "summary": "...",
        "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
        "sentiment": "...",
        "contentRating": "...",
        "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the JSON response
    const analysisData = JSON.parse(response);
    
    // Save analysis to database
    await convex.mutation(api.analysis.saveAnalysis, {
      videoId: videoId as Id<"videos">,
      userId: userId as Id<"users">,
      analysis: {
        summary: analysisData.summary,
        keyPoints: analysisData.keyPoints,
        sentiment: analysisData.sentiment,
        contentRating: analysisData.contentRating,
        suggestedTags: analysisData.suggestedTags
        }
    });
    
    // Update video status to completed
    await convex.mutation(api.videos.updateVideoStatus, {
      videoId: videoId as Id<"videos">,
      status: "completed",
    });
    
    console.log("Video analysis completed for:", videoId);
    return analysisData;
  } catch (error) {
    console.error("Error analyzing video:", error);
    
    // Update video status to failed
    await convex.mutation(api.videos.updateVideoStatus, {
      videoId: videoId as Id<"videos">,
      status: "failed",
    });
    
    throw error;
  }
} 