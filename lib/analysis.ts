"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function analyzeVideo(videoId: string, transcript: string, userId: string) {
  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < MAX_RETRIES) {
    try {
      console.log(`Attempt ${attempts + 1} of ${MAX_RETRIES} to analyze video:`, videoId);
      
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Analyze the transcript with a timeout
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
      
      const analysisPromise = model.generateContent(prompt);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Analysis timeout")), 30000)
      );
      
      const result = await Promise.race([analysisPromise, timeoutPromise]);
      const response = (result as GenerateContentResult).response.text();
      let analysisData;
      try {
        analysisData = JSON.parse(response);
        
        // Validate the response structure
        if (!analysisData.summary || !analysisData.keyPoints || !analysisData.sentiment) {
          throw new Error("Invalid analysis response structure");
        }
      } catch (parseError) {
        console.error("Error parsing analysis response:", parseError);
        throw new Error("Failed to parse analysis response");
      }
      
      // Save analysis to database with retry
      let dbSaveAttempts = 0;
      while (dbSaveAttempts < 3) {
        try {
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
          break; // Success, exit the retry loop
        } catch (dbError) {
          console.error(`Database save attempt ${dbSaveAttempts + 1} failed:`, dbError);
          if (dbSaveAttempts === 2) throw dbError;
          dbSaveAttempts++;
          await sleep(1000);
        }
      }
      
      // Update video status to completed
      try {
        await convex.mutation(api.videos.updateVideoStatus, {
          videoId: videoId as Id<"videos">,
          status: "completed",
        });
      } catch (statusError) {
        console.error("Error updating video status:", statusError);
        // Don't throw here as the analysis was successful
      }
      
      console.log("Video analysis completed for:", videoId);
      return analysisData;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Analysis attempt ${attempts + 1} failed:`, lastError);
      
      if (attempts < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY * (attempts + 1));
        attempts++;
      } else {
        console.error("All analysis attempts failed");
        
        // Update video status to failed
        try {
          await convex.mutation(api.videos.updateVideoStatus, {
            videoId: videoId as Id<"videos">,
            status: "failed",
          });
        } catch (statusError) {
          console.error("Error updating failure status:", statusError);
        }
        
        throw new Error(`Failed to analyze video after ${MAX_RETRIES} attempts: ${lastError.message}`);
      }
    }
  }
  
  throw lastError || new Error("Unknown error in video analysis");
} 