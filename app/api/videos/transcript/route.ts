"use server";

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getTranscript } from "@/lib/transcript";
import { Id } from "@/convex/_generated/dataModel";
import { auth } from "@clerk/nextjs";
import { analyzeVideo } from "@/lib/analysis";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// export const runtime = 'edge';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { videoId, youtubeId, youtubeUrl } = await req.json();
    
    // Validate input parameters
    if (!videoId || (!youtubeId && !youtubeUrl)) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Debug logging
    console.log("Received request with:", { videoId, youtubeId, youtubeUrl });
    
    // Try to get transcript directly from the URL instead of ID
    let transcript;
    let transcriptError;
    
    try {
      // First try with the ID if available
      if (youtubeId) {
        console.log("Attempting to fetch transcript with ID:", youtubeId);
        transcript = await getTranscript(youtubeId);
      }
    } catch (error) {
      console.error("Error fetching transcript with ID:", error);
      transcriptError = error;
    }
    
    // If ID attempt failed and URL is available, try with URL
    if (!transcript && youtubeUrl) {
      try {
        console.log("Attempting to fetch transcript with URL:", youtubeUrl);
        transcript = await getTranscript(youtubeUrl);
      } catch (urlError) {
        console.error("Error fetching transcript with URL:", urlError);
        // If both attempts failed, throw the most relevant error
        throw transcriptError || urlError;
      }
    }
    
    if (!transcript) {
      throw new Error("Failed to fetch transcript from both ID and URL");
    }
    
    // Save transcript to database
    try {
      await convex.mutation(api.transcripts.createTranscript, {
        videoId: videoId as Id<"videos">,
        content: transcript,
        userId: userId as Id<"users">,
        language: "en",
      });
    } catch (dbError) {
      console.error("Error saving transcript to database:", dbError);
      return NextResponse.json(
        { error: "Failed to save transcript to database" },
        { status: 500 }
      );
    }
    
    // Update video status
    try {
      await convex.mutation(api.videos.updateVideoStatus, {
        videoId: videoId as Id<"videos">,
        status: "processing",
      });
    } catch (statusError) {
      console.error("Error updating video status:", statusError);
      // Don't return here as the transcript was saved successfully
    }
    
    // Start analysis in the background
    try {
      analyzeVideo(videoId, transcript, userId);
    } catch (analysisError) {
      console.error("Error starting video analysis:", analysisError);
      // Don't return here as the core functionality succeeded
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing transcript:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 